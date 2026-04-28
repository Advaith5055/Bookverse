import { DollarSign, Repeat, Heart, BookOpen, Globe, Users, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ListingTypeStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const ListingTypeStep = ({ formData, setFormData }: ListingTypeStepProps) => {
  const listingTypes = [
    { id: "sell", label: "Sell", icon: DollarSign, color: "text-green-600" },
    { id: "swap", label: "Swap", icon: Repeat, color: "text-blue-600" },
    { id: "share", label: "Share (Free)", icon: Heart, color: "text-pink-600" },
    { id: "borrow", label: "Borrow", icon: BookOpen, color: "text-purple-600" }
  ];

  const visibilityOptions = [
    { id: "public", label: "Public", icon: Globe, desc: "Anyone can see" },
    { id: "community", label: "Community Only", icon: Users, desc: "Your communities" },
    { id: "private", label: "Private", icon: Lock, desc: "Only followers" }
  ];

  const handleTypeToggle = (typeId: string) => {
    const current = formData.listingTypes || [];
    if (current.includes(typeId)) {
      setFormData({
        ...formData,
        listingTypes: current.filter((t: string) => t !== typeId)
      });
    } else {
      setFormData({
        ...formData,
        listingTypes: [...current, typeId]
      });
    }
  };

  const isTypeSelected = (typeId: string) => {
    return formData.listingTypes?.includes(typeId) || false;
  };

  return (
    <div className="space-y-8">
      {/* Listing Types */}
      <div>
        <Label className="text-foreground font-medium mb-4 block">
          How will you make this book available? *
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          You can select multiple options
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {listingTypes.map((type) => {
            const Icon = type.icon;
            const selected = isTypeSelected(type.id);
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => handleTypeToggle(type.id)}
                className={cn(
                  "p-6 rounded-2xl border-2 transition-all hover:shadow-md",
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-primary/50"
                )}
              >
                <Icon className={cn("w-8 h-8 mx-auto mb-2", selected ? "text-primary" : type.color)} />
                <p className={cn("font-medium text-sm", selected ? "text-primary" : "text-foreground")}>
                  {type.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditional Fields Based on Type */}
      {isTypeSelected("sell") && (
        <div className="bg-accent/10 p-6 rounded-2xl border border-border space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Sale Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-2 h-12 bg-background border-border rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="condition">Condition *</Label>
              <select
                id="condition"
                value={formData.condition || ""}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="mt-2 h-12 w-full bg-background border border-border rounded-xl px-3"
              >
                <option value="">Select...</option>
                <option value="new">New</option>
                <option value="good">Good</option>
                <option value="used">Used</option>
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="shipping">Shipping Options</Label>
            <Input
              id="shipping"
              placeholder="e.g., Local pickup, Shipping available"
              value={formData.shipping || ""}
              onChange={(e) => setFormData({ ...formData, shipping: e.target.value })}
              className="mt-2 h-12 bg-background border-border rounded-xl"
            />
          </div>
        </div>
      )}

      {isTypeSelected("swap") && (
        <div className="bg-accent/10 p-6 rounded-2xl border border-border space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Repeat className="w-5 h-5 text-blue-600" />
            Swap Preferences
          </h3>
          <div>
            <Label htmlFor="lookingFor">What are you looking for?</Label>
            <Textarea
              id="lookingFor"
              placeholder="Describe the books or genres you'd like to swap for..."
              value={formData.lookingFor || ""}
              onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
              className="mt-2 min-h-24 bg-background border-border rounded-xl resize-none"
            />
          </div>
        </div>
      )}

      {isTypeSelected("share") && (
        <div className="bg-accent/10 p-6 rounded-2xl border border-border space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-600" />
            Share Details
          </h3>
          <div>
            <Label htmlFor="pickupLocation">Pickup Location</Label>
            <Input
              id="pickupLocation"
              placeholder="Enter location or address"
              value={formData.pickupLocation || ""}
              onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
              className="mt-2 h-12 bg-background border-border rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="deliveryPrefs">Delivery Preferences</Label>
            <Input
              id="deliveryPrefs"
              placeholder="e.g., Can deliver within 5 miles"
              value={formData.deliveryPrefs || ""}
              onChange={(e) => setFormData({ ...formData, deliveryPrefs: e.target.value })}
              className="mt-2 h-12 bg-background border-border rounded-xl"
            />
          </div>
        </div>
      )}

      {isTypeSelected("borrow") && (
        <div className="bg-accent/10 p-6 rounded-2xl border border-border space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Borrow Terms
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="borrowDuration">Maximum Duration</Label>
              <select
                id="borrowDuration"
                value={formData.borrowDuration || ""}
                onChange={(e) => setFormData({ ...formData, borrowDuration: e.target.value })}
                className="mt-2 h-12 w-full bg-background border border-border rounded-xl px-3"
              >
                <option value="">Select...</option>
                <option value="1week">1 Week</option>
                <option value="2weeks">2 Weeks</option>
                <option value="1month">1 Month</option>
              </select>
            </div>
            <div>
              <Label htmlFor="deposit">Security Deposit (Optional)</Label>
              <Input
                id="deposit"
                type="number"
                placeholder="0.00"
                value={formData.deposit || ""}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                className="mt-2 h-12 bg-background border-border rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Visibility */}
      <div>
        <Label className="text-foreground font-medium mb-4 block">
          Who can see this listing?
        </Label>
        <RadioGroup
          value={formData.visibility || "public"}
          onValueChange={(value) => setFormData({ ...formData, visibility: value })}
          className="space-y-3"
        >
          {visibilityOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                className="flex items-center space-x-3 p-4 rounded-xl border border-border bg-background hover:bg-accent/5 transition-colors"
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Label
                  htmlFor={option.id}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.desc}</p>
                  </div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );
};
