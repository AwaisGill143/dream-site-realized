const Login = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="flex-1 bg-gradient-to-br from-cl-sidebar to-cl-accent p-10 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-7">
            <div className="w-7 h-7 bg-cl-accent2 rounded-lg flex items-center justify-center text-sm font-bold text-primary-foreground">C</div>
            <span className="font-display text-base font-bold text-primary-foreground">CareerLaunch AI</span>
          </div>
          <h2 className="font-display text-[22px] font-bold text-primary-foreground leading-tight mb-2.5">
            Land your dream job with AI-powered prep
          </h2>
          <p className="text-[13px] text-cl-sidebar-text leading-relaxed">
            Personalized interview coaching, skill gap analysis, and adaptive mock interviews — all in one platform.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            {["Smart Job Description Parser", "AI Mock Interview Simulator", "Readiness Score & Analytics", "Multi-format Assessments"].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5 text-[12px] text-[#C8DDD4]">
                <div className="w-5 h-5 rounded-full bg-[rgba(255,255,255,0.15)] flex items-center justify-center text-[10px] flex-shrink-0">✦</div>
                {feat}
              </div>
            ))}
          </div>
        </div>
        <div className="text-[11px] text-cl-sidebar-text">Trusted by 500+ candidates · 4.9★ rating</div>
      </div>

      {/* Right panel */}
      <div className="flex-1 p-10 flex flex-col justify-center bg-card">
        <h2 className="font-display text-[22px] font-bold mb-1">Welcome back</h2>
        <p className="text-[12.5px] text-cl-text3 mb-6">Sign in to continue your interview prep</p>

        <button className="w-full py-2.5 border border-border rounded-lg bg-card text-[12.5px] text-cl-text2 cursor-pointer flex items-center justify-center gap-2 mb-2.5 hover:bg-cl-surface2 transition-all font-sans">
          <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div className="text-center text-cl-text3 text-[11px] my-3 relative">
          <span className="bg-card px-2.5 relative z-10">or sign in with email</span>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />
        </div>

        <div className="mb-3.5">
          <label className="cl-label">Email address</label>
          <input className="cl-input" placeholder="you@example.com" defaultValue="ayesha@example.com" />
        </div>
        <div className="mb-3.5">
          <label className="cl-label">Password</label>
          <input className="cl-input" type="password" defaultValue="password123" />
          <div className="text-right mt-1.5">
            <span className="text-[11px] text-cl-accent cursor-pointer">Forgot password?</span>
          </div>
        </div>
        <button className="cl-btn cl-btn-primary w-full justify-center py-2.5">Sign in</button>
        <div className="text-center mt-3.5 text-[12px] text-cl-text3">
          Don't have an account? <span className="text-cl-accent cursor-pointer font-medium">Create one free</span>
        </div>
        <div className="mt-4 p-2.5 bg-cl-surface2 rounded-lg text-[11px] text-cl-text3">
          🔒 Secured with bcrypt hashing · JWT authentication · HTTPS encrypted
        </div>
      </div>
    </div>
  );
};

export default Login;
