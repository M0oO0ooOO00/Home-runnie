# Homerunnie

야구 직관 메이트 매칭 플랫폼

## 📋 목차

- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [디렉토리 구조](#디렉토리-구조)
- [개발 가이드](#개발-가이드)
- [스크립트](#스크립트)

---

## 🛠️ 기술 스택

### Monorepo

- **pnpm workspace**: 패키지 관리
- **Turbo**: 빌드 시스템 및 태스크 오케스트레이션

### Frontend (`apps/frontend`)

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Library**: shadcn/ui, Radix UI
- **State Management**: TanStack Query
- **Testing**: Vitest, Jest
- **Documentation**: Storybook

### Backend (`apps/backend`)

- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Authentication**: Passport.js (JWT, Kakao OAuth)
- **API Documentation**: Swagger
- **Testing**: Jest

### Shared (`packages/shared`)

- 공통 엔티티 및 타입 정의
- 프론트엔드와 백엔드에서 공유하는 타입

---

## 📁 프로젝트 구조

```
homerunnie/
├── apps/
│   ├── frontend/          # Next.js 프론트엔드 애플리케이션
│   └── backend/           # NestJS 백엔드 애플리케이션
├── packages/
│   ├── shared/            # 공유 타입 및 엔티티
│   └── eslint-config/     # 공유 ESLint 설정
├── pnpm-workspace.yaml    # pnpm 워크스페이스 설정
├── turbo.json             # Turbo 설정
└── package.json           # 루트 패키지 설정
```

---

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- pnpm 10.16.0+
- PostgreSQL 14+

### 설치

```bash
# 의존성 설치
pnpm install
```

### 개발 환경 설정

#### 1. 데이터베이스 설정

```bash
# Docker Compose로 PostgreSQL 실행
cd apps/backend
docker-compose up -d
```

#### 2. 환경 변수 설정

**Backend** (`apps/backend/secret/.env`):

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=your_database_name
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/your_database_name

# Server
PORT=3030

# JWT
JWT_SECRET=your_jwt_secret

# Kakao OAuth
KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CLIENT_SECRET=your_kakao_client_secret
KAKAO_CALLBACK_URL=http://localhost:3030/auth/kakao/callback
```

**Frontend** (`apps/frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3030
```

#### 3. 데이터베이스 초기화

```bash
# 백엔드 디렉토리로 이동
cd apps/backend

# 데이터베이스 스키마 생성
pnpm db:push

# 시드 데이터 입력
pnpm db:seed
```

### 개발 서버 실행

```bash
# 루트 디렉토리에서 모든 앱 실행
pnpm dev

# 또는 개별 실행
pnpm --filter @homerunnie/frontend dev
pnpm --filter @homerunnie/backend dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3030
- Swagger API Docs: http://localhost:3030/api

---

## 📂 디렉토리 구조

### Frontend (`apps/frontend/src/`)

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 랜딩 페이지
│   ├── providers.tsx       # 클라이언트 프로바이더 (React Query 등)
│   │
│   ├── home/               # 홈 페이지
│   │   ├── page.tsx
│   │   └── components/     # 홈 페이지 전용 컴포넌트
│   │       ├── MainBanner.tsx
│   │       ├── MateListBanner.tsx
│   │       └── ...
│   │
│   ├── signup/             # 회원가입 페이지
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── SignUpForm.tsx
│   │       └── ...
│   │
│   ├── chat/               # 채팅 페이지
│   │   ├── page.tsx
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── components/     # 채팅 관련 공통 컴포넌트
│   │       ├── ChatBox.tsx
│   │       ├── ChatList.tsx
│   │       └── ...
│   │
│   ├── my/                 # 마이페이지
│   ├── edit-profile/       # 프로필 수정
│   ├── write/              # 글 작성
│   └── login/              # 로그인
│
├── shared/                 # 공유 코드
│   ├── ui/                 # 공통 UI 컴포넌트
│   │   ├── primitives/     # shadcn/ui 기본 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── button/         # 커스텀 버튼 컴포넌트
│   │   ├── input/          # 커스텀 입력 컴포넌트
│   │   ├── dropdown/       # 드롭다운 컴포넌트
│   │   └── ...
│   ├── styles/             # 스타일 시스템
│   │   ├── tokens.css      # 디자인 토큰
│   │   └── index.css       # 글로벌 스타일
│   ├── stores/             # 상태 관리 (Zustand 등)
│   └── utils/              # 공통 유틸리티
│
├── lib/                    # 라이브러리 설정
│   └── utils.ts            # 유틸리티 함수 (cn 등)
│
├── hooks/                  # 커스텀 React Hooks
└── apis/                   # API 클라이언트 코드
```

**아키텍처 원칙:**

- Next.js App Router 기반 구조
- 페이지별 컴포넌트는 `app/[route]/components/`에 배치
- 여러 페이지에서 공통 사용되는 컴포넌트는 `shared/ui/`에 배치
- shadcn/ui 기본 컴포넌트는 `shared/ui/primitives/`에, 커스텀 래핑은 `shared/ui/[component-name]/`에 배치

### Backend (`apps/backend/src/`)

```
src/
├── main.ts                 # 애플리케이션 진입점
├── app.module.ts           # 루트 모듈
│
├── auth/                   # 인증 모듈
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── guards/             # 인증 가드
│   │   └── jwt-auth.guard.ts
│   └── strategies/         # Passport 전략
│       ├── jwt.strategy.ts
│       └── kakao.strategy.ts
│
├── member/                 # 회원 모듈
│   ├── member.module.ts
│   ├── controller/         # 컨트롤러
│   ├── service/            # 비즈니스 로직
│   ├── repository/         # 데이터 접근
│   ├── domain/             # 엔티티
│   ├── dto/                # 데이터 전송 객체
│   └── swagger/            # Swagger 문서화
│
├── post/                   # 게시글 모듈
├── comment/                # 댓글 모듈
├── participation/          # 참여 모듈
├── scrap/                  # 스크랩 모듈
├── report/                 # 신고 모듈
├── warn/                   # 경고 모듈
├── admin/                  # 관리자 모듈
│
└── common/                 # 공통 모듈
    ├── config/             # 설정 파일
    │   ├── database.config.ts
    │   ├── drizzle.config.ts
    │   └── swagger.config.ts
    ├── db/                 # 데이터베이스
    │   ├── schema/         # 스키마 정의
    │   ├── seed/           # 시드 데이터
    │   └── db.module.ts
    ├── decorators/         # 커스텀 데코레이터
    ├── dto/                # 공통 DTO
    ├── enums/              # 열거형
    ├── exceptions/         # 예외 처리
    ├── filters/            # 예외 필터
    ├── guards/             # 가드
    ├── interceptors/       # 인터셉터
    └── response/           # 응답 형식
```

**아키텍처 원칙:**

- NestJS 모듈 기반 구조
- 각 도메인별로 독립적인 모듈 구성
- Controller → Service → Repository 패턴
- Domain Entity는 Drizzle ORM 사용

### Shared (`packages/shared/src/`)

```
src/
├── entities/               # 공통 엔티티
│   └── team/
│       ├── team.ts
│       ├── stadium.ts
│       └── teamAssets.ts
└── index.ts                # Export
```

프론트엔드와 백엔드에서 공통으로 사용하는 타입 정의

---

## 🛠️ 개발 가이드

### Frontend

#### 새 페이지 추가하기

```bash
# 1. app 디렉토리에 새 라우트 폴더 생성
apps/frontend/src/app/new-page/page.tsx

# 2. 페이지별 컴포넌트는 components 폴더에 배치
apps/frontend/src/app/new-page/components/NewPageComponent.tsx
```

#### 공통 컴포넌트 추가하기

```bash
# shared/ui에 배치
apps/frontend/src/shared/ui/component-name/ComponentName.tsx
```

#### shadcn/ui 컴포넌트 추가하기

```bash
# components.json에서 ui 경로가 @/shared/ui/primitives로 설정되어 있음
cd apps/frontend
npx shadcn@latest add button
# → 자동으로 src/shared/ui/primitives/에 설치됨
```

### Backend

#### 새 모듈 생성하기

```bash
cd apps/backend
nest g module module-name
nest g controller module-name
nest g service module-name
```

#### 데이터베이스 마이그레이션

```bash
# 스키마 변경 후 마이그레이션 파일 생성
pnpm db:generate

# 데이터베이스에 적용
pnpm db:migrate

# 또는 직접 push (개발 환경)
pnpm db:push
```

#### Entity 추가하기

1. `src/[module]/domain/[entity].entity.ts`에 엔티티 정의
2. `src/common/db/schema/index.ts`에 export 추가
3. `pnpm db:generate` 실행

---

## 📝 스크립트

### 루트 디렉토리

```bash
# 개발 서버 실행 (모든 앱)
pnpm dev

# 빌드 (모든 앱)
pnpm build

# 린트 체크
pnpm lint

# 타입 체크
pnpm type-check

# 테스트
pnpm test
```

### Frontend (`apps/frontend`)

```bash
# 개발 서버
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 실행
pnpm start

# Storybook
pnpm storybook

# 타입 체크
pnpm type-check

# 린트
pnpm lint
```

### Backend (`apps/backend`)

```bash
# 개발 서버
pnpm dev
# 또는
pnpm start:dev

# 프로덕션 빌드
pnpm build

# 프로덕션 실행
pnpm start:prod

# 데이터베이스 관련
pnpm db:push          # 스키마 직접 push
pnpm db:generate      # 마이그레이션 파일 생성
pnpm db:migrate       # 마이그레이션 실행
pnpm db:seed          # 시드 데이터 입력
pnpm db:fresh         # DB 초기화 후 시드 입력
pnpm db:clear         # 모든 데이터 삭제
pnpm db:drop          # 데이터베이스 삭제
pnpm db:reset         # DB 삭제 후 재생성
```

---

## 🔧 환경 변수

### Backend

필요한 환경 변수는 `apps/backend/secret/.env`에 설정합니다.

- `DATABASE_URL`: PostgreSQL 연결 URL
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`: 데이터베이스 연결 정보
- `PORT`: 서버 포트 (기본: 3030)
- `JWT_SECRET`: JWT 토큰 시크릿
- `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`: Kakao OAuth 인증 정보

### Frontend

필요한 환경 변수는 `apps/frontend/.env.local`에 설정합니다.

- `NEXT_PUBLIC_API_URL`: 백엔드 API URL

---

## 📦 패키지 구조

### Workspace 패키지

- `@homerunnie/frontend`: 프론트엔드 애플리케이션
- `@homerunnie/backend`: 백엔드 애플리케이션
- `@homerunnie/shared`: 공유 타입 및 엔티티
- `@homerunnie/eslint-config`: 공유 ESLint 설정

### 의존성 관리

```bash
# 특정 패키지에 의존성 추가
pnpm --filter @homerunnie/frontend add package-name

# 워크스페이스 패키지 추가
pnpm --filter @homerunnie/frontend add @homerunnie/shared
```

---

## 🧪 테스트

```bash
# 모든 테스트 실행
pnpm test

# 테스트 커버리지
pnpm test:cov

# Watch 모드
pnpm test:watch
```

---

## 📚 추가 문서

- [Frontend README](apps/frontend/README.md)
- [Backend README](apps/backend/README.md)
- [Shared Package README](packages/shared/README.md)

---

## 🤝 기여 가이드

1. 새 브랜치 생성: `git checkout -b feature/your-feature-name`
2. 변경사항 커밋: `git commit -m "feat: your feature description"`
3. 브랜치 푸시: `git push origin feature/your-feature-name`
4. Pull Request 생성

---

## 📄 라이선스

이 프로젝트는 팀 내부 프로젝트입니다.
