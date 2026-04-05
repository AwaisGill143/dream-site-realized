import AppShell from "@/components/layout/AppShell";

const LearningPath = () => {
  return (
    <AppShell
      title="Learning Path"
      subtitle="Personalized for: Frontend Engineer @ Google"
      actions={<button className="cl-btn cl-btn-outline cl-btn-sm">Filter by skill</button>}
    >
      {/* Stats row */}
      <div className="flex gap-3.5 mb-4">
        <div className="flex-1 p-3 bg-card border border-border rounded-2xl">
          <div className="text-[10px] text-cl-text3 mb-0.5">Overall Progress</div>
          <div className="flex items-center gap-2.5">
            <div className="font-display text-xl font-bold">42%</div>
            <div className="flex-1"><div className="cl-progress-bar"><div className="cl-progress-fill bg-cl-accent2" style={{ width: "42%" }} /></div></div>
          </div>
        </div>
        <div className="p-3 px-4 bg-[hsl(var(--cl-accent2)/0.15)] border border-[hsl(var(--cl-accent)/0.2)] rounded-2xl">
          <div className="text-[10px] text-cl-accent mb-0.5">Resources remaining</div>
          <div className="font-display text-xl font-bold text-cl-accent">14</div>
        </div>
        <div className="p-3 px-4 bg-card border border-border rounded-2xl">
          <div className="text-[10px] text-cl-text3 mb-0.5">Est. time left</div>
          <div className="font-display text-xl font-bold">8.5h</div>
        </div>
      </div>

      {/* Priority alert */}
      <div className="bg-cl-red-lt border border-[hsl(var(--cl-red)/0.2)] rounded-xl p-2.5 px-3.5 mb-3.5 flex items-center justify-between">
        <div>
          <div className="text-[12px] font-semibold text-cl-red">🎯 Priority Gap: GraphQL</div>
          <div className="text-[11px] text-cl-text3 mt-0.5">Required skill with 18% proficiency — start here</div>
        </div>
        <button className="cl-btn cl-btn-sm bg-cl-red text-primary-foreground border-none">Jump to</button>
      </div>

      {/* GraphQL section */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="cl-section-title">GraphQL — Priority Learning</div>
        <span className="cl-tag cl-tag-red">Gap</span>
      </div>
      {[
        { thumb: "▶", thumbBg: "bg-[#FF0000]", title: "GraphQL Full Course - Beginner to Expert", sub: "Traversy Media · YouTube · 2h 14m", pct: 0, status: "Not started", btn: "Watch", btnCls: "cl-btn-primary" },
        { thumb: "Udemy", thumbBg: "bg-[#4285F4]", title: "The Modern GraphQL Bootcamp", sub: "Udemy · 13.5 hours · Highly rated", pct: 0, status: "", btn: "Open course", btnCls: "cl-btn-outline" },
      ].map((r) => (
        <div key={r.title} className="flex gap-3 p-3 border border-border rounded-xl mb-2 items-start">
          <div className="w-20 h-[52px] rounded-md flex-shrink-0 overflow-hidden">
            <div className={`${r.thumbBg} text-primary-foreground text-xs font-bold w-full h-full flex items-center justify-center rounded-md`}>{r.thumb}</div>
          </div>
          <div className="flex-1">
            <div className="text-[12.5px] font-medium mb-0.5">{r.title}</div>
            <div className="text-[11px] text-cl-text3 mb-1.5">{r.sub}</div>
            <div className="flex items-center gap-2">
              <div className="cl-progress-bar flex-1"><div className="cl-progress-fill bg-cl-accent2" style={{ width: `${r.pct}%` }} /></div>
              {r.status && <span className="text-[10.5px] text-cl-text3">{r.status}</span>}
              <button className={`cl-btn ${r.btnCls} cl-btn-sm`}>{r.btn}</button>
            </div>
          </div>
        </div>
      ))}

      {/* System Design section */}
      <div className="flex items-center justify-between mb-3.5 mt-4">
        <div className="cl-section-title">System Design — Needs Work</div>
        <span className="cl-tag cl-tag-amber">Fair</span>
      </div>
      <div className="flex gap-3 p-3 border border-border rounded-xl mb-2 items-start">
        <div className="w-20 h-[52px] rounded-md flex-shrink-0 overflow-hidden">
          <div className="bg-[#FF0000] text-primary-foreground text-lg w-full h-full flex items-center justify-center rounded-md">▶</div>
        </div>
        <div className="flex-1">
          <div className="text-[12.5px] font-medium mb-0.5">System Design Interview – An Insider's Guide</div>
          <div className="text-[11px] text-cl-text3 mb-1.5">System Design with Alex Xu · YouTube · 4h 30m</div>
          <div className="flex items-center gap-2">
            <div className="cl-progress-bar flex-1"><div className="cl-progress-fill bg-cl-accent2" style={{ width: "65%" }} /></div>
            <span className="text-[10.5px] text-cl-text2 font-medium">65%</span>
            <button className="cl-btn cl-btn-outline cl-btn-sm">Continue</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default LearningPath;
