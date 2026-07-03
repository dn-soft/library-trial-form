# library-trial-form

**Meta-Library 무료체험 신청 페이지** — 초등 영어 도서관 서비스인 Meta-Library의 30일 무료체험을 신청받는 단일 페이지 웹 애플리케이션.

## 주요 기능

- 4단계 신청 폼
  1. **체험 정보** — 체험 목적(복수 선택), 유입 경로
  2. **신청자·기관 정보** — 교사 성함, 기관명, 기관 유형, 대상 학년, 이메일, 국가코드+전화번호
  3. **계정 발급 안내** — 계정 안내 확인, 체험 시작일 (연/월/일)
  4. **개인정보 수집 동의** — 약관 전문 포함
- 한국어 / 영어 언어 전환 (우측 상단 langbar)
- 클라이언트 사이드 유효성 검증 및 실시간 오류 해제
- 제출 완료 시 감사 화면 표시
- 모바일 ~ 태블릿 반응형 대응

## 기술 스택

- **Vite** — 개발 서버 & 번들러
- **React 18** — UI
- **TypeScript** (strict) — 타입 안정성
- 외부 폼/상태 관리 라이브러리 미사용 (React state로 충분)

## 시작하기

### 요구사항

- Node.js 20+ (개발 검증 환경: 24.11.0)

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
│   ├── App.tsx              # 폼 전체 (섹션 1~4 + 완료 화면 + 유효성 검증)
│   ├── i18n.ts              # ko/en 사전 + 국가코드 목록
│   ├── App.css              # 페이지 스타일
│   └── index.css            # 리셋
├── .claude/launch.json      # Claude Code preview 설정
├── package.json
├── tsconfig.json / tsconfig.node.json
└── vite.config.ts
```

## 폼 제출

현재는 완료 화면만 표시하고 실제 서버로는 전송하지 않음. 백엔드에 연결하려면 `src/App.tsx`의 `onSubmit` 함수 내부 `setSubmitted(true)` 바로 앞에 fetch/axios 호출을 추가. 폼 데이터는 `form` state에 아래 형태로 존재:

| 필드                                   | 타입                    | 비고                       |
| -------------------------------------- | ----------------------- | -------------------------- |
| `purpose`, `grade`                     | `string[]`              | 복수 선택                  |
| `channel`, `org_type`                  | `string`                | 단일 선택                  |
| `purpose_etc`, `channel_etc` 등        | `string`                | "기타" 선택 시 입력값      |
| `teacher_name`, `org_name`             | `string`                | 텍스트                     |
| `email`, `country_code`, `phone`       | `string`                | 이메일·국가코드·전화       |
| `start_year`, `start_month`, `start_day` | `string`              | 예: `"2026"`, `"04"`, `"15"` |
| `account_confirm`, `privacy_agree`     | `boolean`               | 필수 체크 항목             |

## 다국어 (i18n)

`src/i18n.ts`의 `I18N` 객체에 `ko` / `en` 두 사전이 정의되어 있음. 새 문구 추가 시:

1. `Dict` interface에 키 추가
2. `I18N.ko`, `I18N.en` 양쪽에 값 추가
3. `App.tsx`에서 `dict.<키>` 로 사용

언어 전환 시 `document.title` 과 `<html lang>` 도 자동 갱신 (`useEffect`).

## 라이선스

Private — 사내 사용.
