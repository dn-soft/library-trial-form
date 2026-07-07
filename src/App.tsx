import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { I18N, type Lang } from './i18n'
import { submitTrialApplication, type LoginHint } from './api'
import { executeRecaptcha } from './recaptcha'

type FieldKey =
  | 'purpose'
  | 'channel'
  | 'teacher_name'
  | 'org_name'
  | 'org_type'
  | 'grade'
  | 'email'
  | 'account_confirm'
  | 'account_grade'
  | 'date'
  | 'privacy_agree'

const FIELD_KEYS: FieldKey[] = [
  'purpose',
  'channel',
  'teacher_name',
  'org_name',
  'org_type',
  'grade',
  'email',
  'account_confirm',
  'account_grade',
  'date',
  'privacy_agree',
]

interface FormState {
  purpose: string[]
  purpose_etc: string
  channel: string
  channel_etc: string
  teacher_name: string
  org_name: string
  org_type: string
  org_type_etc: string
  grade: string[]
  grade_etc: string
  email: string
  account_confirm: boolean
  account_grade: string
  start_year: string
  start_month: string
  start_day: string
  privacy_agree: boolean
}

const INITIAL: FormState = {
  purpose: [],
  purpose_etc: '',
  channel: '',
  channel_etc: '',
  teacher_name: '',
  org_name: '',
  org_type: '',
  org_type_etc: '',
  grade: [],
  grade_etc: '',
  email: '',
  account_confirm: false,
  account_grade: '',
  start_year: '',
  start_month: '',
  start_day: '',
  privacy_agree: false,
}

const pad2 = (n: number) => String(n).padStart(2, '0')

interface OptRowProps {
  type: 'checkbox' | 'radio'
  name: string
  value: string
  checked: boolean
  onChange: () => void
  children: ReactNode
}

function OptRow({ type, name, value, checked, onChange, children }: OptRowProps) {
  return (
    <label className={`opt${checked ? ' checked' : ''}`}>
      <input type={type} name={name} value={value} checked={checked} onChange={onChange} />
      <span>{children}</span>
    </label>
  )
}

interface FieldProps {
  invalid: boolean
  errText: string
  refFn: (el: HTMLDivElement | null) => void
  children: ReactNode
}

function Field({ invalid, errText, refFn, children }: FieldProps) {
  return (
    <div ref={refFn} className={`field${invalid ? ' invalid' : ''}`}>
      {children}
      <p className="err-msg">{errText}</p>
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState<Lang>('ko')
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<FieldKey, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [issued, setIssued] = useState<LoginHint | null>(null)
  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLDivElement | null>>>({})

  const dict = I18N[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = dict._title
  }, [lang, dict._title])

  const patch = useCallback((p: Partial<FormState>) => {
    setForm((f) => ({ ...f, ...p }))
  }, [])

  const clearErr = useCallback((key: FieldKey) => {
    setErrors((e) => (e[key] ? { ...e, [key]: false } : e))
  }, [])

  const isValid = useCallback((key: FieldKey, f: FormState): boolean => {
    switch (key) {
      case 'purpose':
        return f.purpose.length > 0
      case 'channel':
        return f.channel !== ''
      case 'teacher_name':
        return f.teacher_name.trim() !== ''
      case 'org_name':
        return f.org_name.trim() !== ''
      case 'org_type':
        return f.org_type !== ''
      case 'grade':
        return f.grade.length > 0
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())
      case 'account_confirm':
        return f.account_confirm
      case 'account_grade':
        return f.account_grade !== ''
      case 'date':
        return f.start_year !== '' && f.start_month !== '' && f.start_day !== ''
      case 'privacy_agree':
        return f.privacy_agree
    }
  }, [])

  const yearOptions = useMemo(() => {
    const nowY = new Date().getFullYear()
    return [nowY, nowY + 1]
  }, [])

  const monthOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => pad2(i + 1)), [])
  const dayOptions = useMemo(() => Array.from({ length: 31 }, (_, i) => pad2(i + 1)), [])

  const togglePurpose = (v: string) => {
    const has = form.purpose.includes(v)
    const next = has ? form.purpose.filter((x) => x !== v) : [...form.purpose, v]
    const p: Partial<FormState> = { purpose: next }
    if (v === 'Other' && has) p.purpose_etc = ''
    patch(p)
    clearErr('purpose')
  }

  const toggleGrade = (v: string) => {
    const has = form.grade.includes(v)
    const next = has ? form.grade.filter((x) => x !== v) : [...form.grade, v]
    const p: Partial<FormState> = { grade: next }
    if (v === 'Other' && has) p.grade_etc = ''
    patch(p)
    clearErr('grade')
  }

  const setChannel = (v: string) => {
    const p: Partial<FormState> = { channel: v }
    if (v !== 'Other') p.channel_etc = ''
    patch(p)
    clearErr('channel')
  }

  const setOrgType = (v: string) => {
    const p: Partial<FormState> = { org_type: v }
    if (v !== 'Other') p.org_type_etc = ''
    patch(p)
    clearErr('org_type')
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return

    const nextErrors: Partial<Record<FieldKey, boolean>> = {}
    let firstInvalid: FieldKey | null = null
    for (const k of FIELD_KEYS) {
      const invalid = !isValid(k, form)
      nextErrors[k] = invalid
      if (invalid && !firstInvalid) firstInvalid = k
    }
    setErrors(nextErrors)
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      const recaptcha_token = await executeRecaptcha('trial_apply')
      const res = await submitTrialApplication({
        ...form,
        language: lang,
        recaptcha_token,
      })
      if (res.status === 'issued' && res.loginHint) {
        setIssued(res.loginHint)
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (res.status === 'duplicate') {
        setSubmitError(res.message ?? dict.err_duplicate)
      } else {
        setSubmitError(res.message ?? dict.err_failed)
      }
    } catch (err) {
      // TypeError from fetch (network unreachable, CORS, offline) → localized network error
      const isNetworkError =
        err instanceof TypeError ||
        (err instanceof Error && err.message === 'Failed to fetch')
      const msg = isNetworkError
        ? dict.err_network
        : err instanceof Error
          ? err.message
          : dict.err_network
      setSubmitError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const showPurposeEtc = form.purpose.includes('Other')
  const showChannelEtc = form.channel === 'Other'
  const showOrgTypeEtc = form.org_type === 'Other'
  const showGradeEtc = form.grade.includes('Other')

  return (
    <>
      <div className="langbar">
        <select
          aria-label="Language"
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
        >
          <option value="en">English</option>
          <option value="ko">한국어</option>
        </select>
      </div>

      <header className="hero">
        <span className="badge">{dict.badge}</span>
        <h1>{dict.hero_title}</h1>
        <p>{dict.hero_desc}</p>
      </header>

      <div className="wrap">
        {!submitted ? (
          <form onSubmit={onSubmit} noValidate>
            {/* Section 1 */}
            <section className="card">
              <h2 className="sec-title">
                <span className="step">1</span>
                <span>{dict.sec1}</span>
              </h2>

              <Field
                invalid={!!errors.purpose}
                errText={dict.purpose_err}
                refFn={(el) => (fieldRefs.current.purpose = el)}
              >
                <label className="q">
                  <span>{dict.purpose_q}</span> <span className="req">*</span>
                  <span className="hint">{dict.purpose_hint}</span>
                </label>
                {(
                  [
                    ['School adoption', dict.purpose_1],
                    ['Reading habit', dict.purpose_2],
                    ['Arcade review content', dict.purpose_3],
                    ['Metaverse learning game', dict.purpose_4],
                    ['Other', dict.etc],
                  ] as const
                ).map(([v, label]) => (
                  <OptRow
                    key={v}
                    type="checkbox"
                    name="purpose"
                    value={v}
                    checked={form.purpose.includes(v)}
                    onChange={() => togglePurpose(v)}
                  >
                    {label}
                  </OptRow>
                ))}
                {showPurposeEtc && (
                  <input
                    type="text"
                    className="inline-etc"
                    value={form.purpose_etc}
                    placeholder={dict.purpose_etc_ph}
                    onChange={(e) => patch({ purpose_etc: e.target.value })}
                  />
                )}
              </Field>

              <Field
                invalid={!!errors.channel}
                errText={dict.channel_err}
                refFn={(el) => (fieldRefs.current.channel = el)}
              >
                <label className="q">
                  <span>{dict.channel_q}</span> <span className="req">*</span>
                </label>
                {(
                  [
                    ['Exhibition', dict.channel_1],
                    ['Online search', dict.channel_2],
                    ['e-Future', dict.channel_3],
                    ['Referral', dict.channel_4],
                    ['News article', dict.channel_5],
                    ['Other', dict.etc],
                  ] as const
                ).map(([v, label]) => (
                  <OptRow
                    key={v}
                    type="radio"
                    name="channel"
                    value={v}
                    checked={form.channel === v}
                    onChange={() => setChannel(v)}
                  >
                    {label}
                  </OptRow>
                ))}
                {showChannelEtc && (
                  <input
                    type="text"
                    className="inline-etc"
                    value={form.channel_etc}
                    placeholder={dict.channel_etc_ph}
                    onChange={(e) => patch({ channel_etc: e.target.value })}
                  />
                )}
              </Field>
            </section>

            {/* Section 2 */}
            <section className="card">
              <h2 className="sec-title">
                <span className="step">2</span>
                <span>{dict.sec2}</span>
              </h2>

              <Field
                invalid={!!errors.teacher_name}
                errText={dict.teacher_err}
                refFn={(el) => (fieldRefs.current.teacher_name = el)}
              >
                <label className="q">
                  <span>{dict.teacher_q}</span> <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="teacher_name"
                  value={form.teacher_name}
                  placeholder={dict.teacher_ph}
                  onChange={(e) => {
                    patch({ teacher_name: e.target.value })
                    clearErr('teacher_name')
                  }}
                />
              </Field>

              <Field
                invalid={!!errors.org_name}
                errText={dict.org_err}
                refFn={(el) => (fieldRefs.current.org_name = el)}
              >
                <label className="q">
                  <span>{dict.org_q}</span> <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="org_name"
                  value={form.org_name}
                  placeholder={dict.org_ph}
                  onChange={(e) => {
                    patch({ org_name: e.target.value })
                    clearErr('org_name')
                  }}
                />
              </Field>

              <Field
                invalid={!!errors.org_type}
                errText={dict.orgtype_err}
                refFn={(el) => (fieldRefs.current.org_type = el)}
              >
                <label className="q">
                  <span>{dict.orgtype_q}</span> <span className="req">*</span>
                </label>
                {(
                  [
                    ['School', dict.orgtype_1],
                    ['Academy', dict.orgtype_2],
                    ['Homeschool', dict.orgtype_3],
                    ['Other', dict.etc],
                  ] as const
                ).map(([v, label]) => (
                  <OptRow
                    key={v}
                    type="radio"
                    name="org_type"
                    value={v}
                    checked={form.org_type === v}
                    onChange={() => setOrgType(v)}
                  >
                    {label}
                  </OptRow>
                ))}
                {showOrgTypeEtc && (
                  <input
                    type="text"
                    className="inline-etc"
                    value={form.org_type_etc}
                    placeholder={dict.orgtype_etc_ph}
                    onChange={(e) => patch({ org_type_etc: e.target.value })}
                  />
                )}
              </Field>

              <Field
                invalid={!!errors.grade}
                errText={dict.grade_err}
                refFn={(el) => (fieldRefs.current.grade = el)}
              >
                <label className="q">
                  <span>{dict.grade_q}</span> <span className="req">*</span>
                  <span className="hint">{dict.grade_hint}</span>
                </label>
                {(
                  [
                    ['G1-2', dict.grade_1],
                    ['G3-4', dict.grade_2],
                    ['G5-6', dict.grade_3],
                    ['Other', dict.etc],
                  ] as const
                ).map(([v, label]) => (
                  <OptRow
                    key={v}
                    type="checkbox"
                    name="grade"
                    value={v}
                    checked={form.grade.includes(v)}
                    onChange={() => toggleGrade(v)}
                  >
                    {label}
                  </OptRow>
                ))}
                {showGradeEtc && (
                  <input
                    type="text"
                    className="inline-etc"
                    value={form.grade_etc}
                    placeholder={dict.grade_etc_ph}
                    onChange={(e) => patch({ grade_etc: e.target.value })}
                  />
                )}
              </Field>

              <Field
                invalid={!!errors.email}
                errText={dict.email_err}
                refFn={(el) => (fieldRefs.current.email = el)}
              >
                <label className="q">
                  <span>{dict.email_q}</span> <span className="req">*</span>
                  <span className="hint">{dict.email_hint}</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder={dict.email_ph}
                  onChange={(e) => {
                    patch({ email: e.target.value })
                    clearErr('email')
                  }}
                />
              </Field>

            </section>

            {/* Section 3 */}
            <section className="card">
              <h2 className="sec-title">
                <span className="step">3</span>
                <span>{dict.sec3}</span>
              </h2>

              <div className="notice">
                <span dangerouslySetInnerHTML={{ __html: dict.notice_html }} />
                <span className="privacy-line">{dict.notice_privacy}</span>
              </div>

              <Field
                invalid={!!errors.account_confirm}
                errText={dict.account_err}
                refFn={(el) => (fieldRefs.current.account_confirm = el)}
              >
                <label
                  className={`opt${form.account_confirm ? ' checked' : ''}`}
                  style={{ marginTop: 8 }}
                >
                  <input
                    type="checkbox"
                    checked={form.account_confirm}
                    onChange={(e) => {
                      patch({ account_confirm: e.target.checked })
                      clearErr('account_confirm')
                    }}
                  />
                  <span>{dict.account_confirm}</span>
                </label>
              </Field>

              <Field
                invalid={!!errors.account_grade}
                errText={dict.account_grade_err}
                refFn={(el) => (fieldRefs.current.account_grade = el)}
              >
                <label className="q">
                  <span>{dict.account_grade_q}</span> <span className="req">*</span>
                  <span className="hint">{dict.account_grade_hint}</span>
                </label>
                {(
                  [
                    ['1', dict.account_grade_1],
                    ['2', dict.account_grade_2],
                    ['3', dict.account_grade_3],
                    ['4', dict.account_grade_4],
                    ['5', dict.account_grade_5],
                    ['6', dict.account_grade_6],
                  ] as const
                ).map(([v, label]) => (
                  <OptRow
                    key={v}
                    type="radio"
                    name="account_grade"
                    value={v}
                    checked={form.account_grade === v}
                    onChange={() => {
                      patch({ account_grade: v })
                      clearErr('account_grade')
                    }}
                  >
                    {label}
                  </OptRow>
                ))}
              </Field>

              <Field
                invalid={!!errors.date}
                errText={dict.date_err}
                refFn={(el) => (fieldRefs.current.date = el)}
              >
                <label className="q">
                  <span>{dict.date_q}</span> <span className="req">*</span>
                  <span className="hint">{dict.date_hint}</span>
                </label>
                <div className="date-row">
                  <select
                    className="date-sel"
                    name="start_year"
                    value={form.start_year}
                    onChange={(e) => {
                      patch({ start_year: e.target.value })
                      clearErr('date')
                    }}
                  >
                    <option value="">{dict.date_year}</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <select
                    className="date-sel"
                    name="start_month"
                    value={form.start_month}
                    onChange={(e) => {
                      patch({ start_month: e.target.value })
                      clearErr('date')
                    }}
                  >
                    <option value="">{dict.date_month}</option>
                    {monthOptions.map((m) => (
                      <option key={m} value={m}>
                        {Number(m)}
                      </option>
                    ))}
                  </select>
                  <select
                    className="date-sel"
                    name="start_day"
                    value={form.start_day}
                    onChange={(e) => {
                      patch({ start_day: e.target.value })
                      clearErr('date')
                    }}
                  >
                    <option value="">{dict.date_day}</option>
                    {dayOptions.map((d) => (
                      <option key={d} value={d}>
                        {Number(d)}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>
            </section>

            {/* Section 4 */}
            <section className="card">
              <h2 className="sec-title">
                <span className="step">4</span>
                <span>{dict.sec4}</span>
              </h2>

              <Field
                invalid={!!errors.privacy_agree}
                errText={dict.privacy_err}
                refFn={(el) => (fieldRefs.current.privacy_agree = el)}
              >
                <label
                  className={`opt${form.privacy_agree ? ' checked' : ''}`}
                  style={{ marginTop: 8 }}
                >
                  <input
                    type="checkbox"
                    checked={form.privacy_agree}
                    onChange={(e) => {
                      patch({ privacy_agree: e.target.checked })
                      clearErr('privacy_agree')
                    }}
                  />
                  <strong>
                    <span>{dict.privacy_agree}</span> <span className="req">*</span>
                  </strong>
                </label>
              </Field>

              <details className="terms">
                <summary>{dict.terms_summary}</summary>
                <div className="terms-body">
                  <h4>{dict.terms_h1}</h4>
                  <span>{dict.terms_p1}</span>
                  <h4>{dict.terms_h2}</h4>
                  <span dangerouslySetInnerHTML={{ __html: dict.terms_p2 }} />
                  <h4>{dict.terms_h3}</h4>
                  <span>{dict.terms_p3}</span>
                  <p style={{ marginTop: 12 }}>{dict.terms_note}</p>
                </div>
              </details>
            </section>

            {submitError && (
              <div className="submit-error" role="alert">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              className="submit"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? dict.submitting : dict.submit}
            </button>

            <p className="footer">{dict.footer}</p>
          </form>
        ) : (
          <div className="thanks">
            <div className="icon">🎉</div>
            <h2>{dict.thanks_title}</h2>
            <p>{dict.thanks_p}</p>
            {issued && (
              <dl className="issued-info">
                <div>
                  <dt>{dict.issued_school_code}</dt>
                  <dd>
                    <strong>{issued.schoolCode}</strong>
                  </dd>
                </div>
                <div>
                  <dt>{dict.issued_teacher_id}</dt>
                  <dd>
                    <strong>{issued.teacherId}</strong>
                  </dd>
                </div>
                <div>
                  <dt>{dict.issued_student_pattern}</dt>
                  <dd>
                    <strong>{issued.studentIdPattern}</strong>
                  </dd>
                </div>
                <div>
                  <dt>{dict.issued_period}</dt>
                  <dd>
                    <strong>{issued.trialPeriod}</strong>
                  </dd>
                </div>
              </dl>
            )}
          </div>
        )}
      </div>
    </>
  )
}
