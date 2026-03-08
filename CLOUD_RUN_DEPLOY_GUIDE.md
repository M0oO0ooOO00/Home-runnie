# Google Cloud Run + GitHub Actions 배포 가이드

이 문서는 `Home-runnie` 백엔드 프로젝트를 Google Cloud Run에 무중단(Blue/Green) 자동 배포하기 위한 초기 설정 지침입니다.
이 가이드에 따라 한 번만 세팅을 완료하면 이후부터는 `main` 브랜치에 코드가 푸시될 때마다 자동으로 배포됩니다.

---

## 🚀 1. GCP(Google Cloud Platform) 프로젝트 및 환경 세팅

1. **GCP 콘솔 접속 및 프로젝트 생성**
   - [Google Cloud Console](https://console.cloud.google.com/)에 접속합니다.
   - 새 프로젝트를 생성하고, **프로젝트 ID**를 메모해 둡니다. (예: `homerunnie-1234`)

2. **결제 계정 등록**
   - Cloud Run과 Artifact Registry를 사용하려면 결제 수단(카드) 등록이 필요합니다. (무료 크레딧 및 무료 티어 내에서 대부분 해결됩니다.)
   - `결제(Billing)` 메뉴에서 결제 계정을 프로젝트에 연결합니다.

3. **필수 API 사용 설정 (Enable APIs)**
   - 콘솔 상단의 검색창에서 아래 3가지 API를 각각 검색하여 **[사용 설정(Enable)]** 버튼을 클릭합니다.
     1. `Cloud Run API`
     2. `Cloud Build API`
     3. `Artifact Registry API`

## 📦 2. Artifact Registry (도커 이미지 저장소) 생성

1. 검색창에 **Artifact Registry**를 입력하고 이동합니다.
2. **[+ 저장소 만들기]** 클릭
3. 아래와 같이 설정하고 생성합니다.
   - **이름**: `jikgwan-repo` (GitHub Action 파일의 `IMAGE_NAME` 경로와 일치해야 함)
   - **형식**: `Docker`
   - **리전**: `asia-northeast3` (서울)

## 🔑 3. 서비스 계정(Service Account) 발급 및 GitHub 연동

이제 GitHub Actions가 구글 클라우드에 접근할 수 있도록 보안 키를 발급합니다.

1. **서비스 계정 생성**
   - 메뉴에서 `IAM 및 관리자` > `서비스 계정(Service Accounts)`으로 이동합니다.
   - **[+ 서비스 계정 만들기]** 클릭 (이름은 `github-actions-deployer` 등 자유롭게 작성)
2. **역할(권한) 부여**
   - `역할 선택`에서 다음 3가지 역할을 추가합니다.
     1. **`Cloud Run 관리자`** (Cloud Run 배포 권한)
     2. **`서비스 계정 사용자`** (Cloud Run 서비스 실행 권한)
     3. **`Artifact Registry 작성자`** (또는 관리자, 도커 이미지 푸시 권한)
   - [완료] 클릭
3. **JSON 인증 키 다운로드**
   - 생성된 서비스 계정을 클릭하고, 상단의 **[키(Keys)]** 탭으로 이동합니다.
   - **[키 추가] > [새 키 만들기]** 클릭
   - 키 유형을 **`JSON`**으로 선택하고 만들기 버튼을 누릅니다. (PC로 `.json` 파일이 다운로드됩니다.)

4. **GitHub Repository에 Secrets 등록**
   - 내 GitHub의 `Home-runnie` 저장소 > `Settings` > `Secrets and variables` > `Actions`로 이동합니다.
   - **[New repository secret]**을 클릭해 다음 2개의 시크릿을 등록합니다.
     - **`GCP_PROJECT_ID`** : (예: `homerunnie-1234`)
     - **`GCP_SA_KEY`** : (다운로드한 JSON 파일 안에 있는 텍스트 전체를 메모장으로 열어 그대로 복사/붙여넣기)

---

## 🌐 4. 커스텀 도메인(HTTPS) 연결 방법

프론트엔드(`example.com`)와 쿠키 인증을 공유하기 위해 백엔드(`api.example.com`) 도메인을 연결하는 방법입니다.

1. **Cloud Run 서비스 접속**
   - 배포가 한 번 완료된 후, 구글 클라우드 콘솔의 `Cloud Run` 메뉴로 들어가 `jikgwan-backend` 서비스를 클릭합니다.
2. **맞춤 도메인 관리**
   - 상단 메뉴 탭에서 **[맞춤 도메인 (Custom Domains)]** 탭(또는 `통합` > `도메인 매핑`)을 클릭합니다.
   - **[맞춤 도메인 관리]** 메뉴 또는 **[매핑 추가]**를 눌러 연결할 도메인(예: `api.example.com`)을 입력합니다.
3. **DNS 레코드 설정**
   - 구글이 안내해 주는 **DNS 레코드 값(A, AAAA, CNAME 등)**을 복사합니다.
   - 본인이 도메인을 구매/관리하는 서비스(가비아, Cloudflare, Route53 등)의 DNS 설정 메뉴로 이동하여 복사한 레코드를 추가합니다.
4. **HTTPS 자동 발급 대기**
   - DNS 설정 후 약 10분~1시간이 지나면 구글이 알아서 무료 SSL/HTTPS 인증서를 발급하고 씌워줍니다.

---

## 🛠 5. 소스 코드 내 쿠키 & CORS 설정 체크 (참고용)

서로 다른 서브도메인(`example.com`과 `api.example.com`) 간에 쿠키 통신이 원활하려면 백엔드(NestJS) 소스에서 다음 세팅이 필요합니다.

```typescript
// 1. CORS 설정 (main.ts)
app.enableCors({
  origin: ['https://example.com', 'http://localhost:3000'],
  credentials: true, // 필수!
});

// 2. 쿠키 발급 시 하위 도메인 공유 허용옵션 (auth.controller.ts 등)
res.cookie('access_token', token, {
  domain: '.example.com', // 앞에 점(.)을 찍어주어야 하위 도메인 간 공유 가능!
  secure: true, // HTTPS 환경에서 필수
  sameSite: 'lax', // 또는 'none'
});
```

끝입니다! 이제 `.github/workflows/deploy-cloud-run.yml` 설정에 의해 코드 커밋만 하면 무중단으로 신규 코드가 릴리즈됩니다. 🎉
