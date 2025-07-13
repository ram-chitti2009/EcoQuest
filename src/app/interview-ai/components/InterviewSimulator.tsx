"use client";
import React, { useState, useRef } from "react";

type InterviewMode = "audio" | "video" | "text";
type InputType = "live" | "upload";

const MODE_LABELS: Record<InterviewMode, string> = {
  audio: "Audio",
  video: "Video",
  text: "Text",
};

const BACKEND_ENDPOINTS: Record<InterviewMode, string> = {
  audio: "http://localhost:8000/analyze-audio/",
  video: "http://localhost:8000/analyze-audio-video/",
  text: "http://localhost:8000/analyze-text/",
};

const InterviewSimulator: React.FC = () => {
  // Setup state
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [setupComplete, setSetupComplete] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(false);

  // Interview state
  const [mode, setMode] = useState<InterviewMode>("audio");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [history, setHistory] = useState<{ q: string; a: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  // Store full backend response for audio/video
  const [mediaResult, setMediaResult] = useState<any>(null);

  // Recording state
  const [recording, setRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Track if a valid recording is available
  const [hasRecorded, setHasRecorded] = useState(false);

  // For live transcription (audio/video)
  const recognitionRef = useRef<any>(null);

  // Reset everything for a new interview
  function resetInterview() {
    setHistory([]);
    setAnswer("");
    setFeedback("");
    setError("");
    setRecording(false);
    setMediaStream(null);
    setInterviewEnded(false);
    setHasRecorded(false);
    recordedChunks.current = [];
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }

  // Welcome step: fetch first question after "Start Interview"
  async function startInterview() {
    resetInterview();
    setWelcomeStep(true);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/select-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: description,
          jobTitle: role,
          companyName: company,
          history: [],
        }),
      });
      const data = await res.json();
      setQuestion(data.question || "Welcome! Let's begin your interview.");
    } catch {
      setQuestion("Welcome! Let's begin your interview.");
    } finally {
      setLoading(false);
    }
  }

  // Fetch next question (after each answer)
  async function fetchNextQuestion(newHistory: { q: string; a: string }[]) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/select-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: description,
          jobTitle: role,
          companyName: company,
          history: newHistory,
        }),
      });
      const data = await res.json();
      setQuestion(data.question || "");
    } catch {
      setError("Failed to fetch next question.");
    } finally {
      setLoading(false);
    }
  }

  // --- Live Recording and Transcription ---
  function startTranscription() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setError('Browser does not support real-time transcription.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript;
          setAnswer(transcript);
        }
      }
    };
    recognition.onerror = () => {};
    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopTranscription() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }

  async function startRecording() {
    setError("");
    try {
      let stream: MediaStream;
      if (mode === "audio") {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      }
      setMediaStream(stream);
      recordedChunks.current = [];
      setHasRecorded(false);
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.current.push(e.data);
      };
      recorder.onstop = () => {
        if (recordedChunks.current.length > 0) {
          setHasRecorded(true);
        }
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      if (mode === "audio" || mode === "video") {
        startTranscription();
      }
    } catch (e) {
      setError("Could not start recording. Please check your device permissions.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    }
    stopTranscription();
    // setHasRecorded will be set in onstop
  }

  // --- Handle answer submission and next question ---
  async function handleNextQuestion() {
    setLoading(true);
    setError("");
    let newHistory = [...history];
    if (question && answer) {
      newHistory.push({ q: question, a: answer });
      setHistory(newHistory);
    }
    setAnswer("");
    if (mode === "text") {
      await fetchNextQuestion(newHistory);
    } else {
      if (mediaRecorderRef.current && recording) {
        await new Promise((resolve) => {
          mediaRecorderRef.current!.onstop = resolve;
          mediaRecorderRef.current!.stop();
        });
        setRecording(false);
      }
      recordedChunks.current = [];
      await fetchNextQuestion(newHistory);
    }
    setLoading(false);
  }

  // --- File upload removed: all audio/video is LIVE only ---

  // --- End Interview ---
  async function handleEndInterview() {
    setInterviewEnded(true);
    setLoading(true);
    setError("");
    let endpoint = BACKEND_ENDPOINTS[mode];
    let feedbackResp = null;
    try {
      if (mode === "text") {
        const formData = new FormData();
        formData.append("text", answer);
        formData.append("history", JSON.stringify(history));
        feedbackResp = await fetch(endpoint, { method: "POST", body: formData });
      } else {
        const file = new Blob(recordedChunks.current, { type: mode === "audio" ? "audio/webm" : "video/webm" });
        const formData = new FormData();
        formData.append("file", file);
        formData.append("history", JSON.stringify(history));
        feedbackResp = await fetch(endpoint, { method: "POST", body: formData });
      }
      const feedbackData = await feedbackResp?.json();
      setFeedback(feedbackData?.ai_feedback || feedbackData?.feedback || feedbackData?.result || "No feedback received.");
      if (mode === "audio" || mode === "video") {
        setMediaResult(feedbackData);
      } else {
        setMediaResult(null);
      }
      setRecording(false);
      setMediaStream(null);
    } catch {
      setError("Failed to analyze answer or fetch feedback.");
    } finally {
      setLoading(false);
      console.log("Interview ended. Feedback:", feedback);
    }
  }

  // --- UI ---
  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Interview Simulator</h2>

      {/* Setup form */}
      {!setupComplete && (
        <form
          className="mb-6 p-4 bg-gray-50 rounded shadow"
          onSubmit={e => {
            e.preventDefault();
            setSetupComplete(true);
          }}
        >
          <div className="mb-3">
            <label className="block font-semibold mb-1">Role / Job Title</label>
            <input
              className="w-full border rounded p-2"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
              placeholder="e.g. Software Engineer"
            />
          </div>
          <div className="mb-3">
            <label className="block font-semibold mb-1">Company</label>
            <input
              className="w-full border rounded p-2"
              value={company}
              onChange={e => setCompany(e.target.value)}
              required
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div className="mb-3">
            <label className="block font-semibold mb-1">Job Description</label>
            <textarea
              className="w-full border rounded p-2"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Paste the job description here..."
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            disabled={!role || !company || !description}
          >
            Continue
          </button>
        </form>
      )}

      {/* Welcome step after setup, before interview starts */}
      {setupComplete && !welcomeStep && (
        <div className="mb-6 p-4 bg-gray-50 rounded shadow flex flex-col items-center">
          <div className="text-lg font-semibold mb-4">Welcome to your interview simulation!</div>
          <div className="mb-4 text-gray-700">You will be asked a series of questions for the role of <b>{role}</b> at <b>{company}</b>.<br/>Click Start when you are ready.</div>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded"
            onClick={startInterview}
          >
            Start Interview
          </button>
        </div>
      )}

      {/* Interview UI */}
      {setupComplete && welcomeStep && !interviewEnded && (
        <>
          {/* Tabs for mode selection */}
          <div className="flex mb-4">
            {(["audio", "video", "text"] as InterviewMode[]).map((m) => (
              <button
                key={m}
                className={`px-4 py-2 mr-2 rounded ${mode === m ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                onClick={() => { setMode(m); resetInterview(); setWelcomeStep(true); }}
                disabled={loading || recording}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>



          {error && <div className="text-red-600 mb-2">{error}</div>}
          <div className="mb-4">
            <div className="font-semibold">Question:</div>
            <div className="mb-2">{question || <span className="text-gray-400">No question loaded.</span>}</div>
          </div>

          {/* Answer input */}
          {mode === "text" && (
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={loading}
              placeholder="Type your answer here..."
            />
          )}

          {(mode === "audio" || mode === "video") && (
            <div className="mb-2">
              {mode === "video" && mediaStream && (
                <video
                  className="w-full mb-2"
                  ref={(el) => {
                    if (el && mediaStream) el.srcObject = mediaStream;
                  }}
                  autoPlay
                  muted
                />
              )}
              <div className="flex gap-2">
                {!recording ? (
                  <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={startRecording} disabled={loading}>
                    Start Recording
                  </button>
                ) : (
                  <button className="bg-yellow-600 text-white px-4 py-2 rounded" onClick={stopRecording} disabled={loading}>
                    Stop Recording
                  </button>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">Recording will be transcribed automatically.</div>
            </div>
          )}



          <div className="flex gap-2 mt-4">
            <button
              className="bg-blue-600 text-black px-4 py-2 rounded border border-blue-700"
              onClick={async () => {
                if ((mode === "audio" || mode === "video") && recording) {
                  setError("Please stop recording before proceeding.");
                  return;
                }
                if ((mode === "audio" || mode === "video") && !hasRecorded) {
                  setError("Please record your answer before proceeding.");
                  return;
                }
                await handleNextQuestion();
              }}
              disabled={
                loading ||
                (mode === "text" && !answer) ||
                (mode !== "text" && (recording || !hasRecorded))
              }
            >
              Next Question
            </button>
            <button
              className="bg-blue-600 text-black px-4 py-2 rounded border border-blue-700"
              onClick={async () => {
                if ((mode === "audio" || mode === "video") && recording) {
                  setError("Please stop recording before ending the interview.");
                  return;
                }
                if ((mode === "audio" || mode === "video") && !hasRecorded) {
                  setError("Please record your answer before ending the interview.");
                  return;
                }
                await handleEndInterview();
              }}
              disabled={
                loading ||
                (mode !== "text" && (recording || !hasRecorded))
              }
            >
              End Interview & Get Feedback
            </button>
            <button
              className="bg-blue-600 text-black px-4 py-2 rounded border border-blue-700"
              onClick={resetInterview}
              disabled={loading}
            >
              Reset
            </button>
          </div>
          {loading && <div className="mt-2 text-blue-600">Loading...</div>}
        </>
      )}

      {/* Feedback after interview ends */}
      {interviewEnded && feedback && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-black">
          <b>Feedback:</b> {feedback}
          {mediaResult && (
            <div className="mt-4 space-y-2">
              {mediaResult.message !== undefined && (
                <div><b>Message:</b> <span className="whitespace-pre-line">{String(mediaResult.message)}</span></div>
              )}
              {mediaResult.transcript !== undefined && (
                <div><b>Transcript:</b> <pre className="bg-gray-200 rounded p-2 text-xs overflow-x-auto max-h-64">{JSON.stringify(mediaResult.transcript, null, 2)}</pre></div>
              )}
              {mediaResult.ai_feedback !== undefined && (
                <div><b>AI Feedback:</b> <pre className="bg-gray-200 rounded p-2 text-xs overflow-x-auto max-h-64">{JSON.stringify(mediaResult.ai_feedback, null, 2)}</pre></div>
              )}
              {mediaResult.video_analysis !== undefined && (
                <div><b>Video Analysis:</b> <pre className="bg-gray-200 rounded p-2 text-xs overflow-x-auto max-h-64">{JSON.stringify(mediaResult.video_analysis, null, 2)}</pre></div>
              )}
              {mediaResult.summary !== undefined && (
                <div><b>Summary:</b> <pre className="bg-gray-200 rounded p-2 text-xs overflow-x-auto max-h-64">{JSON.stringify(mediaResult.summary, null, 2)}</pre></div>
              )}
              {mediaResult.deepgram_raw !== undefined && (
                <div><b>Deepgram Raw:</b> <pre className="bg-gray-200 rounded p-2 text-xs overflow-x-auto max-h-64">{JSON.stringify(mediaResult.deepgram_raw, null, 2)}</pre></div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewSimulator;
