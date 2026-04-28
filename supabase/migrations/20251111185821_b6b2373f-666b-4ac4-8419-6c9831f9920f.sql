-- Create follows table for follow/unfollow functionality
CREATE TABLE public.follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Enable RLS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Create policies for follows table
CREATE POLICY "Follows are viewable by everyone"
  ON public.follows
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can follow others"
  ON public.follows
  FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others"
  ON public.follows
  FOR DELETE
  USING (auth.uid() = follower_id);

-- Create indexes for better query performance
CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);

-- Add followers_count and following_count to profiles
ALTER TABLE public.profiles 
  ADD COLUMN followers_count INTEGER DEFAULT 0,
  ADD COLUMN following_count INTEGER DEFAULT 0;

-- Create function to update follower counts
CREATE OR REPLACE FUNCTION public.update_follow_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment following count for follower
    UPDATE public.profiles
    SET following_count = following_count + 1
    WHERE id = NEW.follower_id;
    
    -- Increment followers count for following
    UPDATE public.profiles
    SET followers_count = followers_count + 1
    WHERE id = NEW.following_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement following count for follower
    UPDATE public.profiles
    SET following_count = following_count - 1
    WHERE id = OLD.follower_id;
    
    -- Decrement followers count for following
    UPDATE public.profiles
    SET followers_count = followers_count - 1
    WHERE id = OLD.following_id;
    
    RETURN OLD;
  END IF;
END;
$$;

-- Create trigger for follow counts
CREATE TRIGGER update_follow_counts_trigger
AFTER INSERT OR DELETE ON public.follows
FOR EACH ROW
EXECUTE FUNCTION public.update_follow_counts();