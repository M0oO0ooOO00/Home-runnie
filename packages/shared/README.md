# @homerunnie/shared

Homerunnie 모노레포의 공유 패키지입니다. CommonJS와 ES Module을 동시에 지원하는 듀얼 패키지 시스템을 사용합니다.

## 빌드

```bash
pnpm build
```

## 사용법

### Backend (NestJS - CommonJS)

```typescript
import { formatDate, validateEmail } from '@homerunnie/shared';
```

### Frontend (Next.js - ESM)

```typescript
import { formatDate, validateEmail } from '@homerunnie/shared';
```

두 환경 모두 동일한 import 문을 사용할 수 있으며, 패키지 시스템이 자동으로 적절한 형식(CJS 또는 ESM)을 선택합니다.

