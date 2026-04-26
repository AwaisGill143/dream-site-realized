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
  const [isListening, setIsListening] = useState(false);
  const [useVoiceMode, setUseVoiceMode] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const syntaxRef = useRef<any>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const SpeechSynthesis = (window as any).speechSynthesis;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        if (event.isFinal) {
          setInput(transcript.trim());
        } else {
          setInput(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        toast({
          title: "Microphone Error",
          description: `Error: ${event.error}`,
          variant: "destructive",
        });
      };
    }

    if (SpeechSynthesis) {
      syntaxRef.current = SpeechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (syntaxRef.current) {
        syntaxRef.current.cancel();
      }
    };
  }, [toast]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speak text using Web Speech API
  const speakText = (text: string) => {
    if (!syntaxRef.current) return;

    syntaxRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    syntaxRef.current.speak(utterance);
  };

  const toggleVoiceListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Browser Error",
        description: "Speech recognition not supported in this browser",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const getDuration = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const response = await apiClient.startInterview();
      setInterviewId(response.data.id);
      const initialMessage = response.data.conversation_history?.[0]?.content || 
        "Hello! Welcome to your mock interview. I'm your AI interviewer. Tell me about yourself and your experience.";
      
      setMessages(response.data.conversation_history || [
        {
          role: "assistant",
          content: initialMessage,
        },
      ]);
      
      setIsInterviewActive(true);
      
      // Speak the initial greeting
      if (useVoiceMode) {
        speakText(initialMessage);
      }
      
      toast({
        title: "Interview Started",
        description: useVoiceMode ? "Click the microphone button to start answering" : "Good luck! Answer naturally.",
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
    setIsListening(false);

    // Add user message to UI
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    setLoading(true);
    try {
      const response = await apiClient.submitInterviewResponse(interviewId, userMessage);
      const aiResponse = response.data.ai_response || "Thank you for your response. Next question:";

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiResponse,
        },
      ]);

      // Speak the AI response
      if (useVoiceMode) {
        speakText(aiResponse);
      }
    } catch (error: any) {
      console.error("Interview response error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to process response",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEndInterview = async () => {
    if (!interviewId) return;

    try {
      if (syntaxRef.current) {
        syntaxRef.current.cancel();
      }
      
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

  return (
    <AppShell
      title="Interview Simulator"
      subtitle={isInterviewActive ? "Mock Interview - AI Powered" : "Start your practice interview"}
      actions={
        isInterviewActive && (
          <>
            <button
              onClick={() => setUseVoiceMode(!useVoiceMode)}
              className={`cl-btn ${useVoiceMode ? 'cl-btn-primary' : 'cl-btn-outline'} cl-btn-sm`}
            >
              {useVoiceMode ? "🎙️ Voice Mode" : "⌨️ Text Mode"}
            </button>
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
              Our AI interviewer will conduct a realistic mock interview experience. Practice with live voice or text mode.
            </p>
            <div className="flex gap-3 justify-center mb-6">
              <button onClick={handleStartInterview} disabled={loading} className="cl-btn cl-btn-primary justify-center disabled:opacity-50">
                {loading ? "Starting..." : "🎙️ Start with Voice"}
              </button>
              <button 
                onClick={() => { setUseVoiceMode(false); handleStartInterview(); }} 
                disabled={loading} 
                className="cl-btn cl-btn-outline justify-center disabled:opacity-50"
              >
                {loading ? "Starting..." : "⌨️ Start with Text"}
              </button>
            </div>
            <div className="mt-6 p-4 bg-cl-surface2 rounded-lg text-[12px]">
              <div className="font-semibold mb-2">📋 What to Expect:</div>
              <ul className="text-left space-y-1">
                <li>• 5-7 technical and behavioral questions</li>
                <li>• Real-time conversation with AI interviewer</li>
                <li>• Live voice or text interaction</li>
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
              {useVoiceMode ? (
                <div className="space-y-3">
                  <div className="text-[11px] text-cl-text3 text-center">
                    {isListening ? "🎤 Listening..." : isSpeaking ? "🔊 Speaking..." : "Ready to listen"}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Your voice will appear here..."
                      className="cl-input flex-1"
                      disabled={loading || isListening}
                    />
                    <button
                      onClick={toggleVoiceListening}
                      disabled={loading || isSpeaking}
                      className={`cl-btn ${isListening ? 'bg-cl-red text-white' : 'cl-btn-primary'}`}
                    >
                      {isListening ? "⏹️ Stop" : "🎤 Listen"}
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={loading || !input.trim() || isListening}
                      className="cl-btn cl-btn-primary"
                    >
                      Send
                    </button>
                  </div>
                </div>
              ) : (
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
              )}
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
                  <span className="text-cl-text3">Duration:</span>
                  <span className="ml-2 font-semibold">{getDuration()}</span>
                </div>
                <div>
                  <span className="text-cl-text3">Mode:</span>
                  <span className="ml-2 font-semibold">{useVoiceMode ? "🎙️ Voice" : "⌨️ Text"}</span>
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
                <li>• {useVoiceMode ? "Speak clearly" : "Type carefully"}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default InterviewSim;
