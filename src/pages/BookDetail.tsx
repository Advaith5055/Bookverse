import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star, Heart, Share2, BookOpen, MessageCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock book data
  const book = {
    title: "Dune",
    author: "Frank Herbert",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&h=1200&fit=crop",
    rating: 4.5,
    genre: "Science Fiction",
    year: 1965,
    pages: 688,
    language: "English",
    publisher: "Chilton Books",
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange, a drug capable of extending life and enhancing consciousness. Coveted across the known universe, melange is a prize worth killing for.",
    reviews: [
      {
        id: 1,
        user: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        rating: 5,
        comment: "An absolute masterpiece of science fiction. Herbert's world-building is unparalleled.",
        date: "2 weeks ago"
      },
      {
        id: 2,
        user: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        rating: 4,
        comment: "A complex and rewarding read. Takes time to get into but worth every page.",
        date: "1 month ago"
      }
    ]
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
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

        {/* Book Header */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Book Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm px-3 py-1 bg-accent/30 text-primary rounded-full font-medium">
                  {book.genre}
                </span>
                <span className="text-sm text-muted-foreground">{book.year}</span>
              </div>
              
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(book.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-semibold text-foreground">{book.rating}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">128 reviews</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-8">
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 md:flex-none"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Reading
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsFavorite(!isFavorite);
                    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
                  }}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Book Details Grid */}
              <div className="grid grid-cols-2 gap-4 p-6 bg-accent/10 rounded-xl">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Pages</div>
                  <div className="font-semibold text-foreground">{book.pages}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Language</div>
                  <div className="font-semibold text-foreground">{book.language}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Publisher</div>
                  <div className="font-semibold text-foreground">{book.publisher}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Year</div>
                  <div className="font-semibold text-foreground">{book.year}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-transparent border-b border-border rounded-none h-auto p-0">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="discussion"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Discussion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4">
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">{book.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {book.reviews.map((review) => (
              <div key={review.id} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={review.avatar}
                    alt={review.user}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{review.user}</h4>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="discussion">
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                Join the Discussion
              </h3>
              <p className="text-muted-foreground mb-6">
                Share your thoughts and connect with other readers
              </p>
              <Button onClick={() => navigate("/community")}>
                Visit Community
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default BookDetail;
