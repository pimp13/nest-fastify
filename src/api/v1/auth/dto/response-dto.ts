import { Expose } from 'class-transformer';

export class RegisterResponseDto {
  @Expose()
  email!: string;

  @Expose()
  name!: string;

  @Expose()
  joined_at!: Date;
}
