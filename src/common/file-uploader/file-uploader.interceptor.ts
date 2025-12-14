import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Observable } from 'rxjs';

export interface FileUploderOptions {
  fieldName?: string;
  required?: boolean;
  maxSize?: number; // (default: 5MB)
  allowedMimes?: string[];
}

@Injectable()
export class FileUploaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const options: FileUploderOptions = req.fileOptions || {};

    const filedName = options.fieldName || 'file';
    const maxSize = (options.maxSize || 5) * 1024 * 1024;

    const allowedMimes = options.allowedMimes || [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ];

    req.fileFilter = (req, file, callback) => {
      if (!allowedMimes.includes(file.mimetype)) {
        return callback(
          new BadRequestException('فرمت وارد شده تصویر مجاز نمیباشد'),
          false,
        );
      }
      callback(null, true);
    };

    req.destination = 'uploads/images';

    const multerOptions = {
      storage: diskStorage({
        destination: `./${req.destination}`,
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      limits: { fileSize: maxSize },
      fileFilter: req.fileFilter,
    };

    const upload = require('multer')(multerOptions);
    const multer = upload.single(filedName);

    return new Observable((observer) => {
      multer(req, req.res, (err: any) => {
        if (err) {
          observer.error(err);
        } else {
          if (options.required && !req.file) {
            observer.error(new BadRequestException('فایل تصویر الزامی است'));
          } else {
            observer.next(req);
            observer.complete();
          }
        }
      });
      return () => {};
    });
  }
}
