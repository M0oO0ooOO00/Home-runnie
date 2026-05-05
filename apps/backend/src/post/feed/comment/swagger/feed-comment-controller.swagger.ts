import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const FeedCommentControllerSwagger = applyDecorators(ApiTags('피드 댓글'));
