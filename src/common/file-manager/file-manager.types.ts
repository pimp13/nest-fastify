export interface UploadOptions {
  folder?: string;
  allowedMimes?: string[];
  maxSizeByte?: number;
}

export interface UploadedFile {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
}
