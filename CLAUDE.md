# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

이 프로젝트는 야구 팬들을 위한 소셜 플랫폼 "Homerunnie"의 모노레포입니다. pnpm workspace와 Turbo를 사용하여 Frontend(Next.js)와 Backend(NestJS)를 관리합니다.

## Monorepo Structure

```
homerunnie/
├── apps/
│   ├── frontend/          # Next.js 14 + TypeScript
│   └── backend/           # NestJS + Drizzle ORM + PostgreSQL
└── packages/
    └── shared/            # 공유 타입 및 유틸리티
```

## Common Commands

### Development

```bash
# 전체 개발 서버 실행 (TUI 모드)
pnpm dev

# 전체 개발 서버 실행 (Stream 모드)
pnpm dev:stream

# Frontend만 실행
pnpm --filter @homerunnie/frontend dev

# Backend만 실행
pnpm --filter @homerunnie/backend dev
```

### Build & Test

```bash
# 전체 빌드
pnpm build

# Lint 실행
pnpm lint

# 타입 체크
pnpm type-check

# 테스트 실행
pnpm test

# 테스트 (watch 모드)
pnpm test:watch

# 테스트 커버리지
pnpm test:cov
```

### Database (Backend)

```bash
# Drizzle 스키마를 DB에 푸시
pnpm --filter @homerunnie/backend db:push

# 마이그레이션 파일 생성
pnpm --filter @homerunnie/backend db:generate

# 마이그레이션 실행
pnpm --filter @homerunnie/backend db:migrate

# DB 초기화 (드롭 + 푸시)
pnpm --filter @homerunnie/backend db:reset

# DB 클리어
pnpm --filter @homerunnie/backend db:clear

# 시드 데이터 삽입
pnpm --filter @homerunnie/backend db:seed

# DB 완전 초기화 (클리어 + 시드)
pnpm --filter @homerunnie/backend db:fresh
```

### Frontend Specific

```bash
# Storybook 실행
pnpm --filter @homerunnie/frontend storybook

# Storybook 빌드
pnpm --filter @homerunnie/frontend build-storybook
```

## Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Library**: shadcn/ui, Radix UI
- **State Management**: TanStack Query
- **Testing**: Jest + Vitest
- **Documentation**: Storybook

## Backend Architecture (NestJS)

### Module Structure

Backend는 도메인별로 모듈화되어 있습니다:

- **`auth/`**: 인증 (Kakao OAuth, JWT)
- **`member/`**: 회원 관리
- **`post/`**: 게시글
- **`comment/`**: 댓글
- **`participation/`**: 참여 관리
- **`scrap/`**: 스크랩
- **`report/`**: 신고
- **`warn/`**: 경고
- **`chat/`**: 실시간 채팅 (Socket.IO Gateway)
- **`admin/`**: 관리자 기능
- **`common/`**: 공통 기능
  - `db/`: Drizzle ORM 설정, 엔티티, enums
  - `decorators/`: 커스텀 데코레이터 (CurrentMember, Roles 등)
  - `guards/`: 가드 (RolesGuard 등)
  - `interceptors/`: 인터셉터 (LoggingInterceptor)
  - `filters/`: 예외 필터 (HttpExceptionFilter)
  - `dto/`: 공통 DTO (페이지네이션, 응답 등)

### Database (Drizzle ORM)

- **ORM**: Drizzle ORM
- **DB**: PostgreSQL
- **Schema 위치**: 각 도메인 모듈의 `domain/` 폴더
- **Schema Export**: `common/db/schema/index.ts`에서 모든 엔티티를 export해야 Drizzle이 인식합니다.

**새 엔티티 추가 시**:

1. 도메인 모듈에 `domain/` 폴더 생성
2. 엔티티 정의 (Drizzle 스키마)
3. `common/db/schema/index.ts`에 export 추가

### Authentication

- Passport 전략 사용 (Kakao OAuth)
- JWT 토큰 기반 인증
- `@CurrentMember()` 데코레이터로 현재 사용자 정보 주입
- `@Roles()` 데코레이터와 RolesGuard로 권한 관리

### WebSocket (Chat)

- Socket.IO 사용
- `chat/chat.gateway.ts`에서 실시간 채팅 처리
- 단톡방 형태로 구현됨

## Git Workflow

- **Main Branch**: `main` (브랜치명이 비어있으므로 main 사용 추정)
- **Current Branch**: `feat/chat-24`
- **브랜치 네이밍**: `feat/`, `fix/`, `style/` 등 prefix 사용
- **커밋 컨벤션**: 한글 커밋 메시지 사용 (예: `feat: 단일채팅방 -> 단톡방으로 기능 변화`)

## Package Manager

**pnpm**을 사용합니다 (v10.16.0). npm이나 yarn 대신 pnpm 사용을 권장합니다.

## Environment Variables

- Frontend: `.env.local` (루트)
- Backend: `apps/backend/secret/.env`, `apps/backend/secret/.env.postgresql`

환경 변수 파일은 Git에서 무시되므로 로컬에서 직접 설정해야 합니다.

## Testing

- Frontend: Jest + Vitest (Storybook 통합)
- Backend: Jest

단일 테스트 파일 실행:

```bash
# Frontend
pnpm --filter @homerunnie/frontend test [파일경로]

# Backend
pnpm --filter @homerunnie/backend test [파일경로]
```

## Important Notes

1. **DB 스키마 변경**: 반드시 `common/db/schema/index.ts`에 export 추가
2. **타입 안정성**: TypeScript strict 모드 사용, 타입 체크 필수
3. **린트**: 코드 작성 후 `pnpm lint` 실행 권장
