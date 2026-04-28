import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Mail, Lock, User, ArrowLeft, Sparkles, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    username: "",
  });

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const validated = signUpSchema.parse(formData);
        const { error } = await signUp(
          validated.email,
          validated.password,
          validated.fullName,
          validated.username
        );

        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Please sign in instead.");
          } else {
            toast.error(error.message || "Failed to sign up");
          }
        }
      } else {
        const validated = signInSchema.parse({ email: formData.email, password: formData.password });
        const { error } = await signIn(validated.email, validated.password);

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password. Please try again.");
          } else {
            toast.error(error.message || "Failed to sign in");
          }
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Left Panel — Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        {/* Ambient glow */}
        <div className="glow-orb w-[500px] h-[500px] bg-primary/15 top-[20%] left-[10%]" />
        <div className="glow-orb w-[300px] h-[300px] bg-amber-400/10 bottom-[20%] right-[10%]" style={{ animationDelay: "3s" }} />

        <div className="relative z-10 max-w-md text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
            Welcome to <span className="text-gradient-animated">BookVerse</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            Join a thriving community of readers. Discover books, share reviews,
            and connect with people who share your passion.
          </p>

          {/* Feature highlights */}
          <div className="space-y-4 text-left">
            {[
              { icon: Sparkles, text: "Personalized book recommendations" },
              { icon: Star, text: "Track your reading goals & progress" },
              { icon: User, text: "Connect with readers worldwide" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-12 relative">
        <div className="w-full max-w-md">
          {/* Back to Home */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          {/* Mobile logo (hidden on desktop) */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2">
              <div className="w-9 h-9 bg-primary/15 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <span className="font-heading text-xl font-bold text-foreground">
                Book<span className="text-primary">Verse</span>
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp
                ? "Start your reading journey today"
                : "Sign in to continue your adventure"}
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-panel rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <>
                  <div>
                    <Label htmlFor="fullName" className="text-foreground text-sm font-medium">
                      Full Name
                    </Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="pl-10 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 text-foreground"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="username" className="text-foreground text-sm font-medium">
                      Username
                    </Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="pl-10 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 text-foreground"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="email" className="text-foreground text-sm font-medium">
                  Email
                </Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 text-foreground"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground text-sm font-medium">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 text-foreground"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 btn-gradient rounded-xl font-semibold text-base"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Please wait...
                  </span>
                ) : isSignUp ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Toggle Sign In / Sign Up */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <span className="text-primary font-medium">Sign In</span>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <span className="text-primary font-medium">Sign Up</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
