import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { extname } from 'path';
import * as fs from 'fs';
import { pipeline } from 'stream/promises';
import { FILE_OPTIONS_KEY } from './file-uploader.decorator';

export interface FileUploderOptions {
  fieldName?: string;
  required?: boolean;
  maxSize?: number; // (default: 5MB)
  allowedMimes?: string[];
}

@Injectable()
export class FileUploaderInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    const options =
      this.reflector.get<FileUploderOptions>(
        FILE_OPTIONS_KEY,
        context.getHandler(),
      ) || {};

    const fieldName = options.fieldName || 'file';
    const maxSize = (options.maxSize || 5) * 1024 * 1024;

    const allowedMimes = options.allowedMimes || [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];

    // 👇 اینجا باید باشد
    const parts = req.parts();

    req.body = {};
    let fileFound = false;

    for await (const part of parts) {
      // 🟢 فایل
      if (part.type === 'file') {
        if (part.fieldname !== fieldName) continue;

        console.log('file size ===>', part);

        fileFound = true;

        if (!allowedMimes.includes(part.mimetype)) {
          throw new BadRequestException('فرمت وارد شده تصویر مجاز نمیباشد');
        }

        const uploadDir = 'public/uploads/images';
        await fs.promises.mkdir(uploadDir, { recursive: true });

        const ext = extname(part.filename);
        const filename = `${Date.now()}-${Math.random()}${ext}`;
        const filepath = `${uploadDir}/${filename}`;

        await pipeline(part.file, fs.createWriteStream(filepath));

        req.file = {
          fieldname: part.fieldname,
          originalname: part.filename,
          filename,
          path: filepath,
          mimetype: part.mimetype,
          size: part.file.bytesRead,
          url: `/uploads/images/${filename}`,
        };
      }

      // 🟡 فیلدهای متنی form-data
      else {
        req.body[part.fieldname] = part.value;
      }
    }

    // required validation
    if (options.required && !fileFound) {
      throw new BadRequestException('File is required');
    }

    // 👇 بعد از اینکه فایل و دیتا خوانده شد
    return next.handle();
  }
}
