import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FollowButton } from "@/components/FollowButton";
import { Users, BookOpen, MessageSquare, Star, Sparkles, Navigation2, Activity, Map, Orbit, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  followers_count: number;
  following_count: number;
  books_read: number;
  reviews_written: number;
  member_since: string;
  // Synthetic data for the "Cosmos" theme since we don't have this in real DB yet
  dna?: number[];
  matchScore?: number;
  constellation?: string;
}

// ─── User DNA Radar Chart ─────────────────────────────────────
const UserDNA = ({ dna, size = 100 }: { dna: number[]; size?: number }) => {
  const labels = ["SCI-FI", "FANTASY", "NON-FIC", "MYS", "ROM", "HIST"];
  const cx = 50, cy = 50, r = 35;
  const n = dna.length;

  const getPoint = (val: number, i: number) => {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * r * val,
      y: cy + Math.sin(angle) * r * val,
    };
  };

  const points = dna.map((val, i) => getPoint(val, i));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
        {/* Grid rings */}
        {[0.33, 0.66, 1].map((scale, si) => (
          <polygon
            key={si}
            points={Array.from({ length: n }).map((_, i) => {
              const p = getPoint(scale, i);
              return `${p.x},${p.y}`;
            }).join(" ")}
            fill="none"
            stroke="rgba(168, 85, 247, 0.15)"
            strokeWidth="0.5"
          />
        ))}
        {/* Axis lines */}
        {dna.map((_, i) => {
          const p = getPoint(1, i);
          return (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={p.x} y2={p.y}
              stroke="rgba(168, 85, 247, 0.1)"
              strokeWidth="0.5"
            />
          );
        })}
        {/* Data shape */}
        <path d={pathD} fill="rgba(168, 85, 247, 0.2)" stroke="rgba(168, 85, 247, 0.8)" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2" fill="hsl(270, 70%, 55%)" />
        ))}
        {/* Labels */}
        {dna.map((_, i) => {
          const p = getPoint(1.25, i);
          return (
            <text key={i} x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="central" fill="rgba(255, 255, 255, 0.6)" fontSize="4.5" fontWeight="600" className="tracking-widest">
              {labels[i]}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// Constellations lists for random assignment
const constellationsList = ["The Navigator", "The Scholar", "The Dreamer", "The Catalyst", "The Archivist", "The Void-Walker"];

const Discover = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const headerAnim = useScrollAnimation();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchRecommendedUsers();
  }, [user, navigate]);

  const fetchRecommendedUsers = async () => {
    if (!user) return;

    setLoading(true);

    const { data: followingData } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user.id);

    const followingIds = followingData?.map((f) => f.following_id) || [];

    let query = supabase
      .from("profiles")
      .select("*")
      .neq("id", user.id);

    if (followingIds.length > 0) {
      query = query.not("id", "in", `(${followingIds.join(",")})`);
    }

    const { data, error } = await query
      .order("followers_count", { ascending: false })
      .order("books_read", { ascending: false })
      .limit(16); // Even grid

    if (error) {
      console.error("Error fetching users:", error);
    } else {
      // Add synthetic data for the demo
      const enriched = (data || []).map(u => ({
        ...u,
        dna: Array.from({ length: 6 }, () => 0.3 + Math.random() * 0.7),
        matchScore: Math.floor(65 + Math.random() * 34),
        constellation: constellationsList[Math.floor(Math.random() * constellationsList.length)]
      }));
      // Sort by Match Score for the Cosmos theme
      enriched.sort((a, b) => b.matchScore - a.matchScore);
      setUsers(enriched);
    }

    setLoading(false);
  };

  const UserCardNode = ({ profile, index }: { profile: UserProfile, index: number }) => {
    const cardAnimation = useScrollAnimation({ threshold: 0.1 });
    
    return (
      <div
        ref={cardAnimation.ref}
        className={`transition-all duration-700 ${
          cardAnimation.isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
        }`}
        style={{ transitionDelay: `${Math.min(index * 100, 500)}ms` }}
      >
        <div className="card-cosmic rounded-3xl p-6 h-full flex flex-col relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
          
          {/* Top Info */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4 cursor-pointer z-10" onClick={() => navigate(`/profile?userId=${profile.id}`)}>
              <div className="relative">
                <img 
                  src={profile.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"} 
                  alt={profile.full_name || "User"}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-500/20 group-hover:ring-purple-500/50 transition-colors"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-background rounded-full flex items-center justify-center">
                  <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg group-hover:text-purple-400 transition-colors">
                  {profile.full_name || profile.username || "Anonymous"}
                </h3>
                <p className="text-xs text-purple-400/80 font-medium tracking-wide uppercase">
                  {profile.constellation}
                </p>
              </div>
            </div>
            <div className="z-10 bg-gradient-to-br from-purple-500/20 to-primary/20 border border-purple-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
              <span className="text-sm font-bold text-foreground">{profile.matchScore}% Match</span>
            </div>
          </div>
          
          {/* Biometrics DNA Section */}
          <div className="flex-1 flex items-center justify-between gap-6 relative z-10 bg-black/20 rounded-2xl p-4 border border-white/5">
            <div className="flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700">
              <UserDNA dna={profile.dna || []} size={110} />
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> Volume</span>
                  <span className="font-semibold text-foreground">{profile.books_read}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-primary w-[75%]" />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Resonance</span>
                  <span className="font-semibold text-foreground">{profile.followers_count}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[60%]" />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Synthesis</span>
                  <span className="font-semibold text-foreground">{profile.reviews_written}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-[45%]" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Bio & Action */}
          <div className="mt-5 pt-5 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
              {profile.bio || "Exploring the vast literary cosmos, analyzing texts to find deeper structural meaning."}
            </p>
            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <FollowButton userId={profile.id} size="lg" />
            </div>
          </div>

          {/* Background decorative ring */}
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] border-2 border-purple-500/5 rounded-full z-0 group-hover:scale-150 group-hover:border-purple-500/10 transition-transform duration-1000 ease-out" />
        </div>
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="noise-overlay z-0" />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <Navigation />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header Section */}
          <div 
            ref={headerAnim.ref}
            className={`max-w-3xl mb-12 transform transition-all duration-1000 ${headerAnim.isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(168,85,247,0.15)] animate-pulse" style={{ animationDuration: '3s' }}>
              <Orbit className="w-3.5 h-3.5" />
              AI Matching Enabled
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-[1.1] mb-6">
              Discover Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-primary to-amber-400">Literary Constellation</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              We've analyzed millions of data points across the BookVerse grid to find explorers whose reading DNA resonates precisely with yours.
            </p>
          </div>

          {/* Quick Actions / Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <Button variant="outline" className="glass-panel border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
              <Activity className="w-4 h-4 mr-2" /> Top Matches
            </Button>
            <Button variant="outline" className="glass-panel border-border/50 text-muted-foreground hover:text-foreground">
              <Navigation2 className="w-4 h-4 mr-2" /> Trending Explorers
            </Button>
            <Button variant="outline" className="glass-panel border-border/50 text-muted-foreground hover:text-foreground">
              <Map className="w-4 h-4 mr-2" /> Local Sector
            </Button>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 mt-8 lg:grid-cols-2 xl:grid-cols-2 gap-6 w-full max-w-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card-cosmic rounded-3xl p-6 h-[260px]">
                  <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="w-14 h-14 rounded-full bg-muted/40" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32 bg-muted/40" />
                      <Skeleton className="h-3 w-20 bg-muted/40" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="w-24 h-24 rounded-full bg-muted/30" />
                    <div className="flex-1 space-y-3 py-2">
                      <Skeleton className="h-2 w-full bg-muted/40" />
                      <Skeleton className="h-2 w-4/5 bg-muted/40" />
                      <Skeleton className="h-2 w-5/6 bg-muted/40" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="card-cosmic p-16 text-center max-w-2xl mx-auto rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-primary/5" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-background/50 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-xl mb-6 animate-pulse">
                  <Users className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Sector Scanned</h3>
                <p className="text-muted-foreground text-lg mb-8 max-w-sm">
                  Your current coordinates show no unexplored matches. You are highly connected in this region.
                </p>
                <Button className="btn-gradient rounded-xl px-8" onClick={() => navigate('/books')}>
                  Return to Library
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20 w-full max-w-full">
              {users.map((profile, index) => (
                <UserCardNode key={profile.id} profile={profile} index={index} />
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Discover;
