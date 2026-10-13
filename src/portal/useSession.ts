import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

/** Current Supabase session; `loading` stays true until the stored session is read. */
export function useSession() {
  const [state, setState] = useState<{ loading: boolean; session: Session | null }>({
    loading: Boolean(supabase),
    session: null,
  });

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => active && setState({ loading: false, session: data.session }));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setState({ loading: false, session });
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return state;
}
