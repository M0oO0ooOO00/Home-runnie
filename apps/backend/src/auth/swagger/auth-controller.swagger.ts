import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const AuthControllerSwagger = applyDecorators(ApiTags('인증 API'));
