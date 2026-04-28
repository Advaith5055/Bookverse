import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Clock,
  Users,
  Flame,
  BookOpen,
  Star,
  Sparkles,
  Bookmark,
  MoreHorizontal,
  Send,
  Image,
  Quote,
  Award,
  Zap,
  Activity,
  Eye,
  ArrowRight,
  ChevronRight,
  Crown,
  Target,
  Orbit,
  Lightbulb,
  ThumbsUp,
  BookMarked,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { FollowButton } from "@/components/FollowButton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface Post {
  id: string;
  book_title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  profiles: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
  post_likes: { id: string }[];
  comments: { id: string }[];
  user_has_liked: boolean;
}

const Trophy = Award;

const reactionEmojis: Record<string, string> = {
  love: "\u2764\uFE0F",
  fire: "\uD83D\uDD25",
  insightful: "\uD83D\uDCA1",
  mustread: "\uD83D\uDCDA",
  thinking: "\uD83E\uDD14",
};

const reactionTypes = [
  { label: "Love", key: "love" },
  { label: "Fire", key: "fire" },
  { label: "Insightful", key: "insightful" },
  { label: "Must Read", key: "mustread" },
  { label: "Thought-provoking", key: "thinking" },
];

const detectPostType = (content: string, _bookTitle: string) => {
  const lc = content.toLowerCase();
  if (lc.includes("review") || lc.includes("rating") || lc.includes("stars") || lc.includes("/5"))
    return { type: "review", icon: Star, color: "text-amber-400", label: "Review" };
  if (lc.includes("recommend") || lc.includes("must read") || lc.includes("you should"))
    return { type: "recommendation", icon: Sparkles, color: "text-purple-400", label: "Recommendation" };
  if (lc.includes("finished") || lc.includes("completed") || lc.includes("just read"))
    return { type: "milestone", icon: Trophy, color: "text-emerald-400", label: "Milestone" };
  if (lc.includes("quote"))
    return { type: "quote", icon: Quote, color: "text-blue-400", label: "Quote" };
  if (lc.includes("?") || lc.includes("what do you think") || lc.includes("discuss"))
    return { type: "discussion", icon: MessageCircle, color: "text-cyan-400", label: "Discussion" };
  return { type: "update", icon: BookOpen, color: "text-primary", label: "Reading Update" };
};

const trendingTopics = [
  { tag: "ProjectHailMary", posts: 142, trend: "+24%" },
  { tag: "BookClubPicks", posts: 98, trend: "+18%" },
  { tag: "SummerReading", posts: 87, trend: "+31%" },
  { tag: "SciFiSunday", posts: 64, trend: "+12%" },
  { tag: "ClassicLit", posts: 53, trend: "+8%" },
];

const activeReaders = [
  { name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", book: "Dune", streak: 14 },
  { name: "Maya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop", book: "1984", streak: 28 },
  { name: "Jordan Lee", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop", book: "The Hobbit", streak: 7 },
  { name: "Sam Rivera", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop", book: "Sapiens", streak: 42 },
];

const activeChallenges = [
  { title: "Summer Sprint", progress: 65, books: "6/10", icon: Flame, color: "text-orange-400", daysLeft: 42 },
  { title: "Genre Explorer", progress: 37, books: "3/8", icon: Target, color: "text-blue-400", daysLeft: 60 },
];

const liveActivities = [
  { user: "Sarah M.", action: "finished reading", target: "Project Hail Mary", time: "2m ago", icon: BookMarked },
  { user: "David C.", action: "posted a review for", target: "1984", time: "5m ago", icon: Star },
  { user: "Emily R.", action: "started reading", target: "The Alchemist", time: "8m ago", icon: BookOpen },
  { user: "Alex K.", action: "joined the club", target: "Sci-Fi Explorers", time: "12m ago", icon: Users },
  { user: "Maya P.", action: "earned a badge:", target: "30-Day Streak", time: "15m ago", icon: Award },
];

const CommunityPulseMini = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let frame = 0;
    let id: number;
    const animate = () => {
      frame++;
      setOffset(frame);
      id = requestAnimationFrame(animate);
    };
    id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  const generatePath = () => {
    const pts: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = i;
      const y = 25 +
        Math.sin((i + offset * 0.5) * 0.12) * 10 +
        Math.sin((i + offset * 0.3) * 0.06) * 6 +
        Math.sin((i + offset * 0.8) * 0.18) * 3;
      pts.push(`${x},${y}`);
    }
    return `M ${pts.join(" L ")}`;
  };

  return (
    <svg viewBox="0 0 100 50" className="w-full h-10" preserveAspectRatio="none">
      <defs>
        <linearGradient id="miniPulse" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(32, 95%, 62%)" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(32, 95%, 62%)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(32, 95%, 62%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={generatePath()} fill="none" stroke="url(#miniPulse)" strokeWidth="0.8" />
    </svg>
  );
};

const PostSkeleton = () => (
  <div className="card-cosmic rounded-3xl p-6 space-y-4">
    <div className="flex items-start gap-4">
      <Skeleton className="w-12 h-12 rounded-full bg-muted/30" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3 bg-muted/30" />
        <Skeleton className="h-3 w-1/4 bg-muted/30" />
      </div>
    </div>
    <Skeleton className="h-4 w-full bg-muted/30" />
    <Skeleton className="h-4 w-4/5 bg-muted/30" />
    <Skeleton className="h-4 w-2/3 bg-muted/30" />
    <div className="flex gap-6 pt-4 border-t border-border/20">
      <Skeleton className="h-4 w-12 bg-muted/30" />
      <Skeleton className="h-4 w-12 bg-muted/30" />
      <Skeleton className="h-4 w-12 bg-muted/30" />
    </div>
  </div>
);

const Community = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [bookmarkPosts, setBookmarkPosts] = useState<Set<string>>(new Set());
  const [liveActivityIdx, setLiveActivityIdx] = useState(0);
  const headerAnim = useScrollAnimation();
  const sidebarAnim = useScrollAnimation();

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActivityIdx(prev => (prev + 1) % liveActivities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleBookmark = (postId: string) => {
    setBookmarkPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
    toast.success(bookmarkPosts.has(postId) ? "Removed from bookmarks" : "Saved to bookmarks");
  };

  const fetchPosts = async () => {
    setLoading(true);

    let query = supabase
      .from("posts")
      .select(`
        *,
        profiles!posts_user_id_fkey(id, username, full_name, avatar_url),
        post_likes(id),
        comments(id)
      `)
      .order("created_at", { ascending: false });

    if (activeFilter === "following" && user) {
      const { data: follows } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);

      const followingIds = follows?.map(f => f.following_id) || [];

      if (followingIds.length === 0) {
        setPosts([]);
        setLoading(false);
        return;
      }

      query = query.in("user_id", followingIds);
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Failed to load posts");
      console.error(error);
      setLoading(false);
      return;
    }

    const postsWithLikes = data.map((post) => ({
      ...post,
      user_has_liked: false,
    }));

    if (user) {
      const { data: userLikes } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", user.id);

      const likedPostIds = new Set(userLikes?.map((like) => like.post_id) || []);

      postsWithLikes.forEach((post) => {
        post.user_has_liked = likedPostIds.has(post.id);
      });
    }

    setPosts(postsWithLikes as Post[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel("posts-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => fetchPosts())
      .on("postgres_changes", { event: "*", schema: "public", table: "post_likes" }, () => fetchPosts())
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => fetchPosts())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, activeFilter]);

  const toggleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) {
      toast.error("Please log in to like posts");
      return;
    }

    if (currentlyLiked) {
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
      if (error) { toast.error("Failed to unlike post"); console.error(error); }
    } else {
      const { error } = await supabase
        .from("post_likes")
        .insert({ post_id: postId, user_id: user.id });
      if (error) { toast.error("Failed to like post"); console.error(error); }
    }
  };

  const filters = [
    { id: "all", label: "All Posts", icon: TrendingUp },
    { id: "following", label: "Following", icon: Users },
    { id: "trending", label: "Trending", icon: Flame },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "discussions", label: "Discussions", icon: MessageCircle },
  ];

  const filteredPosts = posts.filter(post => {
    if (activeFilter === "trending") return post.post_likes.length > 0 || post.comments.length > 0;
    if (activeFilter === "reviews") {
      const pt = detectPostType(post.content, post.book_title);
      return pt.type === "review";
    }
    if (activeFilter === "discussions") {
      const pt = detectPostType(post.content, post.book_title);
      return pt.type === "discussion";
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" />
      <Navigation />

      {/* HERO HEADER */}
      <div className="relative overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,hsl(270_70%_55%_/_0.04),transparent_50%),radial-gradient(ellipse_at_80%_30%,hsl(32_95%_62%_/_0.04),transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div
            ref={headerAnim.ref}
            className={`transition-all duration-700 ${headerAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-purple-500/15 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
                    <Orbit className="w-6 h-6 text-primary relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 animate-pulse" />
                  </div>
                  <div>
                    <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                      Community <span className="text-gradient-cosmic">Station</span>
                    </h1>
                  </div>
                </div>
                <p className="text-muted-foreground text-lg max-w-lg">
                  The beating heart of BookVerse — share discoveries, discuss ideas, and connect with fellow explorers.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Live Activity Ticker */}
                <div className="hidden md:flex items-center gap-2 glass-panel px-4 py-2.5 rounded-xl max-w-xs">
                  <div className="live-dot flex-shrink-0" />
                  <div className="text-xs text-muted-foreground overflow-hidden">
                    <div key={liveActivityIdx} className="animate-fade-in">
                      <span className="text-foreground font-medium">{liveActivities[liveActivityIdx].user}</span>
                      {" "}{liveActivities[liveActivityIdx].action}{" "}
                      <span className="text-primary">{liveActivities[liveActivityIdx].target}</span>
                    </div>
                  </div>
                </div>

                {user && <CreatePostDialog onPostCreated={fetchPosts} />}
              </div>
            </div>

            {/* Community Stats Bar */}
            <div className="flex flex-wrap items-center gap-6 mt-6 pt-5 border-t border-border/20">
              {[
                { icon: Users, value: "3,421", label: "Active now" },
                { icon: BookOpen, value: "12.8k", label: "Pages/min" },
                { icon: MessageCircle, value: "247", label: "Posts today" },
                { icon: Flame, value: "1,200+", label: "Active streaks" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <stat.icon className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">{stat.value}</span>
                  <span className="text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT: Main Feed */}
          <div className="flex-1 min-w-0">
            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl whitespace-nowrap transition-all text-sm font-medium ${
                    activeFilter === filter.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  <filter.icon className="w-4 h-4" />
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Community Pulse Mini */}
            <div className="glass-panel rounded-2xl px-5 py-3 mb-6 flex items-center gap-3">
              <Activity className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs text-muted-foreground flex-shrink-0">Pulse</span>
              <div className="flex-1">
                <CommunityPulseMini />
              </div>
              <span className="text-xs text-foreground font-semibold flex-shrink-0">892 reading now</span>
            </div>

            {/* Posts Feed */}
            <div className="space-y-5">
              {loading ? (
                <>
                  <PostSkeleton />
                  <PostSkeleton />
                  <PostSkeleton />
                </>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-16 card-cosmic rounded-3xl">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-primary/50" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                    {activeFilter === "following"
                      ? "No posts from your crew yet"
                      : activeFilter === "reviews"
                      ? "No reviews found"
                      : activeFilter === "discussions"
                      ? "No discussions yet"
                      : "The station is quiet"}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    {activeFilter === "following"
                      ? "Follow more readers to see their posts here!"
                      : "Be the first to share your thoughts with the community."}
                  </p>
                  {user && activeFilter === "all" && <CreatePostDialog onPostCreated={fetchPosts} />}
                </div>
              ) : (
                filteredPosts.map((post, idx) => {
                  const PostCard = () => {
                    const cardAnimation = useScrollAnimation({ threshold: 0.15 });
                    const postType = detectPostType(post.content, post.book_title);
                    const PostTypeIcon = postType.icon;
                    const isBookmarked = bookmarkPosts.has(post.id);

                    return (
                      <div
                        ref={cardAnimation.ref}
                        className={`card-cosmic rounded-3xl overflow-hidden transition-all duration-500 ${
                          cardAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                        style={{ transitionDelay: `${Math.min(idx * 60, 300)}ms` }}
                      >
                        {/* Post Type Banner */}
                        <div className="flex items-center justify-between px-6 pt-5 pb-0">
                          <div className="flex items-center gap-2">
                            <PostTypeIcon className={`w-3.5 h-3.5 ${postType.color}`} />
                            <span className={`text-xs font-semibold uppercase tracking-wider ${postType.color}`}>
                              {postType.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleBookmark(post.id); }}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                            >
                              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
                            </button>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="p-6 pt-4 cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                          {/* User Info */}
                          <div className="flex items-start gap-3.5 mb-4">
                            <div className="relative flex-shrink-0">
                              <img
                                src={post.profiles.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                                alt={post.profiles.full_name || "User"}
                                className="w-11 h-11 rounded-full object-cover ring-2 ring-border/50"
                              />
                              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-card" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-foreground text-sm hover:text-primary transition-colors">
                                  {post.profiles.full_name || "Anonymous"}
                                </h3>
                                <span className="text-xs text-muted-foreground">
                                  @{post.profiles.username || "user"}
                                </span>
                                <span className="text-xs text-muted-foreground">&bull;</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <BookOpen className="w-3 h-3 text-primary" />
                                <span className="text-xs text-primary font-medium">{post.book_title}</span>
                              </div>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                              <FollowButton userId={post.profiles.id} variant="outline" size="sm" />
                            </div>
                          </div>

                          {/* Content */}
                          <p className="text-foreground/90 leading-relaxed mb-4 text-[15px]">{post.content}</p>

                          {/* Image */}
                          {post.image_url && (
                            <div className="relative rounded-2xl overflow-hidden mb-4 group">
                              <img
                                src={post.image_url}
                                alt="Post content"
                                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          )}

                          {/* Engagement Stats */}
                          <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                            {post.post_likes.length > 0 && (
                              <span>{post.post_likes.length} {post.post_likes.length === 1 ? "like" : "likes"}</span>
                            )}
                            {post.comments.length > 0 && (
                              <span>{post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}</span>
                            )}
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {Math.floor(Math.random() * 200 + 50)} views
                            </span>
                          </div>
                        </div>

                        {/* Actions Bar */}
                        <div className="px-6 pb-5 pt-0">
                          <div className="flex items-center gap-1 pt-3 border-t border-border/20">
                            {/* Like */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(post.id, post.user_has_liked);
                              }}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm font-medium group ${
                                post.user_has_liked
                                  ? "text-red-500 bg-red-500/10"
                                  : "text-muted-foreground hover:text-red-500 hover:bg-red-500/5"
                              }`}
                            >
                              <Heart
                                className={`w-[18px] h-[18px] group-hover:scale-110 transition-transform ${
                                  post.user_has_liked ? "fill-red-500" : ""
                                }`}
                              />
                              <span>{post.post_likes.length || ""}</span>
                            </button>

                            {/* Comment */}
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/post/${post.id}`); }}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all text-sm font-medium group"
                            >
                              <MessageCircle className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
                              <span>{post.comments.length || ""}</span>
                            </button>

                            {/* Reactions */}
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowReactions(showReactions === post.id ? null : post.id);
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-amber-400 hover:bg-amber-400/5 transition-all text-sm font-medium group"
                              >
                                <Sparkles className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
                              </button>
                              {showReactions === post.id && (
                                <div
                                  className="absolute bottom-full left-0 mb-2 glass-panel rounded-2xl p-2 flex items-center gap-1 animate-scale-in z-20"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {reactionTypes.map((r) => (
                                    <button
                                      key={r.key}
                                      onClick={() => {
                                        toast.success("Reacted with " + r.label);
                                        setShowReactions(null);
                                      }}
                                      className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted/50 hover:scale-125 transition-all text-lg"
                                      title={r.label}
                                    >
                                      {reactionEmojis[r.key]}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Share */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (navigator.clipboard) {
                                  navigator.clipboard.writeText(window.location.origin + "/post/" + post.id);
                                }
                                toast.success("Link copied!");
                              }}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all text-sm font-medium group ml-auto"
                            >
                              <Share2 className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  };

                  return <PostCard key={post.id} />;
                })
              )}
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="w-full lg:w-[340px] flex-shrink-0 space-y-5">
            <div
              ref={sidebarAnim.ref}
              className={`space-y-5 lg:sticky lg:top-24 transition-all duration-700 ${
                sidebarAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              {/* Trending Topics */}
              <div className="card-cosmic rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Trending Topics</h3>
                </div>
                <div className="space-y-3">
                  {trendingTopics.map((topic, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center justify-between group hover:bg-muted/30 rounded-xl px-3 py-2.5 -mx-1 transition-all"
                    >
                      <div className="text-left">
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          #{topic.tag}
                        </p>
                        <p className="text-xs text-muted-foreground">{topic.posts} posts</p>
                      </div>
                      <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-full">
                        {topic.trend}
                      </span>
                    </button>
                  ))}
                </div>
                <button className="w-full mt-3 text-xs text-primary font-medium hover:underline flex items-center gap-1 justify-center">
                  Show more <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Top Streaks */}
              <div className="card-cosmic rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Top Streaks</h3>
                </div>
                <div className="space-y-3">
                  {activeReaders.map((reader, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <img
                        src={reader.avatar}
                        alt={reader.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-border/30"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {reader.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          Reading {reader.book}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-orange-500/10 px-2.5 py-1 rounded-full flex-shrink-0">
                        <Flame className="w-3 h-3 text-orange-400" />
                        <span className="text-xs font-bold text-orange-400">{reader.streak}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Expeditions */}
              <div className="card-cosmic rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-blue-400" />
                  <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Your Expeditions</h3>
                </div>
                <div className="space-y-4">
                  {activeChallenges.map((challenge, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <challenge.icon className={`w-4 h-4 ${challenge.color}`} />
                          <span className="text-sm font-medium text-foreground">{challenge.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{challenge.books}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full transition-all duration-1000"
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{challenge.daysLeft} days left</p>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 btn-outline-glow rounded-xl text-xs"
                  onClick={() => navigate("/books")}
                >
                  View All Expeditions <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>

              {/* Live Activity */}
              <div className="card-cosmic rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="live-dot" />
                  <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Live Activity</h3>
                </div>
                <div className="space-y-3">
                  {liveActivities.map((activity, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 text-xs transition-all duration-500 ${
                        i === liveActivityIdx ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <activity.icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-muted-foreground leading-relaxed">
                          <span className="text-foreground font-medium">{activity.user}</span>
                          {" "}{activity.action}{" "}
                          <span className="text-primary font-medium">{activity.target}</span>
                        </p>
                        <p className="text-muted-foreground/60 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="card-cosmic rounded-2xl p-5">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: BookOpen, label: "My Library", path: "/books" },
                    { icon: Users, label: "Discover", path: "/discover" },
                    { icon: MessageCircle, label: "Chat", path: "/chat" },
                    { icon: Crown, label: "Leaderboard", path: "/books" },
                  ].map((link, i) => (
                    <button
                      key={i}
                      onClick={() => navigate(link.path)}
                      className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-muted/30 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all text-sm"
                    >
                      <link.icon className="w-4 h-4" />
                      <span className="font-medium">{link.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Community;
