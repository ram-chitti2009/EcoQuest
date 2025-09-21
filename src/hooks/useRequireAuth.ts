import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

/**
 * Redirects to /login if no session is found. Returns true while checking, false when done.
 * Use with the global <LoadingScreen /> for seamless loading UX.
 */
export function useRequireAuth() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
      } else {
        setChecking(false);
      }
    };
    checkSession();
  }, [router]);

  return checking;
}
