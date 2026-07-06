import type { Lang } from './i18n'

export interface TrialApplicationRequest {
  purpose: string[]
  purpose_etc?: string
  channel: string
  channel_etc?: string
  teacher_name: string
  org_name: string
  org_type: string
  org_type_etc?: string
  grade: string[]
  grade_etc?: string
  email: string
  account_confirm: boolean
  account_grade: string
  start_year: string
  start_month: string
  start_day: string
  privacy_agree: boolean
  language: Lang
}

export interface LoginHint {
  schoolCode: string
  teacherId: string
  studentIdPattern: string
  trialPeriod: string
}

export type TrialApplicationStatus = 'issued' | 'duplicate' | 'failed'

export interface TrialApplicationResponse {
  status: TrialApplicationStatus
  applicationId?: string
  trialCode?: string
  loginHint?: LoginHint
  message?: string
}

interface Envelope<T> {
  result: boolean
  data: T
}

const API_BASE: string =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:3002'

/**
 * POST /trial-applications
 * 서버는 항상 SuccessInterceptor 로 `{ result, data }` 봉투를 씌워 반환하므로
 * 여기서 언랩핑한 뒤 순수 TrialApplicationResponse 를 돌려준다.
 * 400/422 등 HTTP 오류는 message 를 뽑아 Error 로 throw.
 */
export async function submitTrialApplication(
  body: TrialApplicationRequest,
): Promise<TrialApplicationResponse> {
  const res = await fetch(`${API_BASE}/trial-applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const json = (await res.json()) as { message?: string | string[] }
      if (Array.isArray(json.message)) msg = json.message.join(', ')
      else if (typeof json.message === 'string') msg = json.message
    } catch {
      // ignore parse failures
    }
    throw new Error(msg)
  }

  const envelope = (await res.json()) as Envelope<TrialApplicationResponse>
  return envelope.data
}
