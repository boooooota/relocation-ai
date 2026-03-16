import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/chat')

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-6">

        {/* Logo / wordmark */}
        <div className="mb-10">
          <p className="text-xs font-mono tracking-widest text-gray-400 uppercase mb-2">
            Beta
          </p>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Relocation AI
          </h1>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Plan your international move — costs, timeline, and risks in one place.
          </p>
        </div>

        {/* Auth form */}
        <form action="/api/auth/google" method="POST">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
          By continuing you agree to our terms of service.<br />
          No credit card required.
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M15.68 8.18c0-.57-.05-1.11-.14-1.64H8v3.1h4.31a3.68 3.68 0 0 1-1.6 2.42v2h2.6c1.52-1.4 2.4-3.46 2.4-5.88Z" fill="#4285F4" />
      <path d="M8 16c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.15-2.52H.94v2.07A8 8 0 0 0 8 16Z" fill="#34A853" />
      <path d="M3.55 9.54A4.83 4.83 0 0 1 3.3 8c0-.54.09-1.06.25-1.54V4.39H.94A8 8 0 0 0 0 8c0 1.29.31 2.51.94 3.61l2.61-2.07Z" fill="#FBBC05" />
      <path d="M8 3.18c1.22 0 2.3.42 3.16 1.24l2.37-2.37A7.93 7.93 0 0 0 8 0 8 8 0 0 0 .94 4.39l2.61 2.07A4.77 4.77 0 0 1 8 3.18Z" fill="#EA4335" />
    </svg>
  )
}