import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const RecruitmentControllerSwagger = applyDecorators(ApiTags('직관 메이트 모집'));
