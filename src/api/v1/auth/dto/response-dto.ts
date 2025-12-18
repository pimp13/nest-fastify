import { UserRole } from '@prisma/client';
import { Expose } from 'class-transformer';

export class RegisterResponseDto {
  @Expose()
  email!: string;

  @Expose()
  name!: string;

  @Expose()
  joined_at!: Date;
}

export class UserResponseInfo {
  email: string;
  id: string;
  name: string;
  avatarUrl: string | null;
  version: number;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
