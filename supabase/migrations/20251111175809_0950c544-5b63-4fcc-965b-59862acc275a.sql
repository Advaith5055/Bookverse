-- Create posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create post_likes table
CREATE TABLE public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts
CREATE POLICY "Posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for post_likes
CREATE POLICY "Post likes are viewable by everyone"
  ON public.post_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like posts"
  ON public.post_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON public.post_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at triggers
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();