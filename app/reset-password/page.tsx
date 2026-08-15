import type { Metadata } from "next";
import { ResetPasswordScreen } from "@/components/auth/reset-password-screen";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Reset password | Grant",
  description: "Choose a new password for your Grant account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordScreen configured={isSupabaseConfigured()} />;
}
