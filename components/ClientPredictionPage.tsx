"use client";

import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import PredictionForm from "./PredictionForm";
import StatisticsView from "./StatisticsView";
import { supabase } from "@/lib/supabase";

export default function ClientPredictionPage() {
  const [sessionUser, setSessionUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPredicted, setHasPredicted] = useState(false);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setSessionUser({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || "Invitado",
        });
        await checkExistingPrediction(session.user.id);
      }
      setLoading(false);
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setSessionUser({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || "Invitado",
        });
        await checkExistingPrediction(session.user.id);
      } else {
        setSessionUser(null);
        setHasPredicted(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkExistingPrediction = async (userId: string) => {
    const { data } = await supabase
      .from("predicciones")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
      
    if (data) {
      setHasPredicted(true);
    }
  };

  const handleLoginSuccess = async (userId: string, email: string, name: string) => {
    setSessionUser({ id: userId, email, name });
    await checkExistingPrediction(userId);
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5B39A]"></div>
      </div>
    );
  }

  return (
    <>
      {!sessionUser ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : hasPredicted ? (
        <StatisticsView />
      ) : (
        <PredictionForm
          userId={sessionUser.id}
          userName={sessionUser.name}
          userEmail={sessionUser.email}
          onPredictionComplete={() => setHasPredicted(true)}
        />
      )}
    </>
  );
}
