import { redirect } from "next/navigation";
import { OnboardingScreen } from "@/components/creed/onboarding-screen";
import { loadCreedState } from "@/lib/creed-backend";
import { isSupabaseTableMissingError } from "@/lib/creed-backend-errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// Onboarding is free and lives outside the (creed-app) route group. Anyone
// signed in can run it (answer questions, build with their assistant via a
// copy-paste prompt, preview).
// We pass one signal to the screen:
//   - initialStage: resume point. A composed Grant profile resumes on the preview;
//     only a claimed seed with sections resumes on the prompt step. An empty
//     profile must restart the questionnaire so it can create its seed first.
export default async function OnboardingPage() {
  let initialStage: "prompt" | "preview" | undefined;

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/home");
    }

    // loadCreedState is cache()-wrapped, so this reuses the identical call the
    // root layout already made this request. "Composed" == any section last
    // edited by an agent; "hasPersistedCreed" means the seed was claimed.
    try {
      const result = await loadCreedState(supabase, user);
      const composed = result.state.sections.some(
        (section) => section.lastEditedType === "agent"
      );
      if (composed) {
        initialStage = "preview";
      } else if (result.hasPersistedCreed && result.state.sections.length > 0) {
        initialStage = "prompt";
      }
    } catch (error) {
      if (!isSupabaseTableMissingError(error)) {
        throw error;
      }
    }
  }

  return <OnboardingScreen initialStage={initialStage} />;
}
