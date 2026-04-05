import AppShell from "@/components/layout/AppShell";

const CodeChallenge = () => {
  return (
    <div className="grid grid-cols-[200px_1fr] min-h-screen">
      {/* Mini sidebar */}
      <div className="bg-cl-sidebar flex flex-col py-5">
        <div className="px-5 pb-5 flex items-center gap-2">
          <div className="w-7 h-7 bg-cl-accent2 rounded-lg flex items-center justify-center text-sm font-bold text-primary-foreground">C</div>
          <span className="font-display text-[15px] font-bold text-primary-foreground">CareerLaunch</span>
        </div>
        <div className="px-3">
          <a href="/dashboard" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-cl-sidebar-text text-[12.5px] hover:bg-[rgba(255,255,255,0.1)] hover:text-primary-foreground transition-all no-underline">Dashboard</a>
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-cl-accent text-primary-foreground text-[12.5px]">Assessments</div>
        </div>
      </div>

      <div className="bg-background flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold">Two Sum</h1>
            <div className="text-[11px] text-cl-text3">Coding Challenge · Medium · Arrays & Hashing</div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[12px] font-semibold text-cl-amber">⏱ 28:12</span>
            <select className="cl-input w-auto py-1.5 px-2.5 text-[11.5px]">
              <option>Python 3</option>
              <option>JavaScript</option>
              <option>Java</option>
            </select>
            <button className="cl-btn cl-btn-primary cl-btn-sm">▶ Run</button>
            <button className="cl-btn cl-btn-outline cl-btn-sm">Submit</button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-2 flex-1 overflow-hidden">
          {/* Problem */}
          <div className="p-4 overflow-y-auto border-r border-border">
            <div className="text-[13px] font-semibold mb-2.5">Problem Description</div>
            <div className="text-[12.5px] leading-relaxed text-cl-text2 mb-3">
              Given an array of integers <code className="bg-cl-surface2 px-1 py-0.5 rounded">nums</code> and an integer <code className="bg-cl-surface2 px-1 py-0.5 rounded">target</code>, return indices of the two numbers such that they add up to target.
            </div>
            {[
              { title: "Example 1:", lines: ["Input: nums = [2,7,11,15], target = 9", "Output: [0,1]", "Explanation: nums[0] + nums[1] == 9"] },
              { title: "Example 2:", lines: ["Input: nums = [3,2,4], target = 6", "Output: [1,2]"] },
            ].map((ex) => (
              <div key={ex.title} className="bg-cl-surface2 rounded-lg p-3 text-[11.5px] mb-3">
                <div className="font-semibold mb-1.5">{ex.title}</div>
                <div className="font-mono leading-relaxed">
                  {ex.lines.map((l, i) => <div key={i}><span className="text-cl-text3">{l.split(":")[0]}:</span>{l.split(":").slice(1).join(":")}</div>)}
                </div>
              </div>
            ))}
            <div className="text-[12px] font-semibold mb-2">Test Cases</div>
            {[
              { label: "Case 1", status: "Passed", statusCls: "cl-tag-green", code: "[2,7,11,15], target=9 → [0,1]" },
              { label: "Case 2", status: "Passed", statusCls: "cl-tag-green", code: "[3,2,4], target=6 → [1,2]" },
              { label: "Case 3", status: "Running", statusCls: "cl-tag-amber", code: "[3,3], target=6 → [0,1]" },
            ].map((tc) => (
              <div key={tc.label} className="bg-cl-surface2 rounded-lg p-2.5 text-[11px] mb-1.5">
                <div className="flex justify-between"><span className="text-cl-text3">{tc.label}</span><span className={`cl-tag ${tc.statusCls} text-[9.5px]`}>{tc.status}</span></div>
                <code>{tc.code}</code>
              </div>
            ))}
          </div>

          {/* Code Editor */}
          <div className="flex flex-col">
            <div className="bg-[#0D1117] flex-1 flex flex-col">
              <div className="bg-[#1C1C1E] px-3.5 py-2 flex items-center justify-between border-b border-[#2A2A2E]">
                <div className="flex gap-1.5">
                  <span className="text-[11px] text-[#E6E6E6] bg-[#2A2A2E] px-2 py-0.5 rounded">solution.py</span>
                  <span className="text-[11px] text-[#8B8B96] px-2 py-0.5 rounded cursor-pointer">tests.py</span>
                </div>
                <span className="text-[10.5px] text-[#6B8B96]">Judge0 Sandbox</span>
              </div>
              <div className="p-3.5 text-[11.5px] leading-relaxed text-[#E6E6E6] font-mono flex-1">
                <div><span className="text-[#4A4A55] mr-4 select-none">1</span><span className="text-[#FF7AB2]">class</span> <span className="text-[#67CDFE]">Solution</span>:</div>
                <div><span className="text-[#4A4A55] mr-4 select-none">2</span>    <span className="text-[#FF7AB2]">def</span> <span className="text-[#67CDFE]">twoSum</span>(<span className="text-[#6BDB8E]">self</span>, nums: <span className="text-[#6BDB8E]">List[int]</span>, target: <span className="text-[#6BDB8E]">int</span>) -&gt; <span className="text-[#6BDB8E]">List[int]</span>:</div>
                <div><span className="text-[#4A4A55] mr-4 select-none">3</span>        <span className="text-[#636366]"># Use a hash map for O(n) time complexity</span></div>
                <div><span className="text-[#4A4A55] mr-4 select-none">4</span>        seen = {"{}"}</div>
                <div><span className="text-[#4A4A55] mr-4 select-none">5</span>        <span className="text-[#FF7AB2]">for</span> i, num <span className="text-[#FF7AB2]">in</span> <span className="text-[#67CDFE]">enumerate</span>(nums):</div>
                <div><span className="text-[#4A4A55] mr-4 select-none">6</span>            complement = target - num</div>
                <div><span className="text-[#4A4A55] mr-4 select-none">7</span>            <span className="text-[#FF7AB2]">if</span> complement <span className="text-[#FF7AB2]">in</span> seen:</div>
                <div><span className="text-[#4A4A55] mr-4 select-none">8</span>                <span className="text-[#FF7AB2]">return</span> [seen[complement], i]</div>
                <div><span className="text-[#4A4A55] mr-4 select-none">9</span>            seen[num] = i</div>
                <div><span className="text-[#4A4A55] mr-4 select-none">10</span>        <span className="text-[#FF7AB2]">return</span> []</div>
              </div>
            </div>
            <div className="bg-[#161B22] p-3 border-t border-[#2A2A2E] min-h-[100px]">
              <div className="text-[10.5px] text-[#6B8B96] mb-2 font-mono">CONSOLE OUTPUT</div>
              <div className="font-mono text-[11.5px] text-[#4ADE80]">✓ Test Case 1 passed (0.03ms)</div>
              <div className="font-mono text-[11.5px] text-[#4ADE80]">✓ Test Case 2 passed (0.02ms)</div>
              <div className="font-mono text-[11.5px] text-[#F59E0B]">⟳ Running Test Case 3...</div>
              <div className="font-mono text-[11px] text-[#6B8B96] mt-1.5">Runtime: O(n) · Space: O(n)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeChallenge;
