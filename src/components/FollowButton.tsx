import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface FollowButtonProps {
  userId: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
}

export const FollowButton = ({ userId, variant = "default", size = "default" }: FollowButtonProps) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkFollowStatus();
  }, [user, userId]);

  const checkFollowStatus = async () => {
    if (!user || user.id === userId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", userId)
      .maybeSingle();

    if (!error) {
      setIsFollowing(!!data);
    }
    setLoading(false);
  };

  const toggleFollow = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!user) {
      toast.error("Please log in to follow users");
      return;
    }

    if (user.id === userId) return;

    setLoading(true);

    if (isFollowing) {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", userId);

      if (error) {
        toast.error("Failed to unfollow");
        console.error(error);
      } else {
        setIsFollowing(false);
        toast.success("Unfollowed user");
      }
    } else {
      const { error } = await supabase
        .from("follows")
        .insert({ follower_id: user.id, following_id: userId });

      if (error) {
        toast.error("Failed to follow");
        console.error(error);
      } else {
        setIsFollowing(true);
        toast.success("Following user");
      }
    }

    setLoading(false);
  };

  // Don't show button if viewing own profile or not logged in
  if (!user || user.id === userId) return null;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleFollow}
      disabled={loading}
      className="gap-2"
    >
      {isFollowing ? (
        <>
          <UserMinus className="w-4 h-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          Follow
        </>
      )}
    </Button>
  );
};
