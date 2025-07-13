"use client";
import InterviewSimulator from "./components/InterviewSimulator";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingScreen from "@/components/LoadingScreen";

export default function InterviewAIPage() {
  const checking = useRequireAuth();
  if (checking) {
    return (
      <LoadingScreen />
    );
  }
  return (
    <div>
      <InterviewSimulator />
    </div>
  );
}