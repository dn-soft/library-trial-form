/**
 * Google reCAPTCHA v3 client-side helper.
 *
 * Behavior:
 * - If VITE_RECAPTCHA_SITE_KEY is not set, executeRecaptcha() returns undefined
 *   (server will also skip verification when RECAPTCHA_SECRET_KEY is unset).
 * - If set, we lazy-load https://www.google.com/recaptcha/api.js?render=<siteKey>
 *   once and call grecaptcha.execute() on each submit to fetch a fresh token.
 */

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

const SITE_KEY: string | undefined = import.meta.env.VITE_RECAPTCHA_SITE_KEY as
  | string
  | undefined
const SCRIPT_ID = 'recaptcha-v3-script'

let scriptPromise: Promise<void> | null = null

function loadScript(siteKey: string): Promise<void> {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    if (document.getElementById(SCRIPT_ID)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('reCAPTCHA script load failed'))
    document.head.appendChild(script)
  })
  return scriptPromise
}

function waitForReady(): Promise<void> {
  return new Promise((resolve) => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(resolve)
    } else {
      resolve()
    }
  })
}

/**
 * Execute reCAPTCHA v3 for the given action and return the token.
 * Returns undefined if the site key is not configured — callers should treat
 * that as "no recaptcha available" and let the server decide (skip / require).
 */
export async function executeRecaptcha(action = 'trial_apply'): Promise<string | undefined> {
  if (!SITE_KEY) return undefined
  try {
    await loadScript(SITE_KEY)
    await waitForReady()
    if (!window.grecaptcha) return undefined
    return await window.grecaptcha.execute(SITE_KEY, { action })
  } catch (err) {
    // Silent fail on script load / execute error — surface as no token so the
    // server side sees a missing token and rejects if verification is enforced.
    console.warn('[recaptcha] execute failed:', err)
    return undefined
  }
}

export function isRecaptchaConfigured(): boolean {
  return !!SITE_KEY
}
