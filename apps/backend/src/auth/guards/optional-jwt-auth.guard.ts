import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 토큰이 있으면 검증해서 request.user를 채우고,
 * 없거나 유효하지 않으면 그냥 통과시키는 가드.
 * 비로그인 열람을 허용하되 로그인 회원에겐 추가 정보(예: isLiked)를 제공하고 싶을 때 사용.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(err: unknown, user: TUser): TUser {
    return (user ?? null) as TUser;
  }
}
