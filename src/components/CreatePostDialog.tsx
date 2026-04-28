import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface CreatePostDialogProps {
  onPostCreated: () => void;
}

export const CreatePostDialog = ({ onPostCreated }: CreatePostDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [bookTitle, setBookTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create a post");
      return;
    }

    if (!bookTitle.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      book_title: bookTitle.trim(),
      content: content.trim(),
      image_url: imageUrl.trim() || null,
    });

    setLoading(false);

    if (error) {
      toast.error("Failed to create post");
      console.error(error);
      return;
    }

    toast.success("Post created successfully!");
    setOpen(false);
    setBookTitle("");
    setContent("");
    setImageUrl("");
    onPostCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Share Your Thoughts</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="book-title">Book Title *</Label>
            <Input
              id="book-title"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              placeholder="What book are you reading?"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Your Thoughts *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your review, recommendation, or update..."
              className="min-h-[120px]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL (optional)</Label>
            <Input
              id="image-url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              type="url"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
