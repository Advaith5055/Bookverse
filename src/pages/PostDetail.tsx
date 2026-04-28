import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, ArrowLeft, Send } from "lucide-react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
}

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
  user_has_liked: boolean;
}

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPostAndComments = async () => {
    if (!id) return;

    setLoading(true);

    // Fetch post
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select(`
        *,
        profiles!posts_user_id_fkey(id, username, full_name, avatar_url),
        post_likes(id)
      `)
      .eq("id", id)
      .single();

    if (postError) {
      toast.error("Failed to load post");
      console.error(postError);
      navigate("/community");
      return;
    }

    // Check if user has liked
    let userHasLiked = false;
    if (user) {
      const { data: likeData } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", id)
        .eq("user_id", user.id)
        .single();

      userHasLiked = !!likeData;
    }

    setPost({ ...postData, user_has_liked: userHasLiked } as Post);

    // Fetch comments
    const { data: commentsData, error: commentsError } = await supabase
      .from("comments")
      .select(`
        *,
        profiles!comments_user_id_fkey(id, username, full_name, avatar_url)
      `)
      .eq("post_id", id)
      .order("created_at", { ascending: true });

    if (commentsError) {
      toast.error("Failed to load comments");
      console.error(commentsError);
    } else {
      setComments(commentsData as Comment[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPostAndComments();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`post-${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${id}`,
        },
        () => {
          fetchPostAndComments();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "post_likes",
          filter: `post_id=eq.${id}`,
        },
        () => {
          fetchPostAndComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user]);

  const handlePostComment = async () => {
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }

    if (!comment.trim() || !id) return;

    setSubmitting(true);

    const { error } = await supabase.from("comments").insert({
      post_id: id,
      user_id: user.id,
      content: comment.trim(),
    });

    setSubmitting(false);

    if (error) {
      toast.error("Failed to add comment");
      console.error(error);
      return;
    }

    setComment("");
  };

  const toggleLike = async () => {
    if (!user) {
      toast.error("Please log in to like posts");
      return;
    }

    if (!post) return;

    if (post.user_has_liked) {
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", user.id);

      if (error) {
        toast.error("Failed to unlike post");
        console.error(error);
      }
    } else {
      const { error } = await supabase
        .from("post_likes")
        .insert({ post_id: post.id, user_id: user.id });

      if (error) {
        toast.error("Failed to like post");
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12 text-muted-foreground">Post not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/community")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community
        </Button>

        {/* Post */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          {/* User Info */}
          <div className="flex items-start gap-4 mb-4">
            <img
              src={post.profiles.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
              alt={post.profiles.full_name || "User"}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">
                  {post.profiles.full_name || "Anonymous"}
                </h3>
                <span className="text-sm text-muted-foreground">
                  @{post.profiles.username || "user"}
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </span>
              </div>
              <div className="text-sm text-primary mt-1">
                Reading: {post.book_title}
              </div>
            </div>
          </div>

          {/* Content */}
          <p className="text-foreground mb-4 leading-relaxed text-lg">{post.content}</p>

          {/* Image */}
          {post.image_url && (
            <img
              src={post.image_url}
              alt="Post content"
              className="w-full h-96 object-cover rounded-xl mb-4"
            />
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 pt-4 border-t border-border">
            <button
              onClick={toggleLike}
              className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors group"
            >
              <Heart
                className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                  post.user_has_liked ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span className="text-sm font-medium">
                {post.post_likes.length}
              </span>
            </button>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{comments.length}</span>
            </div>

            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group ml-auto">
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Add Comment */}
        {user ? (
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
              Add a Comment
            </h3>
            <div className="flex gap-3">
              <Textarea
                placeholder="Share your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 min-h-24 bg-background border-border rounded-xl resize-none"
                disabled={submitting}
              />
              <Button
                onClick={handlePostComment}
                className="h-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                disabled={submitting}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-6 mb-6 text-center">
            <p className="text-muted-foreground">Please log in to comment</p>
          </div>
        )}

        {/* Comments */}
        <div className="space-y-4">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
            Comments ({comments.length})
          </h3>
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-card border border-border rounded-2xl">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={comment.profiles.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                    alt={comment.profiles.full_name || "User"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">
                        {comment.profiles.full_name || "Anonymous"}
                      </h4>
                      <span className="text-sm text-muted-foreground">
                        @{comment.profiles.username || "user"}
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-foreground">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
