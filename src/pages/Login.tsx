import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import authService from "@/lib/auth";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("ayesha@example.com");
  const [password, setPassword] = useState("password123");
  const [username, setUsername] = useState("ayesha");
  const [fullName, setFullName] = useState("Ayesha Khan");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const tokens = await authService.login(email, password);
      const user = await authService.getCurrentUser();
      authService.setCurrentUser(user);

      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.register(email, username, fullName, password);

      toast({
        title: "Success",
        description: "Account created successfully. Please log in.",
      });

      setIsSignup(false);
      setPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Signup failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="flex-1 bg-gradient-to-br from-cl-sidebar to-cl-accent p-10 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-7">
            <div className="w-7 h-7 bg-cl-accent2 rounded-lg flex items-center justify-center text-sm font-bold text-primary-foreground">
              C
            </div>
            <span className="font-display text-base font-bold text-primary-foreground">
              CareerLaunch AI
            </span>
          </div>
          <h2 className="font-display text-[22px] font-bold text-primary-foreground leading-tight mb-2.5">
            Land your dream job with AI-powered prep
          </h2>
          <p className="text-[13px] text-cl-sidebar-text leading-relaxed">
            Personalized interview coaching, skill gap analysis, and adaptive
            mock interviews — all in one platform.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            {[
              "Smart Job Description Parser",
              "AI Mock Interview Simulator",
              "Readiness Score & Analytics",
              "Multi-format Assessments",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5 text-[12px] text-[#C8DDD4]">
                <div className="w-5 h-5 rounded-full bg-[rgba(255,255,255,0.15)] flex items-center justify-center text-[10px] flex-shrink-0">
                  ✦
                </div>
                {feat}
              </div>
            ))}
          </div>
        </div>
        <div className="text-[11px] text-cl-sidebar-text">
          Trusted by 500+ candidates · 4.9★ rating
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 p-10 flex flex-col justify-center bg-card">
        <h2 className="font-display text-[22px] font-bold mb-1">
          {isSignup ? "Create your account" : "Welcome back"}
        </h2>
        <p className="text-[12.5px] text-cl-text3 mb-6">
          {isSignup
            ? "Join thousands of successful candidates"
            : "Sign in to continue your interview prep"}
        </p>

        <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-3.5">
          {isSignup && (
            <>
              <div>
                <label className="cl-label">Full Name</label>
                <input
                  className="cl-input"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="cl-label">Username</label>
                <input
                  className="cl-input"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="cl-label">Email address</label>
            <input
              className="cl-input"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="cl-label">Password</label>
            <input
              className="cl-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isSignup && (
              <div className="text-right mt-1.5">
                <span className="text-[11px] text-cl-accent cursor-pointer">
                  Forgot password?
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="cl-btn cl-btn-primary w-full justify-center py-2.5 mt-4 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : isSignup ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className="text-center mt-3.5 text-[12px] text-cl-text3">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setIsSignup(false);
                  setPassword("");
                }}
                className="text-cl-accent cursor-pointer font-medium"
              >
                Sign in
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                onClick={() => setIsSignup(true)}
                className="text-cl-accent cursor-pointer font-medium"
              >
                Create one free
              </span>
            </>
          )}
        </div>

        <div className="mt-4 p-2.5 bg-cl-surface2 rounded-lg text-[11px] text-cl-text3">
          🔒 Secured with bcrypt hashing · JWT authentication · HTTPS encrypted
        </div>
      </div>
    </div>
  );
};

export default Login;
