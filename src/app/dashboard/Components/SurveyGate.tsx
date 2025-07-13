"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import SurveyDialog from "../../signup/components/SurveyDialog";
import LoadingScreen from "../../components/loading";

export default function SurveyGate({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const [showSurvey, setShowSurvey] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", user.id)
        .single();
      if (!profile || profileError) {
        setShowSurvey(true);
      }
      setLoading(false);
    };
    checkProfile();
    // eslint-disable-next-line
  }, []);

  const handleSurveySubmit = async (surveyData: any) => {
    if (!userId) return;
    const dbData = {
      id: userId,
      interests: surveyData.interests,
      goals: surveyData.goals,
      academic_level: surveyData.academicLevel,
      skills: surveyData.skills,
    };
    await supabase.from("user_profiles").upsert(dbData);
    setShowSurvey(false);
    router.push("/dashboard");
  };

  if (loading) return <LoadingScreen />;
  if (showSurvey) {
    return (
      <SurveyDialog
        open={showSurvey}
        onClose={() => setShowSurvey(false)}
        onSubmit={handleSurveySubmit}
      />
    );
  }
  return <>{children}</>;
}
