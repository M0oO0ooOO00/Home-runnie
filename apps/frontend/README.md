# moo-fe

Next.js 14 + TypeScript + FSD (Feature-Sliced Design) 아키텍처 기반 프로젝트

## 📁 프로젝트 구조

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 기반으로 구성되어 있습니다.
https://feature-sliced.design/kr/docs/reference/layers

```
moo-fe/
├── app/                    # Next.js App Router (라우팅 레이어)
├── src/
│   ├── shared/            # 공유 레이어 (재사용 가능한 코드)
│   ├── entities/          # 엔티티 레이어 (비즈니스 엔티티)
│   ├── features/          # 피처 레이어 (비즈니스 기능)
│   ├── widgets/           # 위젯 레이어 (복합 컴포넌트)
│   ├── views/             # 뷰 레이어 (페이지 컴포넌트)
│   ├── components/        # shadcn/ui 기본 컴포넌트
│   └── lib/               # 유틸리티 함수
├── public/                # 정적 파일 (이미지, 아이콘 등)
└── features/              # 루트 레벨 피처 (일부 피처)
```

## 🏗️ FSD 아키텍처 레이어 설명

### 1. **app/** - Next.js App Router

**역할**: 라우팅 및 페이지 레이아웃 관리

- Next.js 14의 App Router를 사용하여 라우팅 처리
- 각 페이지의 레이아웃과 메타데이터 정의
- 서버 컴포넌트와 클라이언트 컴포넌트 구분

**예시**:

```
app/
├── layout.tsx          # 루트 레이아웃
├── page.tsx            # 홈 페이지
├── home/               # 홈 페이지 라우트
├── signup/             # 회원가입 페이지 라우트
└── chat/               # 채팅 페이지 라우트
```

---

### 2. **shared/** - 공유 레이어

**역할**: 프로젝트 전반에서 재사용 가능한 코드

#### 📂 `shared/ui/` - 공통 UI 컴포넌트

디자인 시스템에 맞춘 재사용 가능한 UI 컴포넌트

- **button/**: CTA 버튼, CTA Small 버튼
- **dropdown/**: 드롭다운, 팀 드롭다운
- **input/**: 텍스트 필드
- **switch/**: 토글 스위치
- **tag/**: BGM 태그
- **radio/**: 라디오 버튼 그룹
- **write/**: 작성 관련 컴포넌트
- **header/**: 헤더 컴포넌트

각 컴포넌트는 `storybook/` 폴더에 Storybook 스토리를 포함합니다.

#### 📂 `shared/styles/` - 스타일 시스템

- **tokens.css**: 디자인 토큰 (색상, 타이포그래피, 그림자 등)
- **index.css**: 글로벌 스타일 및 유틸리티 클래스

#### 📂 `shared/utils/` - 공통 유틸리티

프로젝트 전반에서 사용하는 유틸리티 함수

#### 📂 `shared/server-utils/` - 서버 유틸리티

서버 사이드에서 사용하는 유틸리티 함수

**사용 예시**:

```tsx
import { CtaButton } from "@/shared/ui/button/cta-button";
import { Dropdown } from "@/shared/ui/dropdown/dropdown";
```

---

### 3. **entities/** - 엔티티 레이어

**역할**: 비즈니스 도메인의 핵심 엔티티 정의

비즈니스 로직과 독립적인 순수한 데이터 모델과 타입 정의

**현재 엔티티**:

- **team/**: 팀 관련 엔티티
  - `team.ts`: 팀 데이터 타입
  - `stadium.ts`: 경기장 데이터 타입
  - `teamAssets.ts`: 팀 자산 데이터 타입

**사용 예시**:

```tsx
import { Team } from "@/entities/team/team";
```

---

### 4. **features/** - 피처 레이어

**역할**: 사용자 시나리오를 구현하는 비즈니스 기능

각 피처는 독립적인 기능 단위로, 특정 사용자 액션을 완성합니다.

**현재 피처**:

- **landing/**: 랜딩 페이지 기능
  - `ui/landing.tsx`: 랜딩 페이지 컴포넌트
  - `ui/kakao-login-button.tsx`: 카카오 로그인 버튼

- **signup/**: 회원가입 기능
  - `ui/SignUpForm.tsx`: 회원가입 폼
  - `ui/TextFields.tsx`: 텍스트 필드 컴포넌트
  - `ui/FormLabel.tsx`: 폼 라벨 컴포넌트

- **home/**: 홈 페이지 기능
  - `main-banner.tsx`: 메인 배너
  - `banner-card.tsx`: 배너 카드
  - `mate-item.tsx`: 메이트 아이템
  - `mate-list-banner.tsx`: 메이트 리스트 배너

- **my/**: 마이페이지 기능
  - `ui/My.tsx`: 마이페이지 컴포넌트
  - `ui/Edit.tsx`: 프로필 수정 컴포넌트

- **chat/**: 채팅 기능
  - `components/ChatBox.tsx`: 채팅 박스
  - `components/ChatCard.tsx`: 채팅 카드
  - `components/ChatList.tsx`: 채팅 리스트
  - `components/ChatInput.tsx`: 채팅 입력
  - `components/ChatInfo.tsx`: 채팅 정보
  - `components/ChatTable.tsx`: 채팅 테이블
  - `components/ChatReport.tsx`: 채팅 신고

**사용 예시**:

```tsx
import Landing from "@/features/landing/ui/landing";
```

---

### 5. **widgets/** - 위젯 레이어

**역할**: 여러 피처를 조합한 복합 컴포넌트

현재 비어있으며, 향후 복합적인 UI 블록을 구성할 때 사용합니다.

**예시 사용 케이스**:

- 헤더 + 네비게이션 + 사용자 프로필을 조합한 상단 바
- 여러 피처를 포함한 대시보드 위젯

---

### 6. **views/** - 뷰 레이어

**역할**: 페이지 레벨의 최상위 컴포넌트

현재 비어있으며, Next.js의 `app/` 디렉토리에서 페이지를 관리하고 있습니다.

---

### 7. **components/** - shadcn/ui 기본 컴포넌트

**역할**: shadcn/ui 라이브러리의 기본 컴포넌트

- `ui/`: shadcn/ui CLI로 생성된 기본 컴포넌트
  - button, input, select, dialog, switch 등
- `common/`: 공통 모달 및 컴포넌트
  - `ReportModal.tsx`: 신고 모달

**주의**: 이 레이어의 컴포넌트는 직접 수정하지 않고, `shared/ui/`에서 래핑하여 사용합니다.

---

### 8. **lib/** - 라이브러리 유틸리티

**역할**: 프로젝트 전반에서 사용하는 유틸리티 함수

- `utils.ts`: 클래스명 병합 등 공통 유틸리티

---

## 📋 FSD 아키텍처 규칙

### ✅ DO (해야 할 것)

1. **레이어 간 의존성 규칙**
   - 상위 레이어는 하위 레이어만 import 가능
   - 같은 레이어 내에서는 import 불가
   - 순서: `app` → `views` → `widgets` → `features` → `entities` → `shared`

2. **shared 레이어**
   - 프로젝트 전반에서 재사용 가능한 코드만 배치
   - 비즈니스 로직 포함 금지
   - 디자인 시스템 컴포넌트는 `shared/ui/`에 배치

3. **features 레이어**
   - 하나의 피처는 하나의 사용자 시나리오를 완성
   - 다른 피처에 의존하지 않도록 설계
   - 피처 내부에 필요한 컴포넌트는 피처 내부에 배치

4. **entities 레이어**
   - 순수한 데이터 모델과 타입만 정의
   - UI 컴포넌트나 비즈니스 로직 포함 금지

### ❌ DON'T (하지 말아야 할 것)

1. **순환 의존성**
   - 피처 간 직접 import 금지
   - entities 간 직접 import 금지

2. **레이어 규칙 위반**
   - `shared`에서 `features` import 금지
   - `entities`에서 `features` import 금지

3. **비즈니스 로직 위치**
   - `shared`에 비즈니스 로직 배치 금지
   - 비즈니스 로직은 `features`에 배치

---

## 🎨 디자인 시스템

### 타이포그래피

- **Title**: T01-T04 (26px, 24px, 22px, 20px)
- **Body**: B01-B03 (18px, 16px, 14px)
- **Caption**: C01 (12px)
- **폰트 웨이트**: Bold(700), SemiBold(600), Medium(500), Regular(400)

### 색상 팔레트

- Gray: 50-950 스케일
- Primary: Gray-950
- Secondary: Gray 계열
- Destructive: Red 계열

### 컴포넌트

- 모든 공통 컴포넌트는 `shared/ui/`에 배치
- Storybook으로 문서화 및 테스트

---

## 🛠️ 개발 가이드

### 새 컴포넌트 추가하기

1. **공통 UI 컴포넌트** → `src/shared/ui/[component-name]/`

   ```tsx
   src/shared/ui/button/
   ├── cta-button.tsx
   └── storybook/
       └── cta-button.stories.tsx
   ```

2. **피처 컴포넌트** → `src/features/[feature-name]/ui/`

   ```tsx
   src/features/signup/
   └── ui/
       └── SignUpForm.tsx
   ```

3. **엔티티 타입** → `src/entities/[entity-name]/`
   ```tsx
   src/entities/team/
   └── team.ts
   ```

### 파일 네이밍 규칙

- **컴포넌트**: PascalCase (예: `CtaButton.tsx`)
- **유틸리티**: camelCase (예: `utils.ts`)
- **타입/인터페이스**: PascalCase (예: `Team.ts`)
- **스토리북**: kebab-case (예: `cta-button.stories.tsx`)

---

## 📦 주요 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Library**: shadcn/ui, Radix UI
- **State Management**: TanStack Query
- **Testing**: Vitest
- **Documentation**: Storybook
- **Package Manager**: pnpm

---

## 🚀 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

### Storybook 실행

```bash
pnpm storybook
```

### 빌드

```bash
pnpm build
```

---

## 📚 참고 자료

- [Feature-Sliced Design 공식 문서](https://feature-sliced.design/)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [shadcn/ui 공식 문서](https://ui.shadcn.com/)

---

## 🤝 팀 협업 가이드

### 코드 리뷰 체크리스트

- [ ] FSD 레이어 규칙 준수 여부 확인
- [ ] 컴포넌트가 올바른 레이어에 배치되었는지 확인
- [ ] Storybook 스토리 작성 여부 확인
- [ ] 디자인 시스템 토큰 사용 여부 확인
- [ ] 타입 안정성 확인

### 커밋 메시지 컨벤션

```
feat(shared/ui): CTA 버튼 컴포넌트 추가
fix(features/signup): 회원가입 폼 validation 수정
refactor(entities/team): 팀 타입 정의 개선
```

---

## 📝 라이센스

이 프로젝트는 팀 내부 프로젝트입니다.
