import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Stepper } from "@/components/AddBook/Stepper";
import { BookInfoStep } from "@/components/AddBook/BookInfoStep";
import { ListingTypeStep } from "@/components/AddBook/ListingTypeStep";
import { ImagesStep } from "@/components/AddBook/ImagesStep";
import { PreviewStep } from "@/components/AddBook/PreviewStep";
import { SafetyTips } from "@/components/AddBook/SafetyTips";

const steps = [
  { label: "Book Info", description: "Basic details" },
  { label: "Listing Type", description: "How to share" },
  { label: "Images", description: "Upload photos" },
  { label: "Preview", description: "Review & publish" }
];

const AddBook = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genres: [],
    language: "",
    isbn: "",
    description: "",
    listingTypes: [],
    price: "",
    condition: "",
    shipping: "",
    lookingFor: "",
    pickupLocation: "",
    deliveryPrefs: "",
    borrowDuration: "",
    deposit: "",
    visibility: "public",
    images: []
  });

  const handleSubmit = () => {
    if (!agreed) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    toast.success("Book listing published successfully!");
    navigate("/books");
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
    navigate("/profile");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.title && formData.author;
      case 1:
        return formData.listingTypes.length > 0;
      case 2:
        return formData.images.length > 0;
      case 3:
        return agreed;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" />
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/books")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Books
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
            Add a New Book
          </h1>
          <p className="text-muted-foreground">
            Share your book through sell, swap, share, or borrow
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              {/* Stepper */}
              <Stepper steps={steps} currentStep={currentStep} />

              {/* Step Content */}
              <div className="mt-8">
                {currentStep === 0 && (
                  <BookInfoStep formData={formData} setFormData={setFormData} />
                )}
                {currentStep === 1 && (
                  <ListingTypeStep formData={formData} setFormData={setFormData} />
                )}
                {currentStep === 2 && (
                  <ImagesStep formData={formData} setFormData={setFormData} />
                )}
                {currentStep === 3 && (
                  <PreviewStep formData={formData} agreed={agreed} setAgreed={setAgreed} />
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-border">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="h-12 px-8 rounded-xl"
                  >
                    Back
                  </Button>
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="h-12 px-6 rounded-xl"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceed()}
                    className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium shadow-lg"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canProceed()}
                    className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium shadow-lg"
                  >
                    Publish Listing
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <SafetyTips />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AddBook;
