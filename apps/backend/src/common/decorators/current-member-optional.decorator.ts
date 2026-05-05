import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * OptionalJwtAuthGuard와 함께 사용. 토큰 없거나 유효하지 않으면 null 반환.
 */
export const CurrentMemberOptional = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): number | null => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.memberId) {
      return null;
    }

    return user.memberId;
  },
);
