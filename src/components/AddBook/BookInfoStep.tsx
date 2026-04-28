import { Search, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface BookInfoStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const BookInfoStep = ({ formData, setFormData }: BookInfoStepProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [genreInput, setGenreInput] = useState("");

  const handleAddGenre = () => {
    if (genreInput.trim() && !formData.genres?.includes(genreInput.trim())) {
      setFormData({
        ...formData,
        genres: [...(formData.genres || []), genreInput.trim()]
      });
      setGenreInput("");
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setFormData({
      ...formData,
      genres: formData.genres?.filter((g: string) => g !== genre) || []
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Field */}
      <div>
        <Label className="text-foreground font-medium mb-2 block">
          Quick Search
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search title, author or ISBN"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-background border-border rounded-xl"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Auto-fill book details from our database or BigBookAPI
        </p>
      </div>

      {/* Title */}
      <div>
        <Label htmlFor="title" className="text-foreground font-medium">
          Book Title *
        </Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter book title"
          className="mt-2 h-12 bg-background border-border rounded-xl"
          required
        />
      </div>

      {/* Author */}
      <div>
        <Label htmlFor="author" className="text-foreground font-medium">
          Author(s) *
        </Label>
        <Input
          id="author"
          value={formData.author || ""}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          placeholder="Enter author name(s)"
          className="mt-2 h-12 bg-background border-border rounded-xl"
          required
        />
      </div>

      {/* Genre Tags */}
      <div>
        <Label className="text-foreground font-medium mb-2 block">Genre(s)</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddGenre())}
            placeholder="Add genre..."
            className="h-10 bg-background border-border rounded-xl"
          />
          <Button
            type="button"
            onClick={handleAddGenre}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {formData.genres?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.genres.map((genre: string) => (
              <Badge
                key={genre}
                variant="secondary"
                className="px-3 py-1 rounded-full"
              >
                {genre}
                <button
                  type="button"
                  onClick={() => handleRemoveGenre(genre)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Language */}
        <div>
          <Label htmlFor="language" className="text-foreground font-medium">
            Language
          </Label>
          <Input
            id="language"
            value={formData.language || ""}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            placeholder="e.g., English"
            className="mt-2 h-12 bg-background border-border rounded-xl"
          />
        </div>

        {/* ISBN */}
        <div>
          <Label htmlFor="isbn" className="text-foreground font-medium">
            ISBN (Optional)
          </Label>
          <Input
            id="isbn"
            value={formData.isbn || ""}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            placeholder="e.g., 978-3-16-148410-0"
            className="mt-2 h-12 bg-background border-border rounded-xl"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="text-foreground font-medium">
          Short Description
        </Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Write a brief description of the book..."
          className="mt-2 min-h-32 bg-background border-border rounded-xl resize-none"
        />
      </div>
    </div>
  );
};
