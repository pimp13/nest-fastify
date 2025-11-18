import { BadRequestException, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UploadOptions } from './file-manager.types';

@Injectable()
export class FileManagerService {
  async uploadFile(req: FastifyRequest, options: UploadOptions) {
    const file = await (req as any).file();
    if (!file) throw new BadRequestException('File is not found');

    const { folder = 'others', allowedMime = [], maxSizeMB = 5 } = options;
  }
}
