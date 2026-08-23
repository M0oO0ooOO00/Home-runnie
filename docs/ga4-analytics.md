# GA4 분석 설계

홈러니(Homerunnie) 프론트엔드에 적용된 Google Analytics 4 설계 문서입니다.

## 개요

| 항목           | 내용                                                     |
| -------------- | -------------------------------------------------------- |
| 제품           | GA4 (gtag, `@next/third-parties`)                        |
| Measurement ID | env `NEXT_PUBLIC_GA_MEASUREMENT_ID` (예: `G-5T9HKFCB20`) |
| 범위           | 모집글(`recruitment`) + 커뮤니티 피드(`feed`)            |
| 구분 키        | 이벤트 파라미터 `post_type`                              |

GTM / PostHog / Amplitude는 사용하지 않습니다. 클라이언트 gtag만 사용합니다.

## 목표 지표

| 비즈니스 지표               | GA4에서 보는 방법                               | 코드 이벤트          |
| --------------------------- | ----------------------------------------------- | -------------------- |
| 접속 기기 유형              | 보고서 → 기술 → 기기 카테고리                   | 자동 수집            |
| 사용자당 평균 이벤트 수     | 참여도 → 이벤트 / 탐색                          | 자동 수집            |
| 서비스 체류 시간            | 평균 참여 시간, 세션당 평균 참여 시간           | 자동 수집            |
| 이탈 페이지                 | 탐색 → 페이지 경로 + 이탈수                     | SPA `page_view` 보정 |
| 게시글 작성률               | 퍼널: `write_page_view` → `post_create_success` | 커스텀               |
| 조회 → 댓글 전환율          | 퍼널: `post_view` → `comment_create_success`    | 커스텀               |
| 작성하기 버튼 → 작성 페이지 | 퍼널: `write_cta_click` → `write_page_view`     | 커스텀               |

## 아키텍처

```
layout.tsx          → <GoogleAnalytics gaId={GA_ID} />
providers.tsx       → <GaPageView /> (SPA page_view)
gtag.ts             → pageview / event / track* 헬퍼
각 UI·mutation     → track* 호출
```

### 핵심 파일

| 파일                                                    | 역할                                     |
| ------------------------------------------------------- | ---------------------------------------- |
| `apps/frontend/src/app/layout.tsx`                      | GA 스크립트 주입 (`GA_ID` 없으면 미렌더) |
| `apps/frontend/src/app/providers.tsx`                   | SPA 라우트 변경 시 page_view             |
| `apps/frontend/src/shared/lib/analytics/gtag.ts`        | 이벤트 API                               |
| `apps/frontend/src/shared/lib/analytics/GaPageView.tsx` | pathname/searchParams 기반 page_view     |

### 환경 변수

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX
```

- 로컬: `apps/frontend/.env.local` (gitignore, 커밋 금지)
- 배포: Vercel 등 환경 변수에 동일 키 설정

## 이벤트 카탈로그

공통 파라미터:

- `post_type`: `'recruitment' | 'feed'`
- `post_id`: 게시글 ID (숫자)
- `source`: CTA 출처 (`home_banner` | `feed_fab` | `footer`)
- `blocked_by_login`: CTA가 로그인 모달로 막혔는지 (`boolean`)
- `is_reply`: 피드 대댓글 여부 (`boolean`, 피드 댓글만)

### 1. `write_cta_click`

작성하기 CTA 클릭.

| source        | 위치                           | post_type     |
| ------------- | ------------------------------ | ------------- |
| `home_banner` | `MainBanner` 「작성하러 가기」 | `recruitment` |
| `feed_fab`    | 피드 FAB 「글 작성하기」       | `feed`        |
| `footer`      | 푸터 「모집글 작성」           | `recruitment` |

비로그인으로 페이지 이동 대신 로그인 모달이 뜨면 `blocked_by_login: true`로 기록합니다.  
→ 「버튼을 찾았는지」와 「실제 작성 페이지로 갔는지」를 구분하기 위함입니다.

### 2. `write_page_view`

글 작성 페이지 진입.

| post_type     | 라우트      |
| ------------- | ----------- |
| `recruitment` | `/write`    |
| `feed`        | `/feed/new` |

### 3. `post_create_success`

게시글 생성 API 성공 시 (`mutation onSuccess`).

| post_type     | 발생 위치           |
| ------------- | ------------------- |
| `recruitment` | `write/page.tsx`    |
| `feed`        | `feed/new/page.tsx` |

파라미터: `post_type`, `post_id`

### 4. `post_view`

게시글 상세 조회 (마운트 시 1회).

| post_type     | 라우트 / 컴포넌트                            |
| ------------- | -------------------------------------------- |
| `recruitment` | `/home/[id]` (`RecruitmentPostDetailClient`) |
| `feed`        | `/feed/[id]` (`FeedDetailPageClient`)        |

### 5. `comment_create_success`

댓글 작성 성공 시.

| post_type     | 발생 위치                                      | 비고                          |
| ------------- | ---------------------------------------------- | ----------------------------- |
| `recruitment` | `RecruitmentPostDetailClient` comment mutation |                               |
| `feed`        | `useCreateFeedCommentMutation`                 | `is_reply`로 루트/대댓글 구분 |

## 퍼널 정의 (GA4 탐색)

콘솔에서 **탐색 → 퍼널 탐색**으로 저장해 두면 됩니다.

### A. 작성 CTA → 작성 페이지

1. `write_cta_click` (`blocked_by_login = false` 세그먼트 권장)
2. `write_page_view`

`post_type` / `source`로 세그먼트 분리.

### B. 게시글 작성률

1. `write_page_view`
2. `post_create_success`

작성률 ≈ step2 / step1.  
CTA 기준 작성을 보려면 A와 이어 3단 퍼널로도 구성 가능.

### C. 커뮤니티 활성도 (조회 → 댓글)

1. `post_view`
2. `comment_create_success`

`post_type`으로 모집/피드 분리.

## GA4 콘솔 설정 (수동)

코드만으로는 아래가 완료되지 않습니다.  
앱에서 보낸 이벤트 파라미터를 **보고서/탐색에서 쓰려면** GA4에 “맞춤 측정기준”으로 등록해야 합니다.

---

### 1. 맞춤 정의(이벤트 파라미터) 등록

코드의 `gtag('event', …, { post_type, source, … })` 키는 그대로 **이벤트 파라미터 이름**입니다.  
콘솔에 등록하지 않아도 Realtime/DebugView에서는 보이지만, **표준 보고서·탐색의 측정기준 목록에는 안 나옵니다.**

#### 경로

1. [Google Analytics](https://analytics.google.com) 접속
2. 왼쪽 아래 **관리**(톱니바퀴)
3. 속성 열에서 **데이터 표시** → **맞춤 정의**
4. **맞춤 측정기준 만들기** 클릭

#### 등록할 항목 (5개)

모두 **범위 = 이벤트** 로 만듭니다. (사용자/세션 범위 아님)

| 측정기준 이름 (표시용, 한글 OK) | 범위   | 이벤트 매개변수 (코드와 **철자 동일**) | 설명                                  |
| ------------------------------- | ------ | -------------------------------------- | ------------------------------------- |
| 게시글 유형                     | 이벤트 | `post_type`                            | `recruitment` / `feed`                |
| CTA 출처                        | 이벤트 | `source`                               | `home_banner` / `feed_fab` / `footer` |
| 게시글 ID                       | 이벤트 | `post_id`                              | 숫자 ID                               |
| 로그인 차단 여부                | 이벤트 | `blocked_by_login`                     | `true` / `false`                      |
| 대댓글 여부                     | 이벤트 | `is_reply`                             | 피드 댓글만, `true` / `false`         |

입력 예시 (`post_type`):

- **측정기준 이름**: `게시글 유형` (보고서 UI에 보이는 이름)
- **범위**: `이벤트`
- **이벤트 매개변수**: `post_type` ← 코드의 키와 반드시 같아야 함 (`postType` X)
- **설명**(선택): `모집글/피드 구분`

나머지 4개도 같은 방식으로 **이벤트 매개변수만** 위 표의 영문 키로 채웁니다.

#### 참고

- 맞춤 측정기준은 속성당 한도가 있습니다(플랜에 따라 다름). 위 5개면 충분합니다.
- **등록 이후**에 들어온 데이터부터 탐색/보고서에 반영됩니다. 과거 데이터에는 소급 적용되지 않습니다.
- `write_cta_click` 같은 **이벤트 이름**은 맞춤 정의에 등록할 필요 없습니다. 이벤트는 자동으로 수집되고, 파라미터만 맞춤 정의로 “꺼내는” 개념입니다.

---

### 2. 퍼널 탐색 저장 (A / B / C)

#### 공통 경로

1. 왼쪽 메뉴 **탐색** → **시작하기** 또는 **빈 상태** 템플릿
2. 기법: **퍼널 탐색**
3. 아래처럼 단계 설정 후 오른쪽 위 **저장** → 이름 지정

#### 퍼널 A — 작성 CTA → 작성 페이지

| 단계 | 조건                            |
| ---- | ------------------------------- |
| 1    | 이벤트 이름 = `write_cta_click` |
| 2    | 이벤트 이름 = `write_page_view` |

권장 필터/세그먼트:

- 1단계에 `blocked_by_login` = `false` (실제 이동 의도만)
- 측정기준으로 `게시글 유형`(`post_type`), `CTA 출처`(`source`) 분해

저장 이름 예: `작성 CTA → 작성 페이지`

#### 퍼널 B — 게시글 작성률

| 단계 | 조건                                |
| ---- | ----------------------------------- |
| 1    | 이벤트 이름 = `write_page_view`     |
| 2    | 이벤트 이름 = `post_create_success` |

전환율 ≈ 2단계 완료 / 1단계.  
`post_type`으로 모집/피드 분리.

저장 이름 예: `작성 페이지 → 작성 성공`

(선택) 3단: `write_cta_click` → `write_page_view` → `post_create_success`

#### 퍼널 C — 조회 → 댓글

| 단계 | 조건                                   |
| ---- | -------------------------------------- |
| 1    | 이벤트 이름 = `post_view`              |
| 2    | 이벤트 이름 = `comment_create_success` |

`post_type`으로 모집/피드 분리.  
피드는 `is_reply`로 루트 댓글만 보고 싶으면 2단계에 `is_reply` = `false` 필터.

저장 이름 예: `게시글 조회 → 댓글 작성`

---

### 3. (권장) 데이터 보관 · 향상된 측정

#### 데이터 보관

1. **관리** → **데이터 수집 및 수정** → **데이터 보관**
2. 이벤트 데이터 보관: **14개월** 권장 (기본 2개월보다 탐색 분석에 유리)

#### 향상된 측정

1. **관리** → **데이터 수집 및 수정** → **데이터 스트림** → 웹 스트림 선택
2. **향상된 측정**이 켜져 있는지 확인 (페이지 조회, 스크롤, 아웃바운드 클릭 등)
3. SPA는 앱의 `GaPageView`가 page_view를 추가로 보내므로, 스트림의 페이지 조회와 중복될 수 있음 → Realtime에서 한 번 확인

---

### 4. 배포 환경 변수

로컬 `.env.local`은 배포에 포함되지 않습니다.

| 환경      | 할 일                                       |
| --------- | ------------------------------------------- |
| Vercel 등 | Project → Settings → Environment Variables  |
| 키        | `NEXT_PUBLIC_GA_MEASUREMENT_ID`             |
| 값        | `G-5T9HKFCB20` (실제 Measurement ID)        |
| 적용      | Production (필요 시 Preview도) → **재배포** |

재배포 후 프로덕션에서 Realtime에 히트가 들어오는지 확인합니다.

---

### 5. 검증

1. GA4 **관리** → **DebugView** (또는 Realtime)
2. 앱에서 순서대로:
   - 홈 「작성하러 가기」 → `write_cta_click`
   - `/write` 진입 → `write_page_view`
   - (가능하면) 업로드 성공 → `post_create_success`
   - 모집/피드 상세 → `post_view`
   - 댓글 작성 → `comment_create_success`
3. DebugView에서 파라미터(`post_type`, `source` 등)가 함께 보이는지 확인
4. 표준 보고서·저장된 퍼널은 보통 **24~48시간** 후부터 안정적으로 보임

## 의도적으로 넣지 않은 것

- 닉네임, 이메일 등 PII
- GTM / Measurement Protocol (서버)
- 피드 기획 문서의 PostHog·Amplitude 후보 이벤트 (`feed_view` 등) — 이번 범위 밖

## 주의사항

- `/write`는 middleware로 로그인 필요. 비로그인 CTA는 `write_page_view` 없이 `blocked_by_login: true`만 찍힐 수 있음.
- App Router는 클라이언트 라우팅 시 기본 page_view가 빠질 수 있어 `GaPageView`로 보정함. 이탈 페이지 지표 정확도에 필요.
- Measurement ID가 없으면 모든 `track*` / pageview는 no-op.
