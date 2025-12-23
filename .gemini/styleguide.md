# Gemini Code Assist Style Guide: Home-runnie

## Language

모든 코드 리뷰, 요약 및 도움말 메시지는 **한국어(한글)**로 제공해야 합니다.

# Introduction

이 스타일 가이드는 **Home-runnie** 모노레포 프로젝트(Backend, Frontend, Shared)의 코딩 컨벤션을 정의합니다.
이 가이드는 팀원 간의 협업 효율을 높이고, 유지보수가 용이한 고품질의 코드를 유지하는 것을 목적으로 합니다.

# Key Principles

- **기술적 정확성 (Technical Accuracy):** 모든 코드는 기술적 개념(SOLID, 디자인 패턴 등)을 정확히 근거로 작성되어야 합니다.
- **가독성 (Readability):** 코드는 다른 팀원이 별도의 설명 없이도 의도를 파악할 수 있을 만큼 명확해야 합니다.
- **일관성 (Consistency):** 백엔드와 프론트엔드 전반에 걸쳐 정의된 패턴(Service-Repository, Atomic Design 등)을 엄격히 준수합니다.
- **유지보수성 (Maintainability):** 결합도를 낮추고 응집도를 높여 코드 수정이 다른 기능에 미치는 영향을 최소화합니다.

# Formatting & Basic Rules

## Line Length & Indentation

- **최대 줄 길이:** 100자 (Prettier 설정 준수).
- **들여쓰기:** 2개의 공백(Spaces)을 사용합니다.

## Naming Conventions

- **변수 및 함수:** `camelCase`를 사용합니다 (예: `userEmail`, `calculateTotal()`).
- **클래스 및 컴포넌트:** `PascalCase`를 사용합니다 (예: `MemberService`, `CtaButton`).
- **상수:** `UPPER_SNAKE_CASE`를 사용합니다 (예: `DEFAULT_PAGE_SIZE`).
- **파일명:** 도메인 중심의 이름을 사용하며, 역할에 따라 접미사를 붙입니다 (예: `member.service.ts`, `cta-button.tsx`).

# Backend Guidance (NestJS & Drizzle)

## Layered Architecture

- **Service & Repository:** 비즈니스 로직은 `Service`에, 데이터베이스 접근 로직은 `Repository`에 격리하여 SRP(단일 책임 원칙)를 준수합니다.
- **DTO (Data Transfer Object):** 요청과 응답 데이터는 반드시 DTO 클래스를 사용하며, `class-validator`를 통해 유효성을 검증합니다.

## Database (Drizzle ORM)

- **Base Columns:** 모든 엔티티는 `id`, `createdAt`, `updatedAt`, `deleted` 필드를 포함하는 `baseColumns`를 확장하거나 포함해야 합니다.
- **Query Efficiency:** 독립적인 비동기 쿼리는 `Promise.all()`을 사용하여 병렬로 처리함으로써 성능을 최적화합니다.

## Documentation (Swagger)

- 모든 API 컨트롤러와 메서드에는 정의된 Swagger 데코레이터(예: `@MemberControllerSwagger`, `@GetMyProfileSwagger`)를 적용하여 API 문서를 최신으로 유지합니다.

# Frontend Guidance (Next.js & Tailwind)

## Component Design

- **Variant Management:** UI 컴포넌트는 `class-variance-authority (cva)`를 사용하여 스타일 변형을 관리합니다.
- **Atomic Wrapper:** `shadcn/ui`와 같은 기초 UI 라이브러리를 프로젝트 디자인 토큰에 맞춰 래핑하여 사용합니다 (예: `ShadButton` → `CtaButton`).

## Client Boundary

- 이벤트 핸들러나 상태 관리가 필요한 컴포넌트에는 반드시 파일 상단에 `"use client"` 지시어를 명시합니다.

# Error Handling & Logging

- **Specific Exceptions:** NestJS의 내장 Exception(예: `NotFoundException`)을 사용하여 에러의 의미를 명확히 전달합니다.
- **Log Context:** 로그 출력 시 요청 맥락이나 도메인 정보를 포함하여 디버깅을 용이하게 합니다.

# Tooling

- **Formatter:** Prettier (설정 파일: `.prettierrc`).
- **Linter:** ESLint (설정 파일: `eslint.config.mjs`).
- **Package Manager:** `pnpm` (Workspace 기반 모노레포 구조).

---

### 💡 리뷰어(Gemini) 적용 지침

이 프로젝트를 리뷰할 때는 위 가이드를 기반으로 하되, 특히 **Service와 Repository의 역할 분리**가 잘 이루어졌는지,
프론트엔드 컴포넌트가 **디자인 토큰(Tailwind v4 변수)**을 올바르게 참조하고 있는지 중점적으로 확인해 주세요.
