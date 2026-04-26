import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface JobAnalysis {
  id: number;
  title?: string;
  company?: string;
  status?: string;
  readiness_score?: number;
  required_skills?: string[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [jobAnalyses, setJobAnalyses] = useState<JobAnalysis[]>([]);
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, interviewsRes] = await Promise.all([
          apiClient.getMyJobAnalyses(),
          apiClient.getMyInterviews(),
        ]);

        setJobAnalyses(jobsRes.data || []);
        setInterviews(interviewsRes.data || []);

        if (jobsRes.data?.length === 0 && interviewsRes.data?.length === 0) {
          toast({
            title: "Welcome!",
            description: "Start by analyzing a job or creating an assessment.",
          });
        }
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      val: `${jobAnalyses.length}`,
      label: "Jobs Analyzed",
      delta: `${jobAnalyses.length} total`,
    },
    { val: `${interviews.length}`, label: "Interviews Practiced", delta: "Recent sessions" },
    { val: jobAnalyses.length > 0 ? Math.round(jobAnalyses[0]?.readiness_score || 0) + "%" : "0%", label: "Avg Readiness", delta: "Current job" },
    { val: "∞", label: "Unlimited", delta: "Practice mode" },
  ];

  return (
    <AppShell
      title="Dashboard"
      subtitle={new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      actions={
        <>
          <button onClick={() => navigate("/parser")} className="cl-btn cl-btn-outline cl-btn-sm">
            + New Job
          </button>
          <button onClick={() => navigate("/interview")} className="cl-btn cl-btn-primary cl-btn-sm">
            Start Interview
          </button>
        </>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="cl-stat-card">
            <div className="font-display text-[26px] font-bold leading-none">{s.val}</div>
            <div className="text-[11px] text-cl-text3 mt-1">{s.label}</div>
            <span className="text-[10px] text-cl-accent2 bg-[hsl(var(--cl-accent2)/0.15)] px-1.5 py-0.5 rounded-full inline-block mt-1.5">{s.delta}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Active Job Targets */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="cl-section-title">Active Job Targets</div>
            <span className="text-[11px] text-cl-accent cursor-pointer">View all</span>
          </div>
          <div className="cl-card-sm mb-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <div className="text-[13px] font-semibold">Frontend Engineer</div>
                <div className="text-[11px] text-cl-text3">Google · Remote</div>
              </div>
              <span className="cl-tag cl-tag-amber">In Progress</span>
            </div>
            <div className="mb-1.5">
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-cl-text3">Readiness</span>
                <span className="font-semibold">73%</span>
              </div>
              <div className="cl-progress-bar"><div className="cl-progress-fill bg-cl-accent2" style={{ width: "73%" }} /></div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="cl-skill-chip">React</span>
              <span className="cl-skill-chip">TypeScript</span>
              <span className="cl-skill-chip">System Design</span>
              <span className="cl-skill-chip bg-cl-red-lt text-cl-red">GraphQL ✗</span>
            </div>
          </div>
          <div className="cl-card-sm">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <div className="text-[13px] font-semibold">Full Stack Developer</div>
                <div className="text-[11px] text-cl-text3">Meta · Hybrid</div>
              </div>
              <span className="cl-tag cl-tag-blue">Analyzing</span>
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-cl-text3">Readiness</span>
                <span className="font-semibold">61%</span>
              </div>
              <div className="cl-progress-bar"><div className="cl-progress-fill bg-cl-accent2" style={{ width: "61%" }} /></div>
            </div>
          </div>
        </div>

        {/* Skill Radar */}
        <div>
          <div className="mb-3.5"><div className="cl-section-title">Skill Radar</div></div>
          <div className="cl-card flex items-center justify-center p-2.5">
            <svg width="190" height="190" viewBox="0 0 190 190">
              <g transform="translate(95,95)">
                <polygon points="0,-70 60.6,-35 60.6,35 0,70 -60.6,35 -60.6,-35" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
                <polygon points="0,-52 45.5,-26 45.5,26 0,52 -45.5,26 -45.5,-26" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
                <polygon points="0,-35 30.3,-17.5 30.3,17.5 0,35 -30.3,17.5 -30.3,-17.5" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
                <line x1="0" y1="-70" x2="0" y2="70" stroke="hsl(var(--border))" strokeWidth="0.5" />
                <line x1="60.6" y1="-35" x2="-60.6" y2="35" stroke="hsl(var(--border))" strokeWidth="0.5" />
                <line x1="60.6" y1="35" x2="-60.6" y2="-35" stroke="hsl(var(--border))" strokeWidth="0.5" />
                <polygon points="0,-58 48,-21 42,28 -10,62 -50,20 -44,-30" fill="rgba(42,92,69,.15)" stroke="rgba(42,92,69,.7)" strokeWidth="1.5" />
                <text y="-76" textAnchor="middle" fontSize="9" fill="hsl(var(--cl-text3))" fontFamily="DM Sans">React/TS</text>
                <text x="68" y="-32" fontSize="9" fill="hsl(var(--cl-text3))" fontFamily="DM Sans">System Design</text>
                <text x="64" y="42" fontSize="9" fill="hsl(var(--cl-text3))" fontFamily="DM Sans">Algorithms</text>
                <text y="80" textAnchor="middle" fontSize="9" fill="hsl(var(--cl-text3))" fontFamily="DM Sans">Behavioral</text>
                <text x="-105" y="28" fontSize="9" fill="hsl(var(--cl-text3))" fontFamily="DM Sans">Backend</text>
                <text x="-72" y="-34" fontSize="9" fill="hsl(var(--cl-text3))" fontFamily="DM Sans">DSA</text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-4">
        <div className="mb-3.5"><div className="cl-section-title">Recent Activity</div></div>
        <div className="cl-card p-3">
          {[
            { color: "bg-cl-accent2", title: "Completed MCQ Assessment", sub: "React Fundamentals · 18/20 correct · 2 hours ago" },
            { color: "bg-cl-accent2", title: "Mock Interview Session", sub: "Frontend Engineer @ Google · 45 min · Yesterday" },
            { color: "bg-cl-amber", title: "Learning Path Updated", sub: "3 new GraphQL resources added · 2 days ago" },
          ].map((item, i) => (
            <div key={i} className={`flex gap-3 ${i < 2 ? "mb-3.5" : ""}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${item.color} mt-1 flex-shrink-0`} />
              <div>
                <div className="text-[12.5px] font-medium">{item.title}</div>
                <div className="text-[11px] text-cl-text3">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
