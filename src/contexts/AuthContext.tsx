import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, fullName: string, username: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// MOCK AUTH IMPLEMENTATION:
// The original Supabase backend for this starter has been deleted/paused.
// This mock implementation allows the UI to be fully testable with local state.
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for mock session on load
    const savedUser = localStorage.getItem("mock_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setSession({
        access_token: "mock_token",
        refresh_token: "mock_refresh_token",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: "bearer",
        user: parsedUser
      });
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string, username: string) => {
    // Mock sign up logic
    return new Promise<{ error: any }>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: "mock_user_id_" + Date.now(),
          app_metadata: {},
          user_metadata: {
            full_name: fullName,
            username: username
          },
          aud: "authenticated",
          created_at: new Date().toISOString(),
          email: email,
        };

        setUser(mockUser);
        localStorage.setItem("mock_user", JSON.stringify(mockUser));
        
        toast.success(`Welcome, ${fullName}! 🎉`, {
          description: "Your account has been created successfully."
        });
        
        navigate("/");
        resolve({ error: null });
      }, 1000);
    });
  };

  const signIn = async (email: string, password: string) => {
    // Mock sign in logic
    return new Promise<{ error: any }>((resolve) => {
      setTimeout(() => {
        if (password.length < 6) {
          resolve({ error: { message: "Invalid login credentials (mock check)" } });
          return;
        }

        const mockUser: User = {
          id: "mock_user_id",
          app_metadata: {},
          user_metadata: {
            full_name: email.split("@")[0],
          },
          aud: "authenticated",
          created_at: new Date().toISOString(),
          email: email,
        };

        setUser(mockUser);
        localStorage.setItem("mock_user", JSON.stringify(mockUser));
        
        toast.success(`Welcome back! 🎉`, {
          description: "You've successfully signed in to BookVerse"
        });

        navigate("/");
        resolve({ error: null });
      }, 1000);
    });
  };

  const signOut = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser(null);
        setSession(null);
        localStorage.removeItem("mock_user");
        toast.info("Signed out successfully");
        navigate("/auth");
        resolve();
      }, 500);
    });
  };

  return (
    <AuthContext.Provider value={{ user, session, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
