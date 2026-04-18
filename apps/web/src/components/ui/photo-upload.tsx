"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { uploadPhoto } from "@/lib/api";

type PhotoEntity = "client" | "supplier" | "driver" | "vehicle";

type PhotoUploadProps = {
  entity: PhotoEntity;
  value?: string;
  onChange: (photoUrl: string) => void;
  className?: string;
  title?: string;
  rounded?: boolean;
};

export function PhotoUpload({
  entity,
  value,
  onChange,
  className,
  title = "Foto",
  rounded = true,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem válida");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadPhoto(file, entity);
      onChange(result.photoUrl);
      toast.success("Foto enviada e otimizada com sucesso");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Erro ao enviar foto");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-brand-text-primary">{title}</p>

      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-16 h-16 border border-brand-border bg-slate-50 overflow-hidden flex items-center justify-center",
            rounded ? "rounded-full" : "rounded-xl",
          )}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="w-5 h-5 text-brand-text-secondary" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            leftIcon={
              uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )
            }
          >
            {uploading ? "Enviando..." : "Escolher foto"}
          </Button>
        </div>
      </div>
      <p className="text-xs text-brand-text-secondary">
        A imagem é redimensionada para até 300px e compactada automaticamente.
      </p>
    </div>
  );
}
