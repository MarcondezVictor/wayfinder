"use client";
// AuthProvider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  nationality: string | null;
  avatar_url: string | null;
}

interface UserPreferences {
  preferred_travel_style: string | null;
  preferred_destinations: string[] | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  preferences: UserPreferences | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  preferences: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetches profile + preferences. maybeSingle() returns null (instead of an error)
  // when the row doesn't exist yet — keeps the UI from breaking for new users.
  const fetchProfileAndPrefs = useCallback(async (userId: string) => {
    try {
      const [{ data: profData }, { data: prefData }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase
            .from("user_preferences")
            .select("*")
            .eq("id", userId)
            .maybeSingle(),
      ]);

      setProfile(
          profData
              ? {
                id: profData.id,
                email: profData.email,
                full_name: profData.full_name,
                nationality: profData.nationality,
                avatar_url: profData.avatar_url,
              }
              : null
      );

      setPreferences(
          prefData
              ? {
                preferred_travel_style: prefData.preferred_travel_style,
                preferred_destinations: prefData.preferred_destinations,
              }
              : null
      );
    } catch (err) {
      console.error("Error fetching user profile metadata:", err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfileAndPrefs(user.id);
    }
  }, [user, fetchProfileAndPrefs]);

  useEffect(() => {
    let mounted = true;

    // Safety net: the spinner must NEVER get stuck forever.
    // If anything takes longer than 8s, release the UI anyway.
    const safety = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 8000);

    // 1. Initial session (read from cookies/storage — runs outside the "lock")
    supabase.auth
        .getSession()
        .then(({ data: { session } }) => {
          if (!mounted) return;
          const activeUser = session?.user ?? null;
          setUser(activeUser);

          if (activeUser) {
            fetchProfileAndPrefs(activeUser.id).finally(() => {
              if (mounted) setLoading(false);
            });
          } else {
            setLoading(false);
          }
        })
        .catch(() => {
          if (mounted) setLoading(false);
        });

    // 2. Auth changes.
    //    IMPORTANT: this callback is NOT async and does NOT "await" Supabase
    //    queries in here. Doing so DEADLOCKS GoTrue's internal (auth) lock and
    //    the spinner spins forever. The query is deferred with setTimeout(0)
    //    so it runs OUTSIDE the lock's context.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      const activeUser = session?.user ?? null;
      setUser(activeUser);

      if (!activeUser) {
        setProfile(null);
        setPreferences(null);
        setLoading(false);
        return;
      }

      // Defer outside the lock — without blocking the loading state.
      setTimeout(() => {
        if (mounted) fetchProfileAndPrefs(activeUser.id);
      }, 0);
    });

    return () => {
      mounted = false;
      clearTimeout(safety);
      subscription.unsubscribe();
    };
  }, [fetchProfileAndPrefs]);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
      <AuthContext.Provider
          value={{ user, profile, preferences, loading, signOut, refreshProfile }}
      >
        {children}
      </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
