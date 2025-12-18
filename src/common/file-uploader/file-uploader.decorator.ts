import { SetMetadata } from '@nestjs/common';
import { FileUploderOptions } from './file-uploader.interceptor';

export const FILE_OPTIONS_KEY = 'fileOptions' as const;

export const FileUploader = (options: FileUploderOptions) =>
  SetMetadata(FILE_OPTIONS_KEY, options);
