import { IsString } from 'class-validator';

export class AttachmentDto {
  @IsString()
  fileUrl: string;

  @IsString()
  originalFileName: string;

  @IsString()
  mimeType: string;
}
