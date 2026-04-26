import { useState, useEffect, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const InterviewSim = () => {
  const { toast } = useToast();
  const [interviewId, setInterviewId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [startTime] = useState<Date>(new Date());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const response = await apiClient.startInterview();
      setInterviewId(response.data.id);
      setMessages(response.data.conversation_history || [
        {
          role: "assistant",
          content: "Hello! Welcome to your mock interview. I'm your AI interviewer. Tell me about yourself and your experience.",
        },
      ]);
      setIsInterviewActive(true);
      toast({
        title: "Interview Started",
        description: "Good luck! Answer naturally and think out loud.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to start interview",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !interviewId) return;

    const userMessage = input;
    setInput("");

    // Add user message to UI
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    setLoading(true);
    try {
      const response = await apiClient.submitInterviewResponse(interviewId, userMessage);

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.ai_response || "Thank you for your response. Next question:",
        },
      ]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to process response",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEndInterview = async () => {
    if (!interviewId) return;

    try {
      await apiClient.endInterview(interviewId);
      setIsInterviewActive(false);
      toast({
        title: "Interview Ended",
        description: "Your interview feedback has been saved!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to end interview",
        variant: "destructive",
      });
    }
  };

  const getDuration = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <AppShell
      title="Interview Simulator"
      subtitle={isInterviewActive ? "Mock Interview - AI Powered" : "Start your practice interview"}
      actions={
        isInterviewActive && (
          <>
            <span className="text-[12px] font-semibold text-cl-amber">⏱ {getDuration()}</span>
            <button onClick={handleEndInterview} className="cl-btn cl-btn-outline cl-btn-sm text-cl-red">
              End Interview
            </button>
          </>
        )
      }
    >
      {!isInterviewActive ? (
        <div className="max-w-2xl mx-auto">
          <div className="cl-card p-8 text-center">
            <div className="text-[32px] mb-4">🎤</div>
            <h2 className="text-[22px] font-semibold mb-2">Get Ready for Your Mock Interview</h2>
            <p className="text-cl-text3 mb-6">
              Our AI interviewer will conduct a realistic mock interview experience. Practice common interview questions and get real-time feedback.
            </p>
            <button onClick={handleStartInterview} disabled={loading} className="cl-btn cl-btn-primary justify-center disabled:opacity-50">
              {loading ? "Starting..." : "Start Interview Now"}
            </button>
            <div className="mt-6 p-4 bg-cl-surface2 rounded-lg text-[12px]">
              <div className="font-semibold mb-2">📋 What to Expect:</div>
              <ul className="text-left space-y-1">
                <li>• 5-7 technical and behavioral questions</li>
                <li>• Real-time conversation with AI interviewer</li>
                <li>• Time tracking to manage your responses</li>
                <li>• Detailed feedback after completion</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 h-[600px]">
          {/* Chat area */}
          <div className="col-span-2 cl-card flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.role === "user" ? "bg-cl-accent text-primary-foreground" : "bg-cl-surface2 text-cl-text2"
                    }`}
                  >
                    <p className="text-[13px] leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-cl-surface2 p-3 rounded-lg">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-cl-text3 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-cl-text3 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-cl-text3 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your response..."
                  className="cl-input flex-1"
                  disabled={loading}
                />
                <button onClick={handleSendMessage} disabled={loading || !input.trim()} className="cl-btn cl-btn-primary">
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="cl-card">
              <div className="cl-section-title mb-3">Interview Stats</div>
              <div className="space-y-2 text-[13px]">
                <div>
                  <span className="text-cl-text3">Messages:</span>
                  <span className="ml-2 font-semibold">{messages.length}</span>
                </div>
                <div>
                  <span className="text-cl-text3">Current Time:</span>
                  <span className="ml-2 font-semibold">{getDuration()}</span>
                </div>
              </div>
            </div>

            <div className="cl-card bg-[hsl(var(--cl-accent2)/0.15)] border-[hsl(var(--cl-accent)/0.2)]">
              <div className="text-[11px] font-semibold text-cl-accent mb-2">💡 Interview Tips</div>
              <ul className="text-[11px] space-y-1 text-cl-text2">
                <li>• Think out loud</li>
                <li>• Ask clarifying questions</li>
                <li>• Give detailed answers</li>
                <li>• Be conversational</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default InterviewSim;
