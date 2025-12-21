import { Expose } from 'class-transformer';
import { UserResponseInfo } from '../../auth/dto/response-dto';

// export interface WorkspaceResponse {
//   id: string;
//   name: string;
//   slug: string;
//   ownerId: string;
//   imageUrl: string;
//   fullDestination: string;
//   owner: UserResponseInfo;
//   createdAt: Date;
//   updatedAt: Date;
// }

export class WorkspaceResponse {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  imageUrl: string;
  fullDestination: string;
  createdAt: Date;
  updatedAt: Date;

  @Expose()
  owner: UserResponseInfo;

  @Expose()
  get imageUrll(): string {
    return this.imageUrl ?? '';
  }
}
