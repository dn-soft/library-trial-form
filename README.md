# library-trial-form

**Meta-Library 무료체험 신청 페이지** — 초등 영어 도서관 서비스인 Meta-Library의 30일 무료체험을 신청받는 단일 페이지 웹 애플리케이션.

배포 URL: https://library-trial-form.pages.dev (Cloudflare Pages)

## 주요 기능

- 4단계 신청 폼
  1. **체험 정보** — 체험 목적(복수 선택), 유입 경로
  2. **신청자·기관 정보** — 교사 성함, 기관명, 기관 유형, 대상 학년, 이메일
  3. **계정 발급 안내** — 계정 안내 확인, 계정 발급 학년(1~6), 체험 시작일(연/월/일)
  4. **개인정보 수집 동의** — 약관 전문 포함
- 한국어 / 영어 언어 전환 (우측 상단 langbar)
- 클라이언트 사이드 유효성 검증 및 실시간 오류 해제
- 제출 후 서버 응답에 따라 성공(발급 정보 표시) / 중복 / 실패 / 네트워크 오류 분기
- Google reCAPTCHA v3 봇 방지 (백그라운드, 사용자 상호작용 없음)
- 모바일 ~ 태블릿 반응형 대응

## 기술 스택

- **Vite** — 개발 서버 & 번들러
- **React 18** — UI
- **TypeScript** (strict) — 타입 안정성
- **Cloudflare Pages** — 프로덕션 배포
- 외부 폼/상태 관리 라이브러리 미사용 (React state로 충분)

## 시작하기

### 요구사항

- Node.js 20+ (개발 검증 환경: 24.11.0)

### 환경 변수

`.env.example` 참고. 로컬 개발용은 `.env.local` 로 복사해서 값 채워 사용:

| 변수                        | 필수 | 설명                                                                                                     |
| --------------------------- | ---- | -------------------------------------------------------------------------------------------------------- |
| `VITE_API_BASE`             | No   | Argong-books 서버 base URL. 기본값 `http://localhost:3002`.                                              |
| `VITE_RECAPTCHA_SITE_KEY`   | No   | Google reCAPTCHA v3 **site key** (public). 비워두면 봇 방어 비활성 (dev 편의). production 은 반드시 세팅. |

> **주의**: reCAPTCHA **secret key** 는 프론트 env 에 절대 두면 안 됨. Vite 빌드 시 브라우저 번들에 embed 되어 노출됨. secret key 는 서버(`Argong-books`) 의 `RECAPTCHA_SECRET_KEY` env 로만.

### 설치 & 실행

```bash
npm install
npm run dev         # http://localhost:5173
```

### 빌드

```bash
npm run build       # tsc && vite build → dist/
npm run preview     # 프로덕션 빌드 로컬 미리보기
```

## 프로젝트 구조

```
.
├── index.html               # 진입 HTML (Google Fonts import)
├── src/
│   ├── main.tsx             # React 부트스트랩
│   ├── App.tsx              # 폼 전체 (섹션 1~4 + 완료 화면 + 유효성 검증 + fetch)
│   ├── api.ts               # POST /trial-applications 클라이언트 (봉투 언랩핑 포함)
│   ├── recaptcha.ts         # Google reCAPTCHA v3 lazy loader + executeRecaptcha()
│   ├── i18n.ts              # ko/en 사전
│   ├── App.css              # 페이지 스타일
│   ├── index.css            # 리셋
│   └── vite-env.d.ts        # Vite env 타이핑
├── .env.example             # env 예시 (실제 값은 .env.local 로 복사)
├── .claude/launch.json      # Claude Code preview 설정
├── package.json
├── tsconfig.json / tsconfig.node.json
└── vite.config.ts
```

## 서버 연동

`src/App.tsx onSubmit` → `submitTrialApplication` (`src/api.ts`) → **POST** `<VITE_API_BASE>/trial-applications`.

### 요청 body

| 필드                                                              | 타입       | 비고                                                            |
| ----------------------------------------------------------------- | ---------- | --------------------------------------------------------------- |
| `purpose`, `grade`                                                | `string[]` | 복수 선택                                                       |
| `channel`, `org_type`                                             | `string`   | 단일 선택                                                       |
| `purpose_etc`, `channel_etc` 등                                   | `string`   | "기타" 선택 시 입력값                                           |
| `teacher_name`, `org_name`                                        | `string`   | 텍스트                                                          |
| `email`                                                           | `string`   | 이메일                                                          |
| `account_grade`                                                   | `string`   | `'1'`~`'6'` — 실제 발급될 학생 5명의 학년                       |
| `start_year`, `start_month`, `start_day`                          | `string`   | 예: `"2026"`, `"04"`, `"15"`                                    |
| `account_confirm`, `privacy_agree`                                | `boolean`  | 필수 체크 항목                                                  |
| `language`                                                        | `"ko"` \| `"en"` | 폼 언어 (서버가 응답 메시지 언어 선택에 사용)             |
| `recaptcha_token`                                                 | `string?`  | reCAPTCHA v3 토큰. site key 미설정 시 미포함                    |

### 응답

서버는 `SuccessInterceptor` 로 `{ result: true, data: ... }` 봉투를 씌워 반환하고, `api.ts` 가 `data` 만 언랩핑해서 아래 형태를 반환:

```ts
{
  status: 'issued' | 'duplicate' | 'failed'
  applicationId?: string
  trialCode?: string
  loginHint?: {
    schoolCode: string
    teacherId: string
    studentIdPattern: string
    trialPeriod: string
  }
  message?: string
}
```

- `issued` → thanks 화면 + 발급 정보 리스트 표시
- `duplicate` / `failed` → 폼 유지, 상단 배너에 서버 메시지 노출
- 네트워크 오류 → 폼 유지, 배너에 지역화된 문구

## 다국어 (i18n)

`src/i18n.ts`의 `I18N` 객체에 `ko` / `en` 두 사전. 새 문구 추가 시:

1. `Dict` interface 에 키 추가
2. `I18N.ko`, `I18N.en` 양쪽에 값 추가
3. `App.tsx`에서 `dict.<키>` 로 사용

언어 전환 시 `document.title` 과 `<html lang>` 도 `useEffect` 로 자동 갱신.

## reCAPTCHA v3 설정

프로덕션에서 봇 방어를 활성화하려면 Google reCAPTCHA console 에서 **v3** 사이트 등록 후 발급받은 **site key** 를 `VITE_RECAPTCHA_SITE_KEY` 에 설정.

- 콘솔: https://www.google.com/recaptcha/admin
- **Type**: reCAPTCHA v3 (Score based)
- **Domains**: 프로덕션 도메인(`library-trial-form.pages.dev` 등) 및 로컬 테스트 시 `localhost` 도 추가
- Site key ↔ Secret key 쌍은 반드시 같은 사이트 등록에서 나온 값이어야 함 (섞이면 `browser-error` 로 거부됨)
- 서버(`Argong-books`) 의 `RECAPTCHA_SECRET_KEY` 도 함께 세팅되어야 실제 검증 발동

두 env 중 하나라도 없으면 검증은 자동으로 skip (개발 편의).

## 배포 (Cloudflare Pages)

- Framework preset: **Vite**
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables (Production):
  - `VITE_API_BASE` = 프로덕션 서버 URL
  - `VITE_RECAPTCHA_SITE_KEY` = Google reCAPTCHA v3 site key
- `main` 브랜치 push 시 자동 빌드·배포

## 라이선스

Private — 사내 사용.
