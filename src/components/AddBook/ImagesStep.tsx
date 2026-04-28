import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImagesStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const ImagesStep = ({ formData, setFormData }: ImagesStepProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newImages = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setFormData({
      ...formData,
      images: [...(formData.images || []), ...newImages]
    });
  };

  const removeImage = (id: string) => {
    setFormData({
      ...formData,
      images: formData.images?.filter((img: any) => img.id !== id) || []
    });
  };

  return (
    <div className="space-y-6">
      {/* Cover Image Upload */}
      <div>
        <Label className="text-foreground font-medium mb-4 block">
          Book Cover & Photos *
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          Upload clear photos of the book. First image will be the cover.
        </p>
        
        <div
          className={cn(
            "border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 bg-background"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-muted-foreground">
            PNG, JPG up to 10MB each. Images will be optimized to 1024px max.
          </p>
        </div>
      </div>

      {/* Image Previews */}
      {formData.images && formData.images.length > 0 && (
        <div>
          <Label className="text-foreground font-medium mb-3 block">
            Uploaded Images ({formData.images.length})
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {formData.images.map((image: any, index: number) => (
              <div
                key={image.id}
                className="relative aspect-square rounded-xl overflow-hidden border border-border bg-accent/5 group"
              >
                <img
                  src={image.preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Cover
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Options */}
      <div className="bg-accent/10 p-6 rounded-2xl border border-border">
        <div className="flex items-start gap-3">
          <ImageIcon className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Image Guidelines</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use good lighting and clear focus</li>
              <li>• Show book condition honestly</li>
              <li>• Include spine and back cover if possible</li>
              <li>• Avoid watermarks or text overlays</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
