import AppShell from "@/components/layout/AppShell";

const skills = {
  required: ["React.js", "TypeScript", "REST APIs", "System Design", "Performance Opt."],
  preferred: ["GraphQL", "Jest/Testing", "CI/CD"],
  stack: ["Node.js", "PostgreSQL", "Docker", "AWS"],
};

const gaps = [
  { name: "React.js", level: "Strong", pct: 88, color: "bg-cl-accent2", textColor: "text-cl-accent2" },
  { name: "TypeScript", level: "Good", pct: 72, color: "bg-cl-accent2", textColor: "text-cl-accent2" },
  { name: "System Design", level: "Fair", pct: 52, color: "bg-cl-amber", textColor: "text-cl-amber" },
  { name: "GraphQL", level: "Gap", pct: 18, color: "bg-cl-red", textColor: "text-cl-red" },
];

const JobParser = () => {
  return (
    <AppShell title="Job Parser" subtitle="Extract skills & requirements with AI">
      {/* Stepper */}
      <div className="flex items-center mb-6">
        {["Input", "Analysis", "Skill Gap", "Learning Path"].map((step, i) => (
          <div key={step} className="flex flex-col items-center flex-1 relative">
            {i < 3 && <div className="absolute top-3.5 left-1/2 w-full h-[1.5px] bg-border" />}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold z-10 ${
              i === 0 ? "bg-cl-accent text-primary-foreground" :
              i === 1 ? "bg-card border-2 border-cl-accent text-cl-accent shadow-[0_0_0_4px_hsl(var(--cl-accent2)/0.15)]" :
              "bg-card border-2 border-border text-cl-text3"
            }`}>
              {i === 0 ? "✓" : i + 1}
            </div>
            <div className={`text-[10px] mt-1.5 ${i <= 1 ? "text-cl-text2" : "text-cl-text3"}`}>{step}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="cl-card mb-3.5">
            <div className="cl-section-title mb-2.5">Job Description Input</div>
            <div className="mb-3.5">
              <label className="cl-label">Job URL (optional)</label>
              <input className="cl-input" defaultValue="https://careers.google.com/jobs/fe-2024" />
            </div>
            <div className="mb-3.5">
              <label className="cl-label">Or paste job description</label>
              <textarea className="cl-input h-[100px] resize-none" defaultValue="We are looking for a Frontend Engineer with 3+ years of React and TypeScript experience. Strong understanding of system design, REST APIs, and performance optimization required. Experience with GraphQL and testing frameworks preferred..." />
            </div>
            <div className="flex gap-2">
              <button className="cl-btn cl-btn-primary flex-1 justify-center">Analyze with AI</button>
              <button className="cl-btn cl-btn-outline">Clear</button>
            </div>
          </div>
          <div className="cl-card">
            <div className="cl-section-title mb-2.5">Role Classification</div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Role Type", value: "Frontend Engineer", bg: "bg-[hsl(var(--cl-accent2)/0.15)]", border: "border-[hsl(var(--cl-accent)/0.2)]", color: "text-cl-accent" },
                { label: "Seniority", value: "Mid-Level (3-5 yrs)", bg: "bg-cl-blue-lt", border: "border-[hsl(var(--cl-blue)/0.2)]", color: "text-cl-blue" },
                { label: "Company", value: "Google", bg: "bg-cl-amber-lt", border: "border-[hsl(var(--cl-amber)/0.2)]", color: "text-cl-amber" },
              ].map((item) => (
                <div key={item.label} className={`px-3 py-1.5 rounded-lg ${item.bg} border ${item.border}`}>
                  <div className="text-[10px] text-cl-text3">{item.label}</div>
                  <div className={`text-[12.5px] font-semibold ${item.color}`}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="cl-card mb-3.5">
            <div className="flex items-center justify-between mb-3">
              <div className="cl-section-title">Extracted Skills</div>
              <span className="cl-tag cl-tag-green text-[10px]">AI Parsed</span>
            </div>
            {[
              { title: "Required", tags: skills.required, cls: "cl-tag-green" },
              { title: "Preferred", tags: skills.preferred, cls: "cl-tag-blue" },
              { title: "Tech Stack", tags: skills.stack, cls: "cl-tag-gray" },
            ].map((section) => (
              <div key={section.title} className="mb-2.5">
                <div className="text-[11px] font-semibold text-cl-text2 uppercase tracking-wider mb-1.5">{section.title}</div>
                <div className="flex flex-wrap gap-1.5 p-3.5 bg-cl-surface2 rounded-xl">
                  {section.tags.map((tag) => (
                    <span key={tag} className={`cl-tag ${section.cls}`}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="cl-card">
            <div className="cl-section-title mb-3">Skill Gap Analysis</div>
            {gaps.map((gap) => (
              <div key={gap.name} className="mb-2.5">
                <div className="flex justify-between mb-0.5 text-[11.5px]">
                  <span>{gap.name}</span>
                  <span className={`font-semibold ${gap.textColor}`}>{gap.level}</span>
                </div>
                <div className="cl-progress-bar"><div className={`cl-progress-fill ${gap.color}`} style={{ width: `${gap.pct}%` }} /></div>
              </div>
            ))}
            <button className="cl-btn cl-btn-primary w-full justify-center mt-3">Generate Learning Path →</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default JobParser;
