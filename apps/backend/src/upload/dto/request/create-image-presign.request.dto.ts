import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsMimeType,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

const MAX_IMAGE_FILES = 4;
const MAX_IMAGE_FILE_SIZE = 15 * 1024 * 1024;

export class ImagePresignFileDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsMimeType()
  mimeType: string;

  @IsInt()
  @Min(1)
  @Max(MAX_IMAGE_FILE_SIZE)
  fileSize: number;
}

export class CreateImagePresignRequestDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_IMAGE_FILES)
  @ValidateNested({ each: true })
  @Type(() => ImagePresignFileDto)
  files: ImagePresignFileDto[];
}
