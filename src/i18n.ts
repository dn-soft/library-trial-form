export type Lang = 'ko' | 'en'

export interface Dict {
  _title: string
  badge: string
  hero_title: string
  hero_desc: string
  sec1: string
  purpose_q: string
  purpose_hint: string
  purpose_1: string
  purpose_2: string
  purpose_3: string
  purpose_4: string
  etc: string
  purpose_etc_ph: string
  purpose_err: string
  channel_q: string
  channel_1: string
  channel_2: string
  channel_3: string
  channel_4: string
  channel_5: string
  channel_etc_ph: string
  channel_err: string
  sec2: string
  teacher_q: string
  teacher_ph: string
  teacher_err: string
  org_q: string
  org_ph: string
  org_err: string
  orgtype_q: string
  orgtype_1: string
  orgtype_2: string
  orgtype_3: string
  orgtype_etc_ph: string
  orgtype_err: string
  grade_q: string
  grade_hint: string
  grade_1: string
  grade_2: string
  grade_3: string
  grade_etc_ph: string
  grade_err: string
  email_q: string
  email_hint: string
  email_ph: string
  email_err: string
  phone_q: string
  phone_ph: string
  phone_err: string
  sec3: string
  notice_html: string
  notice_privacy: string
  account_confirm: string
  account_err: string
  account_grade_q: string
  account_grade_hint: string
  account_grade_err: string
  account_grade_1: string
  account_grade_2: string
  account_grade_3: string
  account_grade_4: string
  account_grade_5: string
  account_grade_6: string
  date_q: string
  date_hint: string
  date_err: string
  date_year: string
  date_month: string
  date_day: string
  sec4: string
  privacy_agree: string
  privacy_err: string
  terms_summary: string
  terms_h1: string
  terms_p1: string
  terms_h2: string
  terms_p2: string
  terms_h3: string
  terms_p3: string
  terms_note: string
  submit: string
  submitting: string
  footer: string
  thanks_title: string
  thanks_p: string
  issued_school_code: string
  issued_teacher_id: string
  issued_student_pattern: string
  issued_period: string
  err_duplicate: string
  err_failed: string
  err_network: string
}

export const I18N: Record<Lang, Dict> = {
  ko: {
    _title: 'Meta-Library 무료체험 신청',
    badge: '초등 영어 도서관 · 30일 무료체험',
    hero_title: 'Meta-Library 무료체험 신청',
    hero_desc: '교과서와 연결된 AI 영어 도서관, Meta-Library를 우리 교실에서 직접 경험해 보세요.',
    sec1: '체험 정보',
    purpose_q: '체험 목적',
    purpose_hint: '해당하는 항목을 모두 선택해 주세요.',
    purpose_1: '학교 도입 고려',
    purpose_2: '독서 습관 형성',
    purpose_3: '독서 후 복습용 아케이드 콘텐츠 활용',
    purpose_4: '메타버스 학습게임 체험',
    etc: '기타',
    purpose_etc_ph: '기타 목적을 입력해 주세요',
    purpose_err: '체험 목적을 하나 이상 선택해 주세요.',
    channel_q: '유입 경로',
    channel_1: '박람회',
    channel_2: '영어 도서관 관련 인터넷 검색',
    channel_3: '이퓨처(e-Future)',
    channel_4: '지인 추천',
    channel_5: '뉴스 기사',
    channel_etc_ph: '기타 경로를 입력해 주세요',
    channel_err: '유입 경로를 선택해 주세요.',
    sec2: '신청자 · 기관 정보',
    teacher_q: '신청하시는 교사 성함',
    teacher_ph: '예) 홍길동',
    teacher_err: '성함을 입력해 주세요.',
    org_q: '신청하는 기관 이름',
    org_ph: '예) OO초등학교 / OO영어학원',
    org_err: '기관 이름을 입력해 주세요.',
    orgtype_q: '기관 유형',
    orgtype_1: '학교',
    orgtype_2: '학원',
    orgtype_3: '홈스쿨',
    orgtype_etc_ph: '기관 유형을 입력해 주세요',
    orgtype_err: '기관 유형을 선택해 주세요.',
    grade_q: '체험 대상 학년 · 연령대',
    grade_hint: '체험에 참여할 학생의 학년대를 모두 선택해 주세요.',
    grade_1: '초등 1~2학년',
    grade_2: '초등 3~4학년',
    grade_3: '초등 5~6학년',
    grade_etc_ph: '대상 학년·연령대를 입력해 주세요',
    grade_err: '체험 대상 학년·연령대를 선택해 주세요.',
    email_q: '메일 주소',
    email_hint: '해당 주소로 계정 안내 메일이 발송됩니다.',
    email_ph: '예) teacher@school.ac.kr',
    email_err: '올바른 메일 주소를 입력해 주세요.',
    phone_q: '전화 번호',
    phone_ph: '예) 1012345678',
    phone_err: '전화 번호를 입력해 주세요.',
    sec3: '계정 발급 안내',
    notice_html:
      '체험용 계정은 <strong>교사용 LMS 계정 1개</strong>와 <strong>학생용 계정 5개</strong>를 발급해 드립니다.',
    notice_privacy:
      '※ 학생용 체험 계정은 별도의 개인정보를 수집하지 않으며, 학년·반·번호 정보만으로 간편하게 로그인할 수 있습니다.',
    account_confirm: '네, 확인했습니다.',
    account_err: '계정 발급 안내 확인이 필요합니다.',
    account_grade_q: '계정 발급 학년',
    account_grade_hint: '체험 계정 5개는 선택한 학년으로 발급됩니다. (위 "체험 대상 학년"과는 별개)',
    account_grade_err: '계정을 발급할 학년을 선택해 주세요.',
    account_grade_1: '1학년',
    account_grade_2: '2학년',
    account_grade_3: '3학년',
    account_grade_4: '4학년',
    account_grade_5: '5학년',
    account_grade_6: '6학년',
    date_q: '체험 시작일',
    date_hint: '시작 날짜를 포함하여 30일 동안 체험할 수 있습니다.',
    date_err: '체험 시작일을 선택해 주세요.',
    date_year: '연도',
    date_month: '월',
    date_day: '일',
    sec4: '개인정보 수집 동의',
    privacy_agree: '네, 동의합니다.',
    privacy_err: '개인정보 수집·이용에 동의해 주셔야 신청이 가능합니다.',
    terms_summary: '개인정보 수집·이용 동의 전문 보기',
    terms_h1: '1. 수집하는 개인정보 항목',
    terms_p1: '성명, 이메일주소, 전화번호, 학교명(기관명)',
    terms_h2: '2. 개인정보의 수집 및 이용 목적',
    terms_p2:
      '제공하신 정보는 &lt;Meta-Library&gt;의 서비스 신청 확인을 위해 사용합니다.<br />① 본인 확인 식별(동명이인 등) 절차에 이용 (성명, 이메일, 전화번호)<br />② 의사소통 및 정보 전달 등에 이용 (성명, 이메일, 전화번호)',
    terms_h3: '3. 개인정보의 보유 및 이용기간',
    terms_p3:
      '수집된 개인정보의 보유 기간은 &lt;Meta-Library&gt;의 무료체험 이벤트 종료 후 1년간이며, 삭제 요청 시 당사는 개인정보를 재생이 불가능한 방법으로 즉시 파기합니다.',
    terms_note:
      '※ 귀하는 이에 대한 동의를 거부할 수 있습니다. 다만 동의가 없을 경우 당사의 &lt;Meta-Library 무료 서비스 체험&gt; 신청이 불가능할 수 있음을 알려드립니다.',
    submit: '무료체험 신청하기',
    submitting: '신청 처리 중...',
    footer: '신청 후 영업일 기준 1~2일 내에 입력하신 메일로 계정 정보를 보내드립니다.',
    thanks_title: '신청이 완료되었습니다!',
    thanks_p: '아래 계정 정보로 로그인하실 수 있으며, 같은 내용을 입력하신 메일로도 발송했습니다.',
    issued_school_code: '학교 코드',
    issued_teacher_id: '교사 계정',
    issued_student_pattern: '학생 계정',
    issued_period: '체험 기간',
    err_duplicate: '동일 이메일로 최근 발급된 트라이얼이 있습니다.',
    err_failed: '계정 발급에 실패했습니다. 잠시 후 다시 시도해 주세요.',
    err_network: '서버 연결에 실패했습니다. 네트워크를 확인해 주세요.',
  },
  en: {
    _title: 'Meta-Library Free Trial Application',
    badge: 'AI English Library for Elementary · 30-Day Free Trial',
    hero_title: 'Apply for a Meta-Library Free Trial',
    hero_desc:
      'Experience Meta-Library, the AI English library connected to your curriculum, right in your classroom.',
    sec1: 'Trial Information',
    purpose_q: 'Purpose of Trial',
    purpose_hint: 'Select all that apply.',
    purpose_1: 'Considering school-wide adoption',
    purpose_2: 'Building reading habits',
    purpose_3: 'Using arcade content for post-reading review',
    purpose_4: 'Trying the metaverse learning game',
    etc: 'Other',
    purpose_etc_ph: 'Please enter your purpose',
    purpose_err: 'Please select at least one purpose.',
    channel_q: 'How did you hear about us?',
    channel_1: 'Exhibition / fair',
    channel_2: 'Online search for English libraries',
    channel_3: 'e-Future',
    channel_4: 'Recommendation from someone I know',
    channel_5: 'News article',
    channel_etc_ph: 'Please enter the channel',
    channel_err: 'Please select how you heard about us.',
    sec2: 'Applicant · Institution Information',
    teacher_q: "Teacher's Name",
    teacher_ph: 'e.g., Jane Doe',
    teacher_err: 'Please enter your name.',
    org_q: 'Institution Name',
    org_ph: 'e.g., ABC Elementary School / ABC English Academy',
    org_err: 'Please enter the institution name.',
    orgtype_q: 'Institution Type',
    orgtype_1: 'School',
    orgtype_2: 'Academy / private institute',
    orgtype_3: 'Homeschool',
    orgtype_etc_ph: 'Please enter the institution type',
    orgtype_err: 'Please select the institution type.',
    grade_q: 'Target Grade / Age Group',
    grade_hint: 'Select all grade groups that will take part in the trial.',
    grade_1: 'Grades 1–2',
    grade_2: 'Grades 3–4',
    grade_3: 'Grades 5–6',
    grade_etc_ph: 'Please enter the target grade / age group',
    grade_err: 'Please select the target grade / age group.',
    email_q: 'Email Address',
    email_hint: 'Account details will be sent to this address.',
    email_ph: 'e.g., teacher@school.edu',
    email_err: 'Please enter a valid email address.',
    phone_q: 'Phone Number',
    phone_ph: 'e.g., 1012345678',
    phone_err: 'Please enter your phone number.',
    sec3: 'Account Issuance',
    notice_html:
      'For the trial, we provide <strong>1 teacher LMS account</strong> and <strong>5 student accounts</strong>.',
    notice_privacy:
      '※ Student trial accounts collect no personal information; students simply log in with their grade, class, and number.',
    account_confirm: 'Yes, I understand.',
    account_err: 'Please confirm the account issuance notice.',
    account_grade_q: 'Grade for Issued Accounts',
    account_grade_hint:
      'All 5 student accounts will be created under the selected grade. (Independent from the "Target Grade" above.)',
    account_grade_err: 'Please select the grade for the issued accounts.',
    account_grade_1: 'Grade 1',
    account_grade_2: 'Grade 2',
    account_grade_3: 'Grade 3',
    account_grade_4: 'Grade 4',
    account_grade_5: 'Grade 5',
    account_grade_6: 'Grade 6',
    date_q: 'Trial Start Date',
    date_hint: 'The trial runs for 30 days including the start date.',
    date_err: 'Please select a trial start date.',
    date_year: 'Year',
    date_month: 'Month',
    date_day: 'Day',
    sec4: 'Consent to Collection of Personal Information',
    privacy_agree: 'Yes, I agree.',
    privacy_err: 'You must consent to the collection and use of personal information to apply.',
    terms_summary: 'View full consent to collection and use of personal information',
    terms_h1: '1. Personal information collected',
    terms_p1: 'Name, email address, phone number, school (institution) name',
    terms_h2: '2. Purpose of collection and use',
    terms_p2:
      'The information you provide is used to confirm your application for &lt;Meta-Library&gt;.<br />① To verify and identify the applicant (e.g., for identical names) — name, email, phone<br />② For communication and delivery of information — name, email, phone',
    terms_h3: '3. Retention and use period',
    terms_p3:
      'Collected personal information is retained for one year after the end of the &lt;Meta-Library&gt; free trial event. Upon a deletion request, we will immediately destroy the personal information in a manner that cannot be recovered.',
    terms_note:
      '※ You may refuse to give this consent. However, please note that without consent you may not be able to apply for the &lt;Meta-Library Free Service Trial&gt;.',
    submit: 'Apply for Free Trial',
    submitting: 'Submitting...',
    footer: 'After applying, account details will be sent to your email within 1–2 business days.',
    thanks_title: 'Your application is complete!',
    thanks_p:
      'You can log in with the account information below — the same details have been sent to your email.',
    issued_school_code: 'School Code',
    issued_teacher_id: 'Teacher Account',
    issued_student_pattern: 'Student Accounts',
    issued_period: 'Trial Period',
    err_duplicate: 'A trial was already issued to this email recently.',
    err_failed: 'Failed to issue accounts. Please try again in a moment.',
    err_network: 'Could not reach the server. Please check your network.',
  },
}

export const COUNTRY_CODES: { value: string; label: string }[] = [
  { value: '+82', label: '🇰🇷 +82' },
  { value: '+1', label: '🇺🇸 +1' },
  { value: '+86', label: '🇨🇳 +86' },
  { value: '+81', label: '🇯🇵 +81' },
  { value: '+852', label: '🇭🇰 +852' },
  { value: '+886', label: '🇹🇼 +886' },
  { value: '+65', label: '🇸🇬 +65' },
  { value: '+60', label: '🇲🇾 +60' },
  { value: '+66', label: '🇹🇭 +66' },
  { value: '+84', label: '🇻🇳 +84' },
  { value: '+62', label: '🇮🇩 +62' },
  { value: '+63', label: '🇵🇭 +63' },
  { value: '+91', label: '🇮🇳 +91' },
  { value: '+44', label: '🇬🇧 +44' },
  { value: '+49', label: '🇩🇪 +49' },
  { value: '+33', label: '🇫🇷 +33' },
  { value: '+34', label: '🇪🇸 +34' },
  { value: '+39', label: '🇮🇹 +39' },
  { value: '+7', label: '🇷🇺 +7' },
  { value: '+61', label: '🇦🇺 +61' },
  { value: '+64', label: '🇳🇿 +64' },
  { value: '+1-CA', label: '🇨🇦 +1' },
  { value: '+971', label: '🇦🇪 +971' },
  { value: '+966', label: '🇸🇦 +966' },
  { value: '+55', label: '🇧🇷 +55' },
  { value: '+52', label: '🇲🇽 +52' },
]
