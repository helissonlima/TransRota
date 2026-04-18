import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

export type StoredObject = {
  key: string;
  contentType?: string;
  size?: number;
};

@Injectable()
export class StorageService {
  private readonly bucket: string;
  private readonly client: S3Client;

  constructor(private readonly config: ConfigService) {
    const endpoint =
      this.config.get<string>("STORAGE_ENDPOINT") ?? "http://localhost:9000";
    const accessKeyId =
      this.config.get<string>("STORAGE_ACCESS_KEY") ?? "minioadmin";
    const secretAccessKey =
      this.config.get<string>("STORAGE_SECRET_KEY") ?? "minioadmin";

    this.bucket = this.config.get<string>("STORAGE_BUCKET") ?? "transrota";
    this.client = new S3Client({
      region: "us-east-1",
      endpoint,
      forcePathStyle: true,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  getBucketName() {
    return this.bucket;
  }

  async ensureBucket() {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      return;
    } catch {
      try {
        await this.client.send(
          new CreateBucketCommand({ Bucket: this.bucket }),
        );
      } catch (error: any) {
        throw new InternalServerErrorException(
          `Falha ao criar bucket ${this.bucket}: ${error?.message ?? "erro desconhecido"}`,
        );
      }
    }
  }

  async optimizeAndUploadPhoto(params: {
    fileBuffer: Buffer;
    tenantId: string;
    entity: string;
    fileName?: string;
  }) {
    const { fileBuffer, tenantId, entity, fileName } = params;

    await this.ensureBucket();

    const optimized = await sharp(fileBuffer)
      .rotate()
      .resize({
        width: 300,
        height: 300,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 72, mozjpeg: true })
      .toBuffer();

    const safeEntity =
      entity.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase() || "entity";
    const safeName = (fileName ?? "foto")
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const key = `tenants/${tenantId}/photos/${safeEntity}/${Date.now()}-${safeName}.jpg`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: optimized,
        ContentType: "image/jpeg",
      }),
    );

    return {
      key,
      contentType: "image/jpeg",
      size: optimized.byteLength,
      width: 300,
      height: 300,
    };
  }

  async getObject(params: { key: string }) {
    const { key } = params;

    try {
      const result = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      if (!result.Body) throw new NotFoundException("Arquivo não encontrado");

      const bytes = await result.Body.transformToByteArray();
      return {
        buffer: Buffer.from(bytes),
        contentType: result.ContentType ?? "application/octet-stream",
      };
    } catch (error: any) {
      if (error?.name === "NoSuchKey") {
        throw new NotFoundException("Arquivo não encontrado");
      }
      throw new InternalServerErrorException(
        `Falha ao carregar arquivo: ${error?.message ?? "erro desconhecido"}`,
      );
    }
  }

  async listObjects(prefix?: string): Promise<StoredObject[]> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      return [];
    }

    const output: StoredObject[] = [];
    let continuationToken: string | undefined;

    do {
      const page = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );

      for (const item of page.Contents ?? []) {
        if (!item.Key) continue;
        output.push({
          key: item.Key,
          size: item.Size,
        });
      }

      continuationToken = page.IsTruncated
        ? page.NextContinuationToken
        : undefined;
    } while (continuationToken);

    return output;
  }

  async putObjectFromBackup(params: {
    key: string;
    buffer: Buffer;
    contentType?: string;
  }) {
    const { key, buffer, contentType } = params;
    await this.ensureBucket();
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType ?? "application/octet-stream",
      }),
    );
  }
}
