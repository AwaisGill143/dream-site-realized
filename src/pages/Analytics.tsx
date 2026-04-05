import AppShell from "@/components/layout/AppShell";

const stats = [
  { val: "73%", label: "Readiness Score", delta: "↑ 8% this week", highlight: true },
  { val: "84%", label: "MCQ Avg.", delta: "↑ 12%" },
  { val: "12", label: "Interviews Done", delta: "4h 30m total" },
  { val: "7/9", label: "Coding Passed", delta: "78% pass rate" },
];

const skills = [
  { name: "React / TypeScript", pct: 88, color: "bg-cl-accent2", textColor: "text-cl-accent2" },
  { name: "Algorithms & DSA", pct: 81, color: "bg-cl-accent2", textColor: "text-cl-accent2" },
  { name: "System Design", pct: 64, color: "bg-cl-amber", textColor: "text-cl-amber" },
  { name: "Behavioral", pct: 72, color: "bg-cl-amber", textColor: "text-cl-amber" },
  { name: "GraphQL", pct: 18, color: "bg-cl-red", textColor: "text-cl-red" },
];

const Analytics = () => {
  return (
    <AppShell
      title="Analytics"
      subtitle="Frontend Engineer @ Google · 3 weeks of data"
      actions={
        <select className="cl-input w-auto py-1.5 px-2.5 text-[11.5px]">
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>All time</option>
        </select>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {stats.map((s) => (
          <div key={s.label} className={`cl-stat-card ${s.highlight ? "border-l-[3px] border-l-cl-accent2" : ""}`}>
            <div className={`font-display text-[26px] font-bold leading-none ${s.highlight ? "text-cl-accent2" : ""}`}>{s.val}</div>
            <div className="text-[11px] text-cl-text3 mt-1">{s.label}</div>
            <span className="text-[10px] text-cl-accent2 bg-[hsl(var(--cl-accent2)/0.15)] px-1.5 py-0.5 rounded-full inline-block mt-1.5">{s.delta}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Chart */}
        <div className="cl-card">
          <div className="cl-section-title mb-3">Readiness Over Time</div>
          <svg width="100%" height="120" viewBox="0 0 320 120">
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(74,157,114,.3)" />
                <stop offset="100%" stopColor="rgba(74,157,114,0)" />
              </linearGradient>
            </defs>
            <path d="M10,90 C40,85 60,78 90,70 C120,62 140,68 170,60 C200,52 220,48 250,40 C270,35 290,32 310,28" fill="url(#lg)" stroke="none" opacity=".5" />
            <path d="M10,90 C40,85 60,78 90,70 C120,62 140,68 170,60 C200,52 220,48 250,40 C270,35 290,32 310,28" fill="none" stroke="hsl(var(--cl-accent2))" strokeWidth="2" strokeLinecap="round" />
            {[[10,90],[90,70],[170,60],[250,40]].map(([cx,cy]) => (
              <circle key={cx} cx={cx} cy={cy} r="3" fill="hsl(var(--cl-accent2))" />
            ))}
            <circle cx="310" cy="28" r="4" fill="hsl(var(--cl-accent))" stroke="white" strokeWidth="2" />
            <text x="305" y="22" textAnchor="middle" fontSize="9" fill="hsl(var(--cl-accent))" fontWeight="600" fontFamily="DM Sans">73%</text>
            <line x1="0" y1="110" x2="320" y2="110" stroke="hsl(var(--border))" strokeWidth=".5" />
            {[["10","W1"],["90","W2"],["170","W3"],["250","W4"],["305","Now"]].map(([x,l]) => (
              <text key={x} x={x} y="118" fontSize="8" fill="hsl(var(--cl-text3))" fontFamily="DM Sans">{l}</text>
            ))}
          </svg>
        </div>

        {/* Skill Breakdown */}
        <div className="cl-card">
          <div className="cl-section-title mb-1">Skill Breakdown</div>
          {skills.map((s) => (
            <div key={s.name} className="mb-2.5">
              <div className="flex justify-between mb-0.5 text-[11.5px]">
                <span>{s.name}</span>
                <span className={s.textColor}>{s.pct}%</span>
              </div>
              <div className="cl-progress-bar"><div className={`cl-progress-fill ${s.color}`} style={{ width: `${s.pct}%` }} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Interview History */}
        <div className="cl-card">
          <div className="cl-section-title mb-3">Interview Session History</div>
          <div className="flex flex-col gap-2">
            {[
              { title: "Technical Interview #3", sub: "Yesterday · 42 min", score: "78%", tag: "Good", tagCls: "cl-tag-green", scoreColor: "text-cl-accent2" },
              { title: "Behavioral Interview #2", sub: "3 days ago · 28 min", score: "65%", tag: "Needs work", tagCls: "cl-tag-amber", scoreColor: "text-cl-amber" },
              { title: "System Design #1", sub: "5 days ago · 55 min", score: "71%", tag: "Good", tagCls: "cl-tag-green", scoreColor: "text-cl-accent2" },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between p-2 px-2.5 border border-border rounded-lg">
                <div>
                  <div className="text-[12px] font-medium">{item.title}</div>
                  <div className="text-[10.5px] text-cl-text3">{item.sub}</div>
                </div>
                <div className="text-right">
                  <div className={`text-[13px] font-semibold ${item.scoreColor}`}>{item.score}</div>
                  <span className={`cl-tag ${item.tagCls} text-[9px]`}>{item.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="cl-card">
          <div className="cl-section-title mb-3">AI Recommendations</div>
          {[
            { title: "Critical: Study GraphQL", desc: "Only 18% proficiency — required skill for this role. Allocate 4+ hours this week.", color: "border-l-cl-red", bg: "bg-cl-red-lt", titleColor: "text-cl-red" },
            { title: "Improve System Design", desc: "Focus on distributed systems and scalability concepts. Practice 2-3 more sessions.", color: "border-l-cl-amber", bg: "bg-cl-amber-lt", titleColor: "text-cl-amber" },
            { title: "Great Progress on React", desc: "88% proficiency. Maintain with practice problems on advanced patterns.", color: "border-l-cl-accent2", bg: "bg-[hsl(var(--cl-accent2)/0.15)]", titleColor: "text-cl-accent" },
          ].map((r) => (
            <div key={r.title} className={`p-2.5 border-l-[3px] ${r.color} ${r.bg} rounded-r-lg mb-2.5`}>
              <div className={`text-[12px] font-medium ${r.titleColor}`}>{r.title}</div>
              <div className="text-[11px] text-cl-text2 mt-0.5">{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default Analytics;
