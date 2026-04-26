import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type Phase = "setup" | "generating" | "quiz" | "results";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
}

interface ResultQuestion extends Question {
  user_answer: number | null;
  is_correct: boolean;
}

interface ResultData {
  score: number;
  feedback: string;
  correct_count: number;
  total: number;
  questions: ResultQuestion[];
}

const LETTERS = ["A", "B", "C", "D"];

const Assessments = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [phase, setPhase] = useState<Phase>("setup");

  // Setup state
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);

  // Quiz state
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);

  // Results state
  const [results, setResults] = useState<ResultData | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Refs to avoid stale closures in timer
  const answersRef = useRef<Record<number, number>>({});
  const assessmentIdRef = useRef<number | null>(null);
  const submittingRef = useRef(false);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { assessmentIdRef.current = assessmentId; }, [assessmentId]);
  useEffect(() => { submittingRef.current = submitting; }, [submitting]);

  // Read skills from URL on mount
  useEffect(() => {
    const skillsParam = searchParams.get("skills");
    if (skillsParam) {
      const parsed = skillsParam.split(",").map((s) => s.trim()).filter(Boolean);
      setSkills(parsed);
    }
  }, [searchParams]);

  // Countdown timer
  useEffect(() => {
    if (phase !== "quiz") return;

    const tick = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(tick);
          setTimeout(() => {
            if (!submittingRef.current) doSubmit(true);
          }, 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => setSkills((prev) => prev.filter((s) => s !== skill));

  const handleGenerate = async () => {
    if (skills.length === 0) {
      toast({ title: "Add at least one skill", variant: "destructive" });
      return;
    }
    setPhase("generating");
    try {
      const response = await apiClient.createAssessmentFromSkills(skills, numQuestions);
      const data = response.data;
      setAssessmentId(data.id);
      assessmentIdRef.current = data.id;
      setQuestions(data.questions || []);
      setTimeLeft(numQuestions * 90);
      setAnswers({});
      answersRef.current = {};
      setCurrentQ(0);
      setPhase("quiz");
    } catch (err: any) {
      toast({
        title: "Failed to generate assessment",
        description: err.response?.data?.detail || "Please try again",
        variant: "destructive",
      });
      setPhase("setup");
    }
  };

  const doSubmit = async (isAutoSubmit = false) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const response = await apiClient.submitAssessmentWithAnswers(
        assessmentIdRef.current!,
        answersRef.current
      );
      setResults(response.data);
      setPhase("results");
      if (isAutoSubmit) {
        toast({ title: "Time's up!", description: "Your test has been submitted automatically." });
      }
    } catch (err: any) {
      toast({
        title: "Failed to submit",
        description: err.response?.data?.detail || "Please try again",
        variant: "destructive",
      });
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const currentQuestion = questions[currentQ];

  // ==================== SETUP ====================
  if (phase === "setup") {
    return (
      <AppShell title="Assessments" subtitle="AI-Powered Skill Test">
        <div className="max-w-lg mx-auto mt-4">
          <div className="cl-card mb-4">
            <div className="cl-section-title mb-3">Skills to Test</div>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill) => (
                  <span key={skill} className="cl-tag cl-tag-green flex items-center gap-1.5">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="text-[10px] hover:opacity-60 leading-none">✕</button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-[12px] text-cl-text3 mb-3 p-3 border border-dashed border-border rounded-xl text-center">
                No skills added — type a skill and press Add or Enter
              </div>
            )}
            <div className="flex gap-2">
              <input
                className="cl-input flex-1"
                placeholder="e.g. React, Python, SQL, System Design"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
              />
              <button onClick={addSkill} className="cl-btn cl-btn-outline">Add</button>
            </div>
          </div>

          <div className="cl-card mb-5">
            <div className="cl-section-title mb-3">Test Configuration</div>
            <label className="cl-label mb-2 block">Number of Questions</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((n) => (
                <button
                  key={n}
                  onClick={() => setNumQuestions(n)}
                  className={`py-2.5 rounded-xl border text-[13px] font-semibold transition-all ${
                    numQuestions === n
                      ? "border-cl-accent bg-[hsl(var(--cl-accent2)/0.15)] text-cl-accent"
                      : "border-border hover:border-cl-accent/50 text-cl-text2"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="mt-3 text-[11.5px] text-cl-text3">
              ⏱ Time limit:{" "}
              <span className="font-semibold text-cl-text2">
                {Math.floor((numQuestions * 90) / 60)} min {(numQuestions * 90) % 60 > 0 ? `${(numQuestions * 90) % 60}s` : ""}
              </span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={skills.length === 0}
            className="cl-btn cl-btn-primary w-full justify-center disabled:opacity-40"
          >
            Generate Test →
          </button>
        </div>
      </AppShell>
    );
  }

  // ==================== GENERATING ====================
  if (phase === "generating") {
    return (
      <AppShell title="Assessments" subtitle="Preparing your test…">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 border-2 border-cl-accent border-t-transparent rounded-full animate-spin" />
          <div className="text-[13px] text-cl-text3">
            AI is crafting {numQuestions} questions on{" "}
            <span className="font-semibold text-cl-text2">{skills.join(", ")}</span>…
          </div>
        </div>
      </AppShell>
    );
  }

  // ==================== RESULTS ====================
  if (phase === "results" && results) {
    const pct = Math.round(results.score);
    const scoreColor = pct >= 70 ? "text-cl-accent2" : pct >= 50 ? "text-cl-amber" : "text-cl-red";

    return (
      <AppShell
        title="Results"
        subtitle={`${results.correct_count} / ${results.total} correct`}
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => { setPhase("setup"); setResults(null); setAnswers({}); }}
              className="cl-btn cl-btn-outline cl-btn-sm"
            >
              Try Again
            </button>
            <button onClick={() => navigate("/assessments")} className="cl-btn cl-btn-primary cl-btn-sm">
              New Test
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-3 gap-3.5 mb-5">
          <div className="col-span-1 cl-card flex flex-col items-center justify-center py-6">
            <div className={`font-display text-5xl font-bold ${scoreColor}`}>{pct}%</div>
            <div className="text-[11px] text-cl-text3 mt-1">Final Score</div>
          </div>
          <div className="col-span-2 cl-card">
            <div className="cl-section-title mb-2">Feedback</div>
            <div className="text-[12.5px] text-cl-text2 leading-relaxed">{results.feedback}</div>
            <div className="flex mt-3 divide-x divide-border">
              <div className="text-center flex-1 pr-3">
                <div className="font-display text-xl font-bold text-cl-accent2">{results.correct_count}</div>
                <div className="text-[10px] text-cl-text3">Correct</div>
              </div>
              <div className="text-center flex-1 px-3">
                <div className="font-display text-xl font-bold text-cl-red">
                  {results.questions.filter((q) => q.user_answer !== null && !q.is_correct).length}
                </div>
                <div className="text-[10px] text-cl-text3">Wrong</div>
              </div>
              <div className="text-center flex-1 pl-3">
                <div className="font-display text-xl font-bold text-cl-text3">
                  {results.questions.filter((q) => q.user_answer === null).length}
                </div>
                <div className="text-[10px] text-cl-text3">Skipped</div>
              </div>
            </div>
          </div>
        </div>

        <div className="cl-section-title mb-3">Question Review</div>
        <div className="space-y-2.5">
          {results.questions.map((q, i) => {
            const status = q.user_answer === null ? "skipped" : q.is_correct ? "correct" : "wrong";
            return (
              <div
                key={q.id}
                className={`cl-card border-l-4 ${
                  status === "correct" ? "border-l-[hsl(var(--cl-accent2))]"
                  : status === "wrong" ? "border-l-[hsl(var(--cl-red))]"
                  : "border-l-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="text-[12.5px] font-medium flex-1 leading-snug">Q{i + 1}. {q.question}</div>
                  <span className={`cl-tag flex-shrink-0 ${
                    status === "correct" ? "cl-tag-green" : status === "wrong" ? "cl-tag-red" : "cl-tag-gray"
                  }`}>
                    {status === "correct" ? "✓ Correct" : status === "wrong" ? "✗ Wrong" : "Skipped"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {q.options.map((opt, idx) => {
                    const isCorrect = idx === q.correct_answer;
                    const isUserWrong = idx === q.user_answer && !q.is_correct;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 p-2 px-3 rounded-lg text-[11.5px] ${
                          isCorrect
                            ? "bg-[hsl(var(--cl-accent2)/0.15)] border border-[hsl(var(--cl-accent2)/0.4)] text-cl-accent2 font-semibold"
                            : isUserWrong
                            ? "bg-[hsl(var(--cl-red)/0.1)] border border-[hsl(var(--cl-red)/0.3)] text-cl-red"
                            : "bg-cl-surface2 border border-transparent text-cl-text3"
                        }`}
                      >
                        <span className="font-bold flex-shrink-0">{LETTERS[idx]}.</span>
                        <span className="flex-1">{opt}</span>
                        {isCorrect && <span className="ml-auto">✓</span>}
                        {isUserWrong && <span className="ml-auto">✗</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </AppShell>
    );
  }

  // ==================== QUIZ ====================
  const isTimeWarning = timeLeft > 0 && timeLeft <= 60;

  return (
    <AppShell
      title="Assessment"
      subtitle={`${skills.join(", ")} — Q${currentQ + 1} of ${questions.length}`}
      actions={
        <div className="flex items-center gap-3">
          <span className={`text-[13px] font-bold font-mono tabular-nums ${isTimeWarning ? "text-cl-red animate-pulse" : "text-cl-amber"}`}>
            ⏱ {formatTime(timeLeft)}
          </span>
          <button
            onClick={() => doSubmit(false)}
            disabled={submitting}
            className="cl-btn cl-btn-outline cl-btn-sm"
            style={{ color: "hsl(var(--cl-red))", borderColor: "hsl(var(--cl-red)/0.4)" }}
          >
            {submitting ? "Submitting…" : "Submit Test"}
          </button>
        </div>
      }
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] text-cl-text3">{answeredCount} of {questions.length} answered</span>
        <span className="text-[11px] font-semibold text-cl-text2">
          {questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0}%
        </span>
      </div>
      <div className="cl-progress-bar h-1.5 mb-5">
        <div
          className="cl-progress-fill bg-cl-accent2 transition-all duration-300"
          style={{ width: `${questions.length > 0 ? (answeredCount / questions.length) * 100 : 0}%` }}
        />
      </div>

      {currentQuestion && (
        <div className="grid grid-cols-[1fr_200px] gap-4 items-start">
          {/* Question panel */}
          <div className="cl-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold tracking-wide text-cl-accent uppercase">
                Question {currentQ + 1}
              </span>
              <div className="flex gap-1.5">
                {skills.slice(0, 2).map((s) => (
                  <span key={s} className="cl-tag cl-tag-blue">{s}</span>
                ))}
              </div>
            </div>

            <div className="text-[13.5px] font-medium leading-relaxed mb-4">
              {currentQuestion.question}
            </div>

            <div className="space-y-2 mb-5">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = answers[currentQuestion.id] === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: idx }))}
                    className={`flex items-center gap-3 p-2.5 px-3.5 border rounded-xl cursor-pointer text-[12.5px] transition-all select-none ${
                      isSelected
                        ? "border-cl-accent bg-[hsl(var(--cl-accent2)/0.15)] text-cl-accent"
                        : "border-border hover:border-cl-accent/50 hover:bg-[hsl(var(--cl-accent2)/0.05)]"
                    }`}
                  >
                    <div className={`w-[22px] h-[22px] rounded-full border-[1.5px] flex items-center justify-center text-[10.5px] font-bold flex-shrink-0 transition-all ${
                      isSelected ? "border-cl-accent bg-cl-accent text-primary-foreground" : "border-current text-cl-text3"
                    }`}>
                      {LETTERS[idx]}
                    </div>
                    {opt}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentQ((q) => Math.max(0, q - 1))}
                disabled={currentQ === 0}
                className="cl-btn cl-btn-outline flex-1 justify-center disabled:opacity-40"
              >
                ← Prev
              </button>
              {currentQ < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQ((q) => q + 1)}
                  className="cl-btn cl-btn-primary flex-[2] justify-center"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={() => doSubmit(false)}
                  disabled={submitting}
                  className="cl-btn cl-btn-primary flex-[2] justify-center disabled:opacity-50"
                >
                  {submitting ? "Submitting…" : "Finish Test ✓"}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            <div className="cl-card">
              <div className="cl-section-title mb-2.5 text-[11.5px]">Navigator</div>
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((q, i) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isCurrent = i === currentQ;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQ(i)}
                      className={`aspect-square rounded-lg text-[11px] font-semibold transition-all ${
                        isCurrent
                          ? "bg-cl-accent text-primary-foreground"
                          : isAnswered
                          ? "bg-[hsl(var(--cl-accent2)/0.25)] text-cl-accent border border-[hsl(var(--cl-accent2)/0.5)]"
                          : "bg-cl-surface2 text-cl-text3 hover:bg-[hsl(var(--cl-accent)/0.1)]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 mt-3 text-[10px] text-cl-text3">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-cl-accent inline-block" /> Current</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded inline-block" style={{ background: "hsl(var(--cl-accent2)/0.4)" }} /> Done</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-cl-surface2 inline-block" /> Skip</span>
              </div>
            </div>

            <div className="cl-card">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <div className="font-display text-xl font-bold text-cl-accent2">{answeredCount}</div>
                  <div className="text-[10px] text-cl-text3">Done</div>
                </div>
                <div>
                  <div className="font-display text-xl font-bold text-cl-text3">{questions.length - answeredCount}</div>
                  <div className="text-[10px] text-cl-text3">Left</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default Assessments;
