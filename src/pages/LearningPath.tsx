import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Module {
  id: number;
  title: string;
  skill: string;
  resource_type: string;
  url: string;
  estimated_hours: number;
  progress: number;
  is_completed: boolean;
  priority: string;
}

interface LearningPathData {
  id: number;
  title: string;
  description: string;
  job_title: string;
  skill_gaps: string[];
  total_skills_gap: number;
  estimated_hours: number;
  progress_percentage: number;
  learning_modules: Module[];
}

interface LearningPathState {
  title: string;
  description: string;
  job_title: string;
  progress: number;
  skill_gaps: string[];
  estimated_hours: number;
  modules: Module[];
}

const LearningPath = () => {
  const { toast } = useToast();
  const [learning, setLearning] = useState<LearningPathState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Resource recommendations for common skills
  const resourceMap: { [key: string]: Array<{ title: string; url: string; type: string; hours: number }> } = {
    "React.js": [
      { title: "React Documentation & Hooks Deep Dive", url: "https://react.dev", type: "documentation", hours: 8 },
      { title: "Advanced React Patterns & Performance", url: "https://www.youtube.com/results?search_query=react+advanced", type: "video", hours: 3 }
    ],
    "React": [
      { title: "React Documentation & Hooks Deep Dive", url: "https://react.dev", type: "documentation", hours: 8 },
      { title: "Advanced React Patterns", url: "https://www.youtube.com/results?search_query=react+patterns", type: "video", hours: 3 }
    ],
    "TypeScript": [
      { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs", type: "documentation", hours: 6 },
      { title: "TypeScript Complete Masterclass", url: "https://www.udemy.com/course/typescript-complete-developers-guide", type: "course", hours: 4 }
    ],
    "System Design": [
      { title: "System Design Interview Guide", url: "https://www.youtube.com/results?search_query=system+design+interview", type: "video", hours: 4 },
      { title: "Designing Data-Intensive Applications", url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491901632", type: "book", hours: 15 }
    ],
    "Python": [
      { title: "Python Official Tutorial", url: "https://docs.python.org/3/tutorial", type: "documentation", hours: 6 },
      { title: "Complete Python Bootcamp", url: "https://www.udemy.com/course/complete-python-bootcamp", type: "course", hours: 12 }
    ],
    "Docker": [
      { title: "Docker Official Documentation", url: "https://docs.docker.com", type: "documentation", hours: 5 },
      { title: "Docker & Kubernetes Crash Course", url: "https://www.youtube.com/results?search_query=docker+kubernetes", type: "video", hours: 3 }
    ],
    "Kubernetes": [
      { title: "Kubernetes Official Documentation", url: "https://kubernetes.io/docs", type: "documentation", hours: 8 },
      { title: "CKA Preparation Course", url: "https://www.linuxacademy.com", type: "course", hours: 20 }
    ],
    "GraphQL": [
      { title: "GraphQL Official Guide", url: "https://graphql.org/learn", type: "documentation", hours: 6 },
      { title: "The Modern GraphQL Bootcamp", url: "https://www.udemy.com/course/the-modern-graphql-bootcamp", type: "course", hours: 13 }
    ],
    "Machine Learning": [
      { title: "Machine Learning Specialization", url: "https://www.coursera.org/specializations/machine-learning", type: "course", hours: 40 },
      { title: "Scikit-learn Documentation", url: "https://scikit-learn.org/stable/documentation.html", type: "documentation", hours: 8 }
    ],
    "Deep Learning": [
      { title: "Deep Learning Course", url: "https://www.deeplearning.ai", type: "course", hours: 50 },
      { title: "PyTorch Fundamentals", url: "https://pytorch.org/tutorials", type: "documentation", hours: 10 }
    ],
    "AWS": [
      { title: "AWS Well-Architected Framework", url: "https://aws.amazon.com/architecture/well-architected", type: "documentation", hours: 6 },
      { title: "AWS Solutions Architect Associate", url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate", type: "course", hours: 20 }
    ],
    "REST APIs": [
      { title: "RESTful API Design Best Practices", url: "https://restfulapi.net", type: "documentation", hours: 4 },
      { title: "REST API Tutorial", url: "https://www.youtube.com/results?search_query=rest+api+tutorial", type: "video", hours: 2 }
    ],
    "Performance Optimization": [
      { title: "Web Performance Fundamentals", url: "https://www.coursera.org/learn/web-performance", type: "course", hours: 6 },
      { title: "React Performance Optimization", url: "https://www.youtube.com/results?search_query=react+performance", type: "video", hours: 3 }
    ],
  };

  const generateLearningModules = (skillGaps: any[], requiredSkills: string[]): Module[] => {
    const modules: Module[] = [];
    let moduleId = 1;

    // Generate modules for gap skills
    if (skillGaps && Array.isArray(skillGaps)) {
      const gapSkills = skillGaps
        .filter((gap: any) => gap.level === "Gap")
        .slice(0, 3)
        .map((gap: any) => gap.name);

      for (const skill of gapSkills) {
        const resources = resourceMap[skill] || [
          { title: `${skill} Complete Guide`, url: "https://www.udemy.com", type: "course", hours: 10 },
          { title: `${skill} Tutorial`, url: "https://www.youtube.com/results?search_query=" + skill.toLowerCase() + "+tutorial", type: "video", hours: 5 }
        ];

        for (let i = 0; i < resources.length; i++) {
          const resource = resources[i];
          modules.push({
            id: moduleId++,
            title: resource.title,
            skill: skill,
            resource_type: resource.type,
            url: resource.url,
            estimated_hours: resource.hours,
            progress: 0,
            is_completed: false,
            priority: "high"
          });
        }
      }
    }

    // Generate modules for additional recommended skills
    const additionalSkills = (requiredSkills || []).slice(3, 5);
    for (const skill of additionalSkills) {
      const resources = resourceMap[skill] || [
        { title: `${skill} Fundamentals`, url: "https://www.udemy.com", type: "course", hours: 8 }
      ];

      for (let i = 0; i < Math.min(resources.length, 1); i++) {
        const resource = resources[i];
        if (moduleId <= 20) {
          modules.push({
            id: moduleId++,
            title: resource.title,
            skill: skill,
            resource_type: resource.type,
            url: resource.url,
            estimated_hours: resource.hours,
            progress: 0,
            is_completed: false,
            priority: "medium"
          });
        }
      }
    }

    return modules;
  };

  useEffect(() => {
    const loadLearningPath = async () => {
      setLoading(true);
      setError(null);

      const jobTitle = searchParams.get("job_title") || "";
      const requiredSkillsParam = searchParams.get("required_skills") || "";
      const gapSkillsParam = searchParams.get("gap_skills") || "";
      const hasURLParams = !!(jobTitle || requiredSkillsParam || gapSkillsParam);

      if (hasURLParams) {
        try {
          const requiredSkills = requiredSkillsParam
            ? requiredSkillsParam.split(",").map((s) => s.trim()).filter(Boolean)
            : [];
          const gapSkillNames = gapSkillsParam
            ? gapSkillsParam.split(",").map((s) => s.trim()).filter(Boolean)
            : [];

          const skillGaps = gapSkillNames.map((name) => ({
            name,
            level: "Gap",
            pct: 10,
            color: "bg-red-500",
            textColor: "text-red-600",
          }));

          const response = await apiClient.createLearningPath({
            job_title: jobTitle,
            required_skills: requiredSkills,
            skill_gaps: skillGaps,
          });

          const path = response.data;
          setLearning({
            title: path.title || `${jobTitle} Preparation Path`,
            description: path.description || `Personalized learning path for ${jobTitle}`,
            job_title: path.job_title || jobTitle,
            progress: path.progress_percentage || 0,
            skill_gaps: path.skill_gaps?.length ? path.skill_gaps : gapSkillNames,
            estimated_hours: path.estimated_hours || 0,
            modules: path.learning_modules || [],
          });
        } catch (err: any) {
          setError(
            err.response?.data?.detail ||
              "Failed to create learning path. Please check your connection and try again."
          );
        } finally {
          setLoading(false);
        }
        return;
      }

      // Fallback: fetch existing learning paths from API
      try {
        const response = await apiClient.getMyLearningPaths();
        const paths: LearningPathData[] = response.data?.data || response.data || [];
        if (paths.length > 0) {
          const path = paths[0];
          setLearning({
            title: path.title || "Personalized Learning Path",
            description: path.description || "Your customized learning journey",
            job_title: path.job_title || "Target Role",
            progress: path.progress_percentage || 0,
            skill_gaps: path.skill_gaps || [],
            estimated_hours: path.estimated_hours || 0,
            modules: path.learning_modules || [],
          });
        }
      } catch (_err) {
        // Silent — user may not have any paths yet
      } finally {
        setLoading(false);
      }
    };

    loadLearningPath();
  }, [searchParams]);

  return (
    <AppShell
      title="Learning Path"
      subtitle={learning?.job_title ? `Preparing you for: ${learning.job_title}` : "Personalized Learning Path"}
      actions={
        <div className="flex gap-2">
          {learning && learning.skill_gaps.length > 0 && (
            <button
              onClick={() => navigate(`/assessments?skills=${encodeURIComponent(learning.skill_gaps.join(","))}`)}
              className="cl-btn cl-btn-primary cl-btn-sm"
            >
              🧪 Test Yourself
            </button>
          )}
          <button className="cl-btn cl-btn-outline cl-btn-sm">Filter by skill</button>
        </div>
      }
    >
      {error && (
        <div className="flex flex-col items-center py-12 text-center">
          <div className="text-3xl mb-3">⚠️</div>
          <div className="text-[14px] font-semibold text-cl-red mb-1">Something went wrong</div>
          <div className="text-[12.5px] text-cl-text3 mb-5 max-w-sm">{error}</div>
          <button onClick={() => window.history.back()} className="cl-btn cl-btn-outline">
            ← Go Back
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center py-12 text-center">
          <div className="text-[13px] text-cl-text3">Creating your learning path…</div>
        </div>
      )}

      {!error && !loading && learning ? (
        <>
          {/* Stats row */}
          <div className="flex gap-3.5 mb-4">
            <div className="flex-1 p-3 bg-card border border-border rounded-2xl">
              <div className="text-[10px] text-cl-text3 mb-0.5">Overall Progress</div>
              <div className="flex items-center gap-2.5">
                <div className="font-display text-xl font-bold">{Math.round(learning.progress)}%</div>
                <div className="flex-1"><div className="cl-progress-bar"><div className="cl-progress-fill bg-cl-accent2" style={{ width: `${learning.progress}%` }} /></div></div>
              </div>
            </div>
            <div className="p-3 px-4 bg-[hsl(var(--cl-accent2)/0.15)] border border-[hsl(var(--cl-accent)/0.2)] rounded-2xl">
              <div className="text-[10px] text-cl-accent mb-0.5">Resources remaining</div>
              <div className="font-display text-xl font-bold text-cl-accent">{learning.modules.filter(m => !m.is_completed).length}</div>
            </div>
            <div className="p-3 px-4 bg-card border border-border rounded-2xl">
              <div className="text-[10px] text-cl-text3 mb-0.5">Est. time left</div>
              <div className="font-display text-xl font-bold">{learning.estimated_hours}h</div>
            </div>
          </div>

          {/* Priority alert for top gap */}
          {learning.skill_gaps.length > 0 && (
            <div className="bg-cl-red-lt border border-[hsl(var(--cl-red)/0.2)] rounded-xl p-2.5 px-3.5 mb-3.5 flex items-center justify-between">
              <div>
                <div className="text-[12px] font-semibold text-cl-red">🎯 Priority Gap: {learning.skill_gaps[0]}</div>
                <div className="text-[11px] text-cl-text3 mt-0.5">High-priority skill needed for this role — start here</div>
              </div>
              <button className="cl-btn cl-btn-sm bg-cl-red text-primary-foreground border-none">Jump to</button>
            </div>
          )}

          {/* Learning modules grouped by skill */}
          {learning.skill_gaps.map((skill) => {
            const skillModules = learning.modules.filter(m => m.skill === skill);
            if (skillModules.length === 0) return null;

            return (
              <div key={skill}>
                <div className="flex items-center justify-between mb-3.5 mt-4">
                  <div className="cl-section-title">{skill} — Priority Learning</div>
                  <span className="cl-tag cl-tag-red">Gap</span>
                </div>

                {skillModules.map((module) => {
                  const isYouTube = module.url.includes("youtube.com") || module.url.includes("youtu.be");
                  return (
                  <a
                    key={module.id}
                    href={module.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 p-3 border border-border rounded-xl mb-2 items-start hover:border-cl-accent transition-colors group cursor-pointer no-underline"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-[52px] rounded-md flex-shrink-0 overflow-hidden">
                      <div className={`${
                        isYouTube ? "bg-[#FF0000]" :
                        module.resource_type === "course" ? "bg-[#4285F4]" :
                        module.resource_type === "documentation" ? "bg-[#6366F1]" :
                        "bg-[#8B5CF6]"
                      } text-white text-xs font-bold w-full h-full flex flex-col items-center justify-center rounded-md gap-0.5`}>
                        {isYouTube ? (
                          <>
                            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#FF0000"/></svg>
                            <span className="text-[9px] font-semibold">YouTube</span>
                          </>
                        ) : module.resource_type === "course" ? "📚" :
                           module.resource_type === "documentation" ? "📖" : "📹"}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-medium mb-0.5 group-hover:text-cl-accent transition-colors line-clamp-2">{module.title}</div>
                      <div className="text-[11px] text-cl-text3 mb-1.5 flex items-center gap-1.5">
                        {isYouTube && <span className="text-[#FF0000] font-semibold">YouTube</span>}
                        {!isYouTube && <span>{module.resource_type.charAt(0).toUpperCase() + module.resource_type.slice(1)}</span>}
                        <span>·</span>
                        <span>{module.estimated_hours}h</span>
                        <span className="ml-auto text-cl-accent text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Open ↗</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="cl-progress-bar flex-1"><div className="cl-progress-fill bg-cl-accent2" style={{ width: `${module.progress}%` }} /></div>
                        {module.is_completed ? (
                          <span className="text-[10.5px] text-cl-accent font-semibold">✓ Done</span>
                        ) : (
                          <span className="text-[10.5px] text-cl-text3">Not started</span>
                        )}
                      </div>
                    </div>
                  </a>
                  );
                })}
              </div>
            );
          })}

          {/* Additional skills to strengthen */}
          {learning.modules.filter(m => m.priority === "medium").length > 0 && (
            <>
              <div className="flex items-center justify-between mb-3.5 mt-5">
                <div className="cl-section-title">Strengthen Additional Skills</div>
                <span className="cl-tag cl-tag-amber">Recommended</span>
              </div>

              {learning.modules
                .filter(m => m.priority === "medium")
                .slice(0, 3)
                .map((module) => {
                  const isYouTube = module.url.includes("youtube.com") || module.url.includes("youtu.be");
                  return (
                  <a
                    key={module.id}
                    href={module.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 p-3 border border-border rounded-xl mb-2 items-start hover:border-cl-accent transition-colors group cursor-pointer no-underline"
                  >
                    <div className="w-20 h-[52px] rounded-md flex-shrink-0 overflow-hidden">
                      <div className={`${isYouTube ? "bg-[#FF0000]" : "bg-[#F59E0B]"} text-white text-xs font-bold w-full h-full flex flex-col items-center justify-center rounded-md gap-0.5`}>
                        {isYouTube ? (
                          <>
                            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#FF0000"/></svg>
                            <span className="text-[9px] font-semibold">YouTube</span>
                          </>
                        ) : (module.resource_type === "video" ? "▶" : "📚")}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-medium mb-0.5 group-hover:text-cl-accent transition-colors line-clamp-2">{module.title}</div>
                      <div className="text-[11px] text-cl-text3 mb-1.5 flex items-center gap-1.5">
                        <span>{module.skill}</span>
                        <span>·</span>
                        {isYouTube && <span className="text-[#FF0000] font-semibold">YouTube</span>}
                        {!isYouTube && <span>{module.resource_type}</span>}
                        <span>·</span>
                        <span>{module.estimated_hours}h</span>
                        <span className="ml-auto text-cl-accent text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Open ↗</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="cl-progress-bar flex-1"><div className="cl-progress-fill bg-cl-accent2" style={{ width: `${module.progress}%` }} /></div>
                        <span className="text-[10.5px] text-cl-text3">{module.is_completed ? "✓ Done" : "Not started"}</span>
                      </div>
                    </div>
                  </a>
                  );
                })}
            </>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-2xl mb-3">📚</div>
          <div className="text-[14px] font-semibold mb-1">No learning path yet</div>
          <div className="text-[12.5px] text-cl-text3 mb-5">Analyze a job to get a personalized learning path</div>
          <a href="/parser" className="cl-btn cl-btn-primary">
            Go to Job Parser
          </a>
        </div>
      )}
    </AppShell>
  );
};

export default LearningPath;
