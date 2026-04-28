import { DollarSign, Repeat, Heart, BookOpen, MapPin, Calendar, Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface PreviewStepProps {
  formData: any;
  agreed: boolean;
  setAgreed: (value: boolean) => void;
}

export const PreviewStep = ({ formData, agreed, setAgreed }: PreviewStepProps) => {
  const getListingTypeIcons = () => {
    const icons: { [key: string]: any } = {
      sell: { icon: DollarSign, label: "For Sale", color: "bg-green-100 text-green-700 border-green-300" },
      swap: { icon: Repeat, label: "Swap", color: "bg-blue-100 text-blue-700 border-blue-300" },
      share: { icon: Heart, label: "Free Share", color: "bg-pink-100 text-pink-700 border-pink-300" },
      borrow: { icon: BookOpen, label: "Borrow", color: "bg-purple-100 text-purple-700 border-purple-300" }
    };
    return icons;
  };

  const icons = getListingTypeIcons();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Preview Your Listing</h3>
        <p className="text-sm text-muted-foreground">
          This is how your book listing will appear to others
        </p>
      </div>

      {/* Preview Card */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Book Cover */}
            <div className="md:col-span-1">
              {formData.images && formData.images.length > 0 ? (
                <img
                  src={formData.images[0].preview}
                  alt="Book cover"
                  className="w-full aspect-[2/3] object-cover rounded-xl border border-border"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-accent/20 rounded-xl border border-border flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {formData.title || "Book Title"}
                </h2>
                <p className="text-muted-foreground">
                  by {formData.author || "Author Name"}
                </p>
              </div>

              {/* Listing Type Badges */}
              <div className="flex flex-wrap gap-2">
                {formData.listingTypes?.map((type: string) => {
                  const typeInfo = icons[type];
                  if (!typeInfo) return null;
                  const Icon = typeInfo.icon;
                  return (
                    <Badge
                      key={type}
                      variant="outline"
                      className={`px-3 py-1 ${typeInfo.color}`}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {typeInfo.label}
                    </Badge>
                  );
                })}
              </div>

              {/* Price */}
              {formData.listingTypes?.includes("sell") && formData.price && (
                <div className="text-3xl font-bold text-primary">
                  ${formData.price}
                  {formData.condition && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      • {formData.condition}
                    </span>
                  )}
                </div>
              )}

              {/* Genres */}
              {formData.genres && formData.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.genres.map((genre: string) => (
                    <Badge key={genre} variant="secondary" className="rounded-full">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Description */}
              {formData.description && (
                <p className="text-muted-foreground">
                  {formData.description}
                </p>
              )}

              {/* Additional Details */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {formData.language && (
                  <span>Language: {formData.language}</span>
                )}
                {formData.isbn && (
                  <span>ISBN: {formData.isbn}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms & Safety */}
      <div className="bg-accent/10 p-6 rounded-2xl border border-border space-y-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-3">
              Terms & Safety Agreement
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms1"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                />
                <label htmlFor="terms1" className="text-sm text-foreground cursor-pointer">
                  I confirm that I own this book and have the right to list it
                </label>
              </div>
              
              <div className="flex items-start gap-3">
                <Checkbox id="terms2" />
                <label htmlFor="terms2" className="text-sm text-foreground cursor-pointer">
                  I will honor all swap, borrow, and transaction terms
                </label>
              </div>
              
              <div className="flex items-start gap-3">
                <Checkbox id="terms3" />
                <label htmlFor="terms3" className="text-sm text-foreground cursor-pointer">
                  I will not engage in illegal distribution or copyright violation
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox id="terms4" />
                <label htmlFor="terms4" className="text-sm text-foreground cursor-pointer">
                  I agree to meet in safe, public spaces for transactions
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
