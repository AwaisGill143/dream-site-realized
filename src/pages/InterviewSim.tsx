const InterviewSim = () => {
  return (
    <div className="min-h-screen grid grid-cols-[1fr_380px]">
      {/* Video area */}
      <div className="bg-[#0D1117] flex flex-col relative">
        <div className="px-4 py-3.5 bg-[#161B22] border-b border-[#2A2A2E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#4ADE80]" />
            <span className="text-[#E6E6E6] text-[12.5px] font-medium">Frontend Engineer @ Google — Mock Interview</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[#F59E0B] text-[12px]">● REC 14:32</span>
            <button className="px-2.5 py-1 bg-transparent border border-[#3A3A3E] rounded-md text-[#9B9BA8] text-[11px] cursor-pointer">End Session</button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-3 p-4">
          <div className="bg-[#161B22] rounded-xl flex flex-col items-center justify-center p-5 border border-[#2A2A2E]">
            <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-cl-accent to-cl-accent2 flex items-center justify-center text-[28px] border-[3px] border-[rgba(74,157,114,0.4)] mb-2.5">🤖</div>
            <div className="text-[11px] text-cl-sidebar-text mb-1">AI Interviewer</div>
            <div className="flex gap-1 items-center">
              {[14, 22, 10, 18].map((h, i) => (
                <div key={i} className="w-1 rounded-sm bg-cl-accent2" style={{ height: `${h}px` }} />
              ))}
              <span className="text-cl-accent2 text-[10px] ml-1.5">Speaking</span>
            </div>
          </div>
          <div className="bg-[#161B22] rounded-xl flex flex-col items-center justify-center p-5 border border-[#2A2A2E]">
            <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-cl-blue to-[#378ADD] flex items-center justify-center text-[28px] text-primary-foreground font-display font-bold border-[3px] border-[rgba(55,138,221,0.3)] mb-2.5">AN</div>
            <div className="text-[11px] text-[#6B8B96] mb-1">Ayesha Noor</div>
            <div className="text-[10px] text-[#4A4A55]">● Muted</div>
          </div>
        </div>

        <div className="px-4 py-3 bg-[#161B22] border-t border-[#2A2A2E] flex items-center justify-center gap-3">
          <button className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] border-none cursor-pointer text-primary-foreground text-base">🎤</button>
          <button className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] border-none cursor-pointer text-primary-foreground text-base">📷</button>
          <button className="w-10 h-10 rounded-full bg-cl-red border-none cursor-pointer text-primary-foreground text-base">✕</button>
        </div>
      </div>

      {/* Chat panel */}
      <div className="flex flex-col border-l border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <div className="text-[12.5px] font-semibold">Interview Chat</div>
          <div className="text-[10.5px] text-cl-text3">WebSocket • Connected</div>
        </div>
        <div className="flex-1 p-3.5 overflow-y-auto flex flex-col gap-2.5 min-h-[320px]">
          <div className="max-w-[85%] p-2.5 rounded-[4px_12px_12px_12px] bg-cl-surface2 text-[12px] leading-relaxed">
            Hi Ayesha! I'm your AI interviewer today. Let's start with a warm-up. Can you briefly introduce yourself and your experience with React?
          </div>
          <div className="max-w-[85%] p-2.5 rounded-[12px_4px_12px_12px] bg-cl-accent text-primary-foreground text-[12px] leading-relaxed self-end">
            Sure! I've been working with React for about 3 years. I started with class components and transitioned to hooks. I've built several production applications at my current company...
          </div>
          <div className="max-w-[85%] p-2.5 rounded-[4px_12px_12px_12px] bg-cl-surface2 text-[12px] leading-relaxed">
            Great background! You mentioned hooks — can you explain the difference between <code className="bg-[rgba(0,0,0,0.1)] px-1 rounded text-[11px]">useEffect</code> and <code className="bg-[rgba(0,0,0,0.1)] px-1 rounded text-[11px]">useLayoutEffect</code>, and when you'd choose one over the other?
          </div>
          <div className="max-w-[85%] p-2.5 rounded-[4px_12px_12px_12px] bg-cl-surface2 text-[12px]">
            <div className="flex gap-1 items-center">
              {[1, 0.7, 0.4].map((o, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-cl-accent2" style={{ opacity: o }} />
              ))}
              <span className="text-[10.5px] text-cl-text3 ml-1">AI is thinking...</span>
            </div>
          </div>
        </div>
        <div className="p-2.5 border-t border-border">
          <div className="flex gap-1.5 mb-2 flex-wrap">
            <button className="cl-btn cl-btn-outline cl-btn-sm text-[10.5px]">I need a moment</button>
            <button className="cl-btn cl-btn-outline cl-btn-sm text-[10.5px]">Can you rephrase?</button>
          </div>
          <div className="flex gap-1.5">
            <input className="cl-input text-[11.5px]" placeholder="Type your answer or use mic..." />
            <button className="cl-btn cl-btn-primary cl-btn-sm">Send</button>
          </div>
        </div>
        <div className="p-2.5 border-t border-border bg-cl-surface2">
          <div className="text-[10.5px] text-cl-text3 mb-1.5">Live Feedback</div>
          <div className="flex gap-2">
            {[
              { label: "Confidence", pct: 72, color: "bg-cl-accent2" },
              { label: "Clarity", pct: 85, color: "bg-cl-accent2" },
              { label: "Depth", pct: 60, color: "bg-cl-amber" },
            ].map((f) => (
              <div key={f.label} className="flex-1">
                <div className="text-[10px] text-cl-text3 mb-0.5">{f.label}</div>
                <div className="cl-progress-bar"><div className={`cl-progress-fill ${f.color}`} style={{ width: `${f.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSim;
