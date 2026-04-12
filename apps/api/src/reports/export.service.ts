import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExportService {
  async generateExcel(
    title: string,
    columns: { header: string; key: string; width?: number }[],
    rows: any[],
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'TransRota';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet(title);

    // Header styling
    sheet.columns = columns.map((col) => ({
      header: col.header,
      key: col.key,
      width: col.width ?? 20,
    }));

    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E40AF' },
    };
    headerRow.alignment = { horizontal: 'center' };

    // Data rows
    for (const row of rows) {
      const addedRow = sheet.addRow(row);
      addedRow.alignment = { vertical: 'middle' };
    }

    // Alternate row colors
    for (let i = 2; i <= sheet.rowCount; i++) {
      if (i % 2 === 0) {
        const row = sheet.getRow(i);
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF1F5F9' },
        };
      }
    }

    // Auto filter
    if (rows.length > 0) {
      sheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: columns.length },
      };
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  generateCsv(
    columns: { header: string; key: string }[],
    rows: any[],
  ): string {
    const headers = columns.map((c) => c.header).join(';');
    const dataRows = rows.map((row) =>
      columns
        .map((col) => {
          const val = row[col.key];
          if (val === null || val === undefined) return '';
          const str = String(val);
          return str.includes(';') || str.includes('"')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(';'),
    );
    return [headers, ...dataRows].join('\n');
  }
}
