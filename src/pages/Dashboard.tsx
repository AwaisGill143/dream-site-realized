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
  job_description?: string;
}

interface Resume {
  id: number;
  file_name: string;
  extracted_skills: string[];
  is_primary: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [jobAnalyses, setJobAnalyses] = useState<JobAnalysis[]>([]);
  const [interviews, setInterviews] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [resume, setResume] = useState<Resume | null>(null);
  const [performanceStats, setPerformanceStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, interviewsRes, perfRes, resumeRes, perfStatsRes] = await Promise.all([
          apiClient.getMyJobAnalyses().catch(() => ({ data: { data: [] } })),
          apiClient.getMyInterviews().catch(() => ({ data: { data: [] } })),
          apiClient.getMyAssessments().catch(() => ({ data: { data: [] } })),
          apiClient.getPrimaryResume().catch(() => null),
          apiClient.getPerformanceStats().catch(() => null),
        ]);

        const jobs = jobsRes.data?.data ?? jobsRes.data ?? [];
        const ivws = interviewsRes.data?.data ?? interviewsRes.data ?? [];
        const assessments = perfRes.data?.data ?? perfRes.data ?? [];

        setJobAnalyses(jobs);
        setInterviews(ivws);
        // Merge assessments + interviews into a unified recent-activity list
        const merged = [
          ...assessments.map((a: any) => ({ ...a, activity_type: a.activity_type ?? 'assessment' })),
          ...ivws.map((i: any) => ({ ...i, activity_type: 'interview', score: i.overall_score ?? i.score })),
        ].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        setPerformances(merged);
        setResume(resumeRes?.data || null);
        setPerformanceStats(perfStatsRes?.data || null);

        if (!jobsRes.data?.length && !interviewsRes.data?.length) {
          toast({
            title: "Welcome!",
            description: "Start by uploading your resume and analyzing a job.",
          });
        }
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
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
    { 
      val: `${interviews.length}`, 
      label: "Interviews Practiced", 
      delta: `${interviews.length} sessions` 
    },
    { 
      val: jobAnalyses.length > 0 ? Math.round(jobAnalyses[0]?.readiness_score || 0) + "%" : "0%", 
      label: "Avg Readiness", 
      delta: "Latest job" 
    },
    { 
      val: resume ? "✓" : "⊘", 
      label: "Resume Status", 
      delta: resume ? "Uploaded" : "Upload now" 
    },
  ];

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await apiClient.uploadResume(file, true);
      setResume(response.data);
      toast({
        title: "Success",
        description: "Resume uploaded and parsed successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to upload resume",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <AppShell title="Dashboard" subtitle="Loading...">
        <div className="flex items-center justify-center h-96">
          <div className="text-cl-text3">Loading your dashboard...</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Dashboard"
      subtitle={new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      actions={
        <>
          {!resume && (
            <label className="cl-btn cl-btn-outline cl-btn-sm cursor-pointer">
              📄 Add Resume
              <input type="file" onChange={handleResumeUpload} accept=".pdf,.docx,.txt" hidden />
            </label>
          )}
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
            {jobAnalyses.length > 2 && <span className="text-[11px] text-cl-accent cursor-pointer">View all</span>}
          </div>
          {jobAnalyses.length > 0 ? (
            <div>
              {jobAnalyses.slice(0, 2).map((job, idx) => (
                <div key={job.id} className={`cl-card-sm ${idx < 1 ? "mb-2.5" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <div className="text-[13px] font-semibold">{job.title || "Job Analysis"}</div>
                      <div className="text-[11px] text-cl-text3">{job.company || "Job Position"}</div>
                    </div>
                    <span className={`cl-tag ${job.readiness_score && job.readiness_score > 70 ? "cl-tag-green" : "cl-tag-amber"}`}>
                      {Math.round(job.readiness_score || 0)}%
                    </span>
                  </div>
                  <div className="mb-1.5">
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-cl-text3">Readiness</span>
                      <span className="font-semibold">{Math.round(job.readiness_score || 0)}%</span>
                    </div>
                    <div className="cl-progress-bar">
                      <div className="cl-progress-fill bg-cl-accent2" style={{ width: `${job.readiness_score || 0}%` }} />
                    </div>
                  </div>
                  {job.required_skills && job.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.required_skills.slice(0, 4).map((skill, i) => (
                        <span key={i} className="cl-skill-chip">{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="cl-card-sm p-4 text-center">
              <p className="text-[12px] text-cl-text3">No jobs analyzed yet</p>
              <button onClick={() => navigate("/parser")} className="text-[11px] text-cl-accent mt-2 hover:underline">
                Start by analyzing a job
              </button>
            </div>
          )}
        </div>

        {/* Resume & Skill Summary */}
        <div>
          <div className="mb-3.5"><div className="cl-section-title">Resume & Skills</div></div>
          {resume ? (
            <div className="cl-card-sm mb-2.5">
              <div className="text-[13px] font-semibold mb-2">📄 {resume.file_name}</div>
              <div className="text-[11px] text-cl-text3 mb-2">
                <span className="font-medium">Extracted Skills: </span>
                {resume.extracted_skills.length}
              </div>
              <div className="flex flex-wrap gap-1">
                {resume.extracted_skills.slice(0, 5).map((skill, i) => (
                  <span key={i} className="cl-skill-chip text-[10px]">{skill}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="cl-card-sm p-4 text-center border-2 border-dashed">
              <p className="text-[12px] text-cl-text3 mb-2">No resume uploaded</p>
              <label className="text-[11px] text-cl-accent hover:underline cursor-pointer">
                Upload your resume
                <input type="file" onChange={handleResumeUpload} accept=".pdf,.docx,.txt" hidden />
              </label>
            </div>
          )}

          {performanceStats && (
            <div className="cl-card-sm p-3 mt-2.5">
              <div className="text-[11px] font-semibold mb-2">Performance Summary</div>
              <div className="text-[10px] text-cl-text3 space-y-1">
                {Object.entries(performanceStats).map(([key, stats]: any) => (
                  <div key={key} className="flex justify-between">
                    <span>{key}</span>
                    <span>{stats.count} attempts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {performances.length > 0 && (
        <div className="mt-4">
          <div className="mb-3.5"><div className="cl-section-title">Recent Activity</div></div>
          <div className="cl-card p-3">
            {performances.slice(0, 3).map((perf: any, i: number) => (
              <div key={perf.id} className={`flex gap-3 ${i < 2 ? "mb-3.5" : ""}`}>
                <div className="w-2.5 h-2.5 rounded-full bg-cl-accent2 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-[12.5px] font-medium capitalize">
                    {perf.activity_type} {perf.score ? `- ${Math.round(perf.score)}%` : ""}
                  </div>
                  <div className="text-[11px] text-cl-text3">
                    {perf.time_taken_seconds ? `${Math.round(perf.time_taken_seconds / 60)} min` : "Just now"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default Dashboard;