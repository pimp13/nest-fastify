import { join } from 'path';
import { promises as fs } from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileManagerService {
  private readonly uploadPath: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadPath = join(process.cwd(), 'uploads');
    this.baseUrl =
      this.configService.get<string>('APP_URL')?.replace(/\/$/, '') ||
      'http://localhost:3000';

    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    await fs.mkdir(this.uploadPath, { recursive: true });
  }

  /**
   * Create settings multer for fastify
   */
  // getMulterOptions(options: UploadOptions = {}) {
  //   const opts: Required<UploadOptions> = {
  //     ...options,
  //     folder: '',
  //     maxSizeByte: 5 * 1024 * 1024, // 5MB
  //     allowedMimes: [
  //       'image/jpeg',
  //       'image/jpg',
  //       'image/png',
  //       'image/gif',
  //       'image/webp',
  //       'application/pdf',
  //     ],
  //   };

  //   return {
  //     limits: {
  //       fileSize: opts.maxSizeByte,
  //     },
  //     fileFilter: (
  //       req: FastifyRequest,
  //       file: File,
  //       callback: FileFilterCallback,
  //     ) => {
  //       if (opts.allowedMimes.includes(file.mimetype)) callback(null, true);
  //       else
  //         callback(
  //           new BadRequestException(
  //             `this file by ext ${file.mimetype} is not allow`,
  //           ),
  //         );
  //     },
  //     storage: {
  //       async destination(
  //         req: FastifyRequest,
  //         file: File,
  //         cb: (error: Error | null, destination: string) => void,
  //       ) {
  //         const dest = join(this.uploadPath, opts.folder || '');
  //         await fs.mkdir(dest, { recursive: true });
  //         cb(null, dest);
  //       },
  //       filename(
  //         req: FastifyRequest,
  //         file: File,
  //         cb: (error: Error | null, destination: string) => void,
  //       ) {
  //         const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
  //         cb(null, uniqueName);
  //       },
  //     },
  //   };
  // }

  /**
   * Formating result files
   */
  // formatFiles(
  //   files: File | File[],
  //   folder: string = '',
  // ): UploadedFile | UploadedFile[] {
  //   // TODO: فعلا ناقص هست تا بعدا عملیات آپلود فایل و رو بنویسم فایل منیجر ایز کامینگ
  // }
}
