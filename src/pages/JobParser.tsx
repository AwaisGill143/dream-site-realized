import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  id: number;
  required_skills: string[];
  technologies: string[];
  soft_skills: string[];
  experience_required: string;
  readiness_score?: number;
  job_title?: string;
  company?: string;
  seniority_level?: string;
  role_type?: string;
}

interface SkillGapAnalysis {
  id: number;
  resume_skills: string[];
  required_skills: string[];
  matching_skills: string[];
  gap_skills: string[];
  gap_percentage: number;
  priority_skills: string[];
}

interface SkillGap {
  name: string;
  level: string;
  pct: number;
  color: string;
  textColor: string;
}

const JobParser = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState(
    "We are looking for a Frontend Engineer with 3+ years of React and TypeScript experience. Strong understanding of system design, REST APIs, and performance optimization required. Experience with GraphQL and testing frameworks preferred..."
  );
  const [jobUrl, setJobUrl] = useState("https://careers.google.com/jobs/fe-2024");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [skillGapAnalysis, setSkillGapAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [loadingGaps, setLoadingGaps] = useState(false);
  const [step, setStep] = useState(0);

  // Fetch skill gap analysis after job analysis
  useEffect(() => {
    if (result?.id) {
      fetchSkillGaps(result.id);
    }
  }, [result?.id]);

  const fetchSkillGaps = async (jobAnalysisId: number) => {
    setLoadingGaps(true);
    try {
      const response = await apiClient.analyzeSkillGaps(jobAnalysisId);
      setSkillGapAnalysis(response.data);
    } catch (error: any) {
      console.error("Error fetching skill gaps:", error);
    } finally {
      setLoadingGaps(false);
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.analyzeJob(jobDescription, jobUrl);
      setResult(response.data);
      setStep(3); // Show results (step 3)
      
      // Store in session for learning path
      sessionStorage.setItem("latestJobAnalysis", JSON.stringify(response.data));
      
      toast({
        title: "Success",
        description: "Job analyzed successfully! Comparing with your resume...",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to analyze job",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLearningPath = async () => {
    if (!result?.id) {
      toast({
        title: "Error",
        description: "Please analyze a job first",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiClient.generateLearningPath(result.id);
      toast({
        title: "Success",
        description: "Learning path created with AI-powered concept teaching!",
      });
      navigate(`/learning`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create learning path",
        variant: "destructive",
      });
    }
  };
    if (!result) {
      toast({
        title: "Error",
        description: "Please analyze a job first",
        variant: "destructive",
      });
      return;
    }

    const gapSkills = (result.skill_gaps || [])
      .filter((g) => g.level === "Gap")
      .map((g) => g.name);

    const params = new URLSearchParams();
    if (result.job_title) params.set("job_title", result.job_title);
    if (result.required_skills?.length)
      params.set("required_skills", result.required_skills.join(","));
    if (gapSkills.length) params.set("gap_skills", gapSkills.join(","));

    navigate(`/learning?${params.toString()}`);
  };

  const gaps: SkillGap[] = result?.skill_gaps || [
    { name: "React.js", level: "Strong", pct: 88, color: "bg-cl-accent2", textColor: "text-cl-accent2" },
    { name: "TypeScript", level: "Good", pct: 72, color: "bg-cl-accent2", textColor: "text-cl-accent2" },
    { name: "System Design", level: "Fair", pct: 52, color: "bg-cl-amber", textColor: "text-cl-amber" },
    { name: "GraphQL", level: "Gap", pct: 18, color: "bg-cl-red", textColor: "text-cl-red" },
  ];

  return (
    <AppShell title="Job Parser" subtitle="Extract skills & requirements with AI">
      {/* Stepper */}
      <div className="flex items-center mb-6">
        {["Input", "Analysis", "Skill Gap", "Learning Path"].map((step_name, i) => (
          <div key={step_name} className="flex flex-col items-center flex-1 relative">
            {i < 3 && <div className="absolute top-3.5 left-1/2 w-full h-[1.5px] bg-border" />}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold z-10 ${
                i === 0
                  ? "bg-cl-accent text-primary-foreground"
                  : i === 1
                    ? "bg-card border-2 border-cl-accent text-cl-accent shadow-[0_0_0_4px_hsl(var(--cl-accent2)/0.15)]"
                    : "bg-card border-2 border-border text-cl-text3"
              }`}
            >
              {i === 0 ? "✓" : i + 1}
            </div>
            <div className={`text-[10px] mt-1.5 ${i <= 1 ? "text-cl-text2" : "text-cl-text3"}`}>{step_name}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="cl-card mb-3.5">
            <div className="cl-section-title mb-2.5">Job Description Input</div>
            <div className="mb-3.5">
              <label className="cl-label">Job URL (optional)</label>
              <input
                className="cl-input"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
              />
            </div>
            <div className="mb-3.5">
              <label className="cl-label">Or paste job description</label>
              <textarea
                className="cl-input h-[100px] resize-none"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mb-3.5">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="cl-btn cl-btn-primary flex-1 justify-center disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Analyze with AI"}
              </button>
              <button
                onClick={() => {
                  setJobDescription("");
                  setJobUrl("");
                  setResult(null);
                }}
                className="cl-btn cl-btn-outline"
              >
                Clear
              </button>
            </div>
            {result && (
              <button
                onClick={handleCreateLearningPath}
                className="cl-btn cl-btn-accent w-full justify-center"
              >
                📚 Create Learning Path
              </button>
            )}
          </div>
          <div className="cl-card">
            <div className="cl-section-title mb-2.5">Role Classification</div>
            <div className="flex flex-wrap gap-2">
              {result ? (
                <>
                  <div className="px-3 py-1.5 rounded-lg bg-[hsl(var(--cl-accent2)/0.15)] border border-[hsl(var(--cl-accent)/0.2)]">
                    <div className="text-[10px] text-cl-text3">Role Type</div>
                    <div className="text-[12.5px] font-semibold text-cl-accent">{result.role_type || "Full-Stack"}</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-cl-blue-lt border border-[hsl(var(--cl-blue)/0.2)]">
                    <div className="text-[10px] text-cl-text3">Seniority</div>
                    <div className="text-[12.5px] font-semibold text-cl-blue">{result.seniority_level || "Mid-Level"}</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-cl-amber-lt border border-[hsl(var(--cl-amber)/0.2)]">
                    <div className="text-[10px] text-cl-text3">Company</div>
                    <div className="text-[12.5px] font-semibold text-cl-amber">{result.company || "Unknown"}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-3 py-1.5 rounded-lg bg-[hsl(var(--cl-accent2)/0.15)] border border-[hsl(var(--cl-accent)/0.2)]">
                    <div className="text-[10px] text-cl-text3">Role Type</div>
                    <div className="text-[12.5px] font-semibold text-cl-accent">Frontend Engineer</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-cl-blue-lt border border-[hsl(var(--cl-blue)/0.2)]">
                    <div className="text-[10px] text-cl-text3">Seniority</div>
                    <div className="text-[12.5px] font-semibold text-cl-blue">Mid-Level (3-5 yrs)</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-cl-amber-lt border border-[hsl(var(--cl-amber)/0.2)]">
                    <div className="text-[10px] text-cl-text3">Company</div>
                    <div className="text-[12.5px] font-semibold text-cl-amber">Google</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="cl-card mb-3.5">
            <div className="flex items-center justify-between mb-3">
              <div className="cl-section-title">Extracted Skills</div>
              {result && <span className="cl-tag cl-tag-green text-[10px]">AI Parsed</span>}
            </div>
            {result ? (
              <>
                {[
                  { title: "Required", tags: result.required_skills || [], cls: "cl-tag-green" },
                  { title: "Preferred", tags: result.soft_skills || [], cls: "cl-tag-blue" },
                  { title: "Tech Stack", tags: result.technologies || [], cls: "cl-tag-gray" },
                ].map((section) => (
                  <div key={section.title} className="mb-2.5">
                    <div className="text-[11px] font-semibold text-cl-text2 uppercase tracking-wider mb-1.5">
                      {section.title}
                    </div>
                    <div className="flex flex-wrap gap-1.5 p-3.5 bg-cl-surface2 rounded-xl">
                      {section.tags.map((tag) => (
                        <span key={tag} className={`cl-tag ${section.cls}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { title: "Required", tags: skills.required, cls: "cl-tag-green" },
                  { title: "Preferred", tags: skills.preferred, cls: "cl-tag-blue" },
                  { title: "Tech Stack", tags: skills.stack, cls: "cl-tag-gray" },
                ].map((section) => (
                  <div key={section.title} className="mb-2.5">
                    <div className="text-[11px] font-semibold text-cl-text2 uppercase tracking-wider mb-1.5">
                      {section.title}
                    </div>
                    <div className="flex flex-wrap gap-1.5 p-3.5 bg-cl-surface2 rounded-xl">
                      {section.tags.map((tag) => (
                        <span key={tag} className={`cl-tag ${section.cls}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="cl-card">
            <div className="cl-section-title mb-3">Skill Gap Analysis</div>
            {gaps.map((gap) => {
              // Map gap level to color
              let colorClass = "bg-cl-accent2";
              let textColorClass = "text-cl-accent2";
              
              if (gap.level === "Strong") {
                colorClass = "bg-cl-accent2";
                textColorClass = "text-cl-accent2";
              } else if (gap.level === "Good") {
                colorClass = "bg-cl-blue";
                textColorClass = "text-cl-blue";
              } else if (gap.level === "Fair") {
                colorClass = "bg-cl-amber";
                textColorClass = "text-cl-amber";
              } else if (gap.level === "Gap") {
                colorClass = "bg-cl-red";
                textColorClass = "text-cl-red";
              }
              
              return (
                <div key={gap.name} className="mb-2.5">
                  <div className="flex justify-between mb-0.5 text-[11.5px]">
                    <span>{gap.name}</span>
                    <span className={`font-semibold ${textColorClass}`}>{gap.level}</span>
                  </div>
                  <div className="cl-progress-bar">
                    <div className={`cl-progress-fill ${colorClass}`} style={{ width: `${gap.pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default JobParser;
