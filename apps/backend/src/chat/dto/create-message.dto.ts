import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsMimeType,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';
import { ChatMessageType } from '@homerunnie/shared';

export class CreateMessageImageDto {
  @IsString()
  @IsNotEmpty()
  objectKey: string;

  @IsUrl()
  imageUrl: string;

  @IsMimeType()
  mimeType: string;

  @IsInt()
  @Min(1)
  fileSize: number;

  @IsInt()
  @Min(0)
  imageOrder: number;
}

export class CreateMessageDto {
  @IsOptional()
  @IsEnum(ChatMessageType)
  type?: ChatMessageType;

  @IsString()
  @IsOptional()
  message?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMessageImageDto)
  attachments?: CreateMessageImageDto[];

  @IsString()
  @IsNotEmpty()
  roomId: string;
}
