import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  Heart, 
  DollarSign, 
  RefreshCw, 
  Gift, 
  BookCopy,
  ChevronDown,
  X
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const mockBooks = [
  {
    id: 1,
    title: "Dune",
    author: "Frank Herbert",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    rating: 4.5,
    genre: "Science Fiction",
    year: 1965,
    listingType: "sale",
    price: 15.99,
    condition: "Good",
    language: "English"
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    rating: 4.7,
    genre: "Dystopian",
    year: 1949,
    listingType: "swap",
    condition: "Good",
    language: "English"
  },
  {
    id: 3,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    rating: 4.6,
    genre: "Romance",
    year: 1813,
    listingType: "share",
    condition: "New",
    language: "English"
  },
  {
    id: 4,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://images.unsplash.com/photo-1518734540-478beb8f0e8e?w=400&h=600&fit=crop",
    rating: 4.3,
    genre: "Classic",
    year: 1925,
    listingType: "borrow",
    condition: "Good",
    language: "English"
  },
  {
    id: 5,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
    rating: 4.8,
    genre: "Classic",
    year: 1960,
    listingType: "sale",
    price: 12.50,
    condition: "New",
    language: "English"
  },
  {
    id: 6,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    rating: 4.6,
    genre: "Fantasy",
    year: 1937,
    listingType: "sale",
    price: 18.99,
    condition: "Used",
    language: "English"
  }
];

const genres = ["Science Fiction", "Fantasy", "Romance", "Classic", "Dystopian", "Mystery", "Thriller", "Non-Fiction"];
const languages = ["English", "Spanish", "French", "German", "Italian", "Portuguese"];
const conditions = ["New", "Good", "Used"];

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // Filters
  const [selectedListingTypes, setSelectedListingTypes] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("newest");

  const toggleFavorite = (bookId: number) => {
    setFavorites(prev =>
      prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const toggleFilter = (type: string, value: string) => {
    const setters: Record<string, any> = {
      listingType: setSelectedListingTypes,
      genre: setSelectedGenres,
      language: setSelectedLanguages,
      condition: setSelectedConditions
    };
    
    const setter = setters[type];
    const getState = (): string[] => {
      if (type === "listingType") return selectedListingTypes;
      if (type === "genre") return selectedGenres;
      if (type === "language") return selectedLanguages;
      return selectedConditions;
    };
    
    const current = getState();
    setter(
      current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
    );
  };

  const clearAllFilters = () => {
    setSelectedListingTypes([]);
    setSelectedGenres([]);
    setSelectedLanguages([]);
    setSelectedConditions([]);
    setPriceRange([0, 100]);
    setSearchQuery("");
  };

  const filteredBooks = mockBooks
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesListingType = selectedListingTypes.length === 0 || selectedListingTypes.includes(book.listingType);
      const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(book.genre);
      const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(book.language);
      const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(book.condition);
      const matchesPrice = !book.price || (book.price >= priceRange[0] && book.price <= priceRange[1]);
      
      return matchesSearch && matchesListingType && matchesGenre && matchesLanguage && matchesCondition && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return b.year - a.year;
      if (sortBy === "oldest") return a.year - b.year;
      if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const getListingTypeConfig = (type: string) => {
    const configs: Record<string, { label: string; icon: any; color: string }> = {
      sale: { label: "For Sale", icon: DollarSign, color: "bg-green-500/10 text-green-600 border-green-500/20" },
      swap: { label: "Swap", icon: RefreshCw, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
      share: { label: "Share Free", icon: Gift, color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
      borrow: { label: "Borrow", icon: BookCopy, color: "bg-orange-500/10 text-orange-600 border-orange-500/20" }
    };
    return configs[type];
  };

  const activeFilterCount = selectedListingTypes.length + selectedGenres.length + selectedLanguages.length + selectedConditions.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" />
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="deco-line mb-4" />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">
            Book <span className="text-gradient">Marketplace</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover books to buy, swap, borrow, or share
          </p>
        </div>

        {/* Search and Sort */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search books, authors, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-13 bg-card border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary/50"
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] h-12 bg-card border-border rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6 rounded-xl border-border"
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Active Filters Pills */}
        {activeFilterCount > 0 && (
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedListingTypes.map(type => (
              <Badge key={type} variant="secondary" className="gap-1.5">
                {getListingTypeConfig(type).label}
                <button onClick={() => toggleFilter("listingType", type)} className="hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {selectedGenres.map(genre => (
              <Badge key={genre} variant="secondary" className="gap-1.5">
                {genre}
                <button onClick={() => toggleFilter("genre", genre)} className="hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {selectedConditions.map(condition => (
              <Badge key={condition} variant="secondary" className="gap-1.5">
                {condition}
                <button onClick={() => toggleFilter("condition", condition)} className="hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-destructive">
              Clear all
            </Button>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 bg-card border border-border rounded-2xl p-6 animate-fade-in">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Listing Type */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-3 block">
                  Listing Type
                </Label>
                <div className="space-y-3">
                  {["sale", "swap", "share", "borrow"].map(type => {
                    const config = getListingTypeConfig(type);
                    return (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={selectedListingTypes.includes(type)}
                          onCheckedChange={() => toggleFilter("listingType", type)}
                        />
                        <label
                          htmlFor={`type-${type}`}
                          className="text-sm text-foreground cursor-pointer flex items-center gap-2"
                        >
                          <config.icon className="w-4 h-4" />
                          {config.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Genre */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-3 block">
                  Genre
                </Label>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {genres.map(genre => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={`genre-${genre}`}
                        checked={selectedGenres.includes(genre)}
                        onCheckedChange={() => toggleFilter("genre", genre)}
                      />
                      <label
                        htmlFor={`genre-${genre}`}
                        className="text-sm text-foreground cursor-pointer"
                      >
                        {genre}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-3 block">
                  Condition
                </Label>
                <div className="space-y-3">
                  {conditions.map(condition => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={`condition-${condition}`}
                        checked={selectedConditions.includes(condition)}
                        onCheckedChange={() => toggleFilter("condition", condition)}
                      />
                      <label
                        htmlFor={`condition-${condition}`}
                        className="text-sm text-foreground cursor-pointer"
                      >
                        {condition}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-3 block">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100}
                  step={5}
                  className="mt-4"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} found
        </div>

        {/* Books Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book, idx) => {
            const config = getListingTypeConfig(book.listingType);
            return (
              <div
                key={book.id}
                className="bg-card border border-border/30 rounded-2xl overflow-hidden hover-lift group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onClick={() => navigate(`/book/${book.id}`)}
                  />
                  
                  {/* Listing Type Badge */}
                  <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-lg border backdrop-blur-sm ${config.color} flex items-center gap-1.5`}>
                    <config.icon className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{config.label}</span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(book.id);
                    }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(book.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>

                  {/* Price Tag (for sale items) */}
                  {book.price && (
                    <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/95 backdrop-blur rounded-lg shadow-lg">
                      <span className="text-sm font-bold text-foreground">${book.price}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4" onClick={() => navigate(`/book/${book.id}`)}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-accent/30 text-primary rounded-full font-medium">
                      {book.genre}
                    </span>
                    <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                      {book.condition}
                    </span>
                  </div>
                  
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
                  
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-foreground">{book.rating}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
              No books found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button onClick={clearAllFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Marketplace;
