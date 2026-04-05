import { useState } from "react";
import AppShell from "@/components/layout/AppShell";

const options = [
  { letter: "A", text: "To memoize the result of an expensive computation" },
  { letter: "B", text: "To memoize a callback function so it doesn't change on every render" },
  { letter: "C", text: "To execute a side effect after render" },
  { letter: "D", text: "To force a component to re-render when state changes" },
];

const Assessments = () => {
  const [selected, setSelected] = useState("A");

  return (
    <AppShell
      title="Assessments"
      subtitle="React Fundamentals — Question 7 of 20"
      actions={
        <>
          <span className="text-[12px] font-semibold text-cl-amber">⏱ 12:45</span>
          <button className="cl-btn cl-btn-outline cl-btn-sm text-cl-red">End Test</button>
        </>
      }
    >
      {/* Progress */}
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[11px] text-cl-text3">Progress</span>
        <span className="text-[11px] font-medium">7 / 20</span>
      </div>
      <div className="cl-progress-bar h-2 mb-5"><div className="cl-progress-fill bg-cl-accent2" style={{ width: "35%" }} /></div>

      <div className="grid grid-cols-2 gap-4 items-start">
        {/* Question */}
        <div>
          <div className="cl-card mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-cl-accent">QUESTION 7</span>
              <span className="cl-tag cl-tag-blue">MCQ · React</span>
            </div>
            <div className="text-sm font-medium leading-relaxed mb-4">
              What is the primary purpose of the <code className="bg-cl-surface2 px-1.5 py-0.5 rounded text-xs">useCallback</code> hook in React?
            </div>
            {options.map((opt) => (
              <div
                key={opt.letter}
                onClick={() => setSelected(opt.letter)}
                className={`flex items-center gap-2.5 p-2.5 px-3.5 border rounded-lg cursor-pointer text-[12.5px] transition-all mb-2 ${
                  selected === opt.letter
                    ? "border-cl-accent bg-[hsl(var(--cl-accent2)/0.15)] text-cl-accent"
                    : "border-border hover:border-cl-accent hover:bg-[hsl(var(--cl-accent2)/0.08)]"
                }`}
              >
                <div className={`w-[22px] h-[22px] rounded-full border-[1.5px] flex items-center justify-center text-[10.5px] font-semibold flex-shrink-0 ${
                  selected === opt.letter ? "border-cl-accent" : "border-current"
                }`}>
                  {opt.letter}
                </div>
                {opt.text}
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <button className="cl-btn cl-btn-outline flex-1 justify-center">← Previous</button>
              <button className="cl-btn cl-btn-primary flex-[2] justify-center">Submit Answer →</button>
            </div>
          </div>
          <div className="cl-card bg-[hsl(var(--cl-accent2)/0.15)] border-[hsl(var(--cl-accent)/0.2)]">
            <div className="text-[11px] font-semibold text-cl-accent mb-1.5">💡 Hint</div>
            <div className="text-[12px] text-cl-text2">
              Think about how React re-renders work and what <code className="bg-[hsl(var(--cl-accent)/0.1)] px-1 py-0.5 rounded text-[11px]">useMemo</code> does differently.
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div>
          <div className="cl-card mb-3.5">
            <div className="cl-section-title mb-3">Assessment Overview</div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { val: "6", label: "Correct", color: "text-cl-accent2" },
                { val: "0", label: "Wrong", color: "text-cl-text3" },
                { val: "13", label: "Left", color: "" },
                { val: "100%", label: "Score", color: "text-cl-accent" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className={`font-display text-lg font-bold ${s.color}`}>{s.val}</div>
                  <div className="text-[10px] text-cl-text3">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {[1,2,3,4,5,6].map((n) => (
                <span key={n} className="w-[22px] h-[22px] bg-cl-accent2 rounded text-[10px] text-primary-foreground inline-flex items-center justify-center">✓</span>
              ))}
              <span className="w-[22px] h-[22px] bg-cl-accent rounded border-[1.5px] border-cl-accent text-[10px] text-primary-foreground inline-flex items-center justify-center">7</span>
              {[8,9,10].map((n) => (
                <span key={n} className="w-[22px] h-[22px] bg-cl-surface2 rounded text-[10px] text-cl-text3 inline-flex items-center justify-center">{n}</span>
              ))}
            </div>
          </div>
          <div className="cl-card">
            <div className="cl-section-title mb-2.5">Other Assessment Types</div>
            {[
              { title: "Coding Challenge", sub: "Judge0 execution", tag: "12 pending", tagCls: "cl-tag-blue" },
              { title: "Behavioral Questions", sub: "STAR method", tag: "5 pending", tagCls: "cl-tag-amber" },
              { title: "System Design", sub: "Open-ended", tag: "3 pending", tagCls: "cl-tag-gray" },
            ].map((item) => (
              <div key={item.title} className="p-2 border border-border rounded-lg mb-2 cursor-pointer flex items-center justify-between hover:bg-cl-surface2 transition-all">
                <div>
                  <div className="text-[12px] font-medium">{item.title}</div>
                  <div className="text-[10.5px] text-cl-text3">{item.sub}</div>
                </div>
                <span className={`cl-tag ${item.tagCls}`}>{item.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Assessments;
