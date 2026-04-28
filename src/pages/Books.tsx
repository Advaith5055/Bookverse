import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search, Star, BookOpen, Heart, Plus, Award, Clock, Flame, Sparkles, TrendingUp, Compass, Moon, Coffee, Brain, Orbit, Activity, ChevronRight, BookMarked, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// ─── Synthetic Data ──────────────────────────────────────────
const allBooks = [
  { id: 1, title: "Dune", author: "Frank Herbert", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop", rating: 4.8, genre: "Science Fiction", year: 1965, readers: 124340, collection: "staff", dna: [0.9, 0.2, 0.4, 0.8, 0.1, 0.3], resonance: 98 },
  { id: 2, title: "1984", author: "George Orwell", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop", rating: 4.7, genre: "Dystopian", year: 1949, readers: 89120, collection: "award", dna: [0.2, 0.1, 0.8, 0.9, 0.1, 0.9], resonance: 92 },
  { id: 3, title: "Pride and Prejudice", author: "Jane Austen", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop", rating: 4.6, genre: "Romance", year: 1813, readers: 75890, collection: "staff", dna: [0.1, 0.9, 0.2, 0.6, 0.7, 0.2], resonance: 89 },
  { id: 4, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "https://images.unsplash.com/photo-1518734540-478beb8f0e8e?w=400&h=600&fit=crop", rating: 4.3, genre: "Classic", year: 1925, readers: 64560, collection: "award", dna: [0.2, 0.7, 0.5, 0.8, 0.4, 0.6], resonance: 84 },
  { id: 5, title: "To Kill a Mockingbird", author: "Harper Lee", cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop", rating: 4.8, genre: "Classic", year: 1960, readers: 98210, collection: "award", dna: [0.3, 0.2, 0.7, 0.8, 0.4, 0.6], resonance: 95 },
  { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", rating: 4.6, genre: "Fantasy", year: 1937, readers: 112780, collection: "staff", dna: [0.9, 0.2, 0.4, 0.5, 0.6, 0.2], resonance: 90 },
  { id: 7, title: "Brave New World", author: "Aldous Huxley", cover: "https://images.unsplash.com/photo-1614544048536-0d28caf77f41?w=400&h=600&fit=crop", rating: 4.4, genre: "Dystopian", year: 1932, readers: 54920, collection: "new", dna: [0.7, 0.2, 0.6, 0.9, 0.2, 0.7], resonance: 88 },
  { id: 8, title: "The Alchemist", author: "Paulo Coelho", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop", rating: 4.2, genre: "Fantasy", year: 1988, readers: 156100, collection: "new", dna: [0.6, 0.4, 0.8, 0.9, 0.3, 0.2], resonance: 94 },
  { id: 9, title: "Sapiens", author: "Yuval Noah Harari", cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop", rating: 4.5, genre: "Non-Fiction", year: 2011, readers: 87400, collection: "new", dna: [0.1, 0.1, 0.9, 0.9, 0.2, 0.2], resonance: 86 },
];

const genres = ["All", "Science Fiction", "Fantasy", "Romance", "Classic", "Dystopian", "Non-Fiction", "Mystery"];

const moods = [
  { icon: Sparkles, label: "Adventure", genres: ["Fantasy", "Science Fiction"], color: "text-purple-400", bg: "bg-purple-500", border: "border-purple-500/30" },
  { icon: Brain, label: "Learning", genres: ["Non-Fiction"], color: "text-blue-400", bg: "bg-blue-500", border: "border-blue-500/30" },
  { icon: Heart, label: "Romance", genres: ["Romance"], color: "text-pink-400", bg: "bg-pink-500", border: "border-pink-500/30" },
  { icon: Moon, label: "Darkness", genres: ["Dystopian", "Mystery"], color: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500/30" },
  { icon: Coffee, label: "Cozy", genres: ["Classic"], color: "text-amber-400", bg: "bg-amber-500", border: "border-amber-500/30" },
];

const collections = [
  { id: "all", label: "Sector Database", icon: Compass },
  { id: "staff", label: "Oracle Picks", icon: Sparkles },
  { id: "award", label: "Hall of Fame", icon: Crown },
  { id: "new", label: "Incoming Transmissions", icon: Zap },
];

// Helper to access Crown statically
import { Crown } from "lucide-react";

// ─── Book DNA Radar Chart ─────────────────────────────────────
const BookDNA = ({ themes, size = 60 }: { themes: number[]; size?: number }) => {
  const labels = ["ADV", "ROM", "MYS", "PHI", "HUM", "DRK"];
  const cx = 50, cy = 50, r = 40;
  const n = themes.length;

  const getPoint = (val: number, i: number) => {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * r * val,
      y: cy + Math.sin(angle) * r * val,
    };
  };

  const points = themes.map((val, i) => getPoint(val, i));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <div className="book-dna-container relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(240,160,48,0.3)]">
        {/* Grid rings */}
        {[0.5, 1].map((scale, si) => (
          <polygon
            key={si}
            points={Array.from({ length: n }).map((_, i) => {
              const p = getPoint(scale, i);
              return `${p.x},${p.y}`;
            }).join(" ")}
            fill="none"
            stroke="rgba(240, 160, 48, 0.15)"
            strokeWidth="0.5"
          />
        ))}
        {/* Axis lines */}
        {themes.map((_, i) => {
          const p = getPoint(1, i);
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(240, 160, 48, 0.1)" strokeWidth="0.5" />;
        })}
        {/* Data shape */}
        <path d={pathD} fill="rgba(240, 160, 48, 0.3)" stroke="rgba(240, 160, 48, 0.8)" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Labels */}
        {themes.map((_, i) => {
          const p = getPoint(1.2, i);
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fill="rgba(255, 255, 255, 0.6)" fontSize="6" fontWeight="600" className="tracking-tighter">
              {labels[i]}
            </text>
          );
        })}
      </svg>
    </div>
  );
};


const Books = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  
  const headerAnim = useScrollAnimation();
  const filtersAnim = useScrollAnimation({ threshold: 0.1 });

  const toggleFavorite = (bookId: number) => {
    setFavorites((prev) => prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]);
  };

  useEffect(() => {
    // Artificial delay to show sleek loading state
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [selectedCollection, selectedGenre, selectedMood]); // Re-trigger loading on filter change to feel like a "search"

  // Apply mood filter
  const moodGenres = selectedMood !== null ? moods[selectedMood].genres : [];

  const filteredBooks = allBooks.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "All" || book.genre === selectedGenre;
    const matchesCollection = selectedCollection === "all" || book.collection === selectedCollection;
    const matchesMood = moodGenres.length === 0 || moodGenres.includes(book.genre);
    return matchesSearch && matchesGenre && matchesCollection && matchesMood;
  });

  const clearMood = () => {
    setSelectedMood(null);
    setSelectedGenre("All");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="noise-overlay z-0" />
      
      {/* Mystical Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
          {/* Header */}
          <div 
            ref={headerAnim.ref}
            className={`mb-12 text-center max-w-3xl mx-auto transition-all duration-700 ${headerAnim.isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(240,160,48,0.15)] animate-pulse">
              <Orbit className="w-3.5 h-3.5" />
              Library Archive
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Explore The <span className="text-gradient-cosmic">Database</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Scan the cosmos for new frequencies. Filter by atmospheric conditions, structural coordinates, or direct query.
            </p>
          </div>

          {/* Search Bar (Giant Cosmic Style) */}
          <div className="max-w-3xl mx-auto mb-12 relative group animate-fade-in-up">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <div className="relative glass-panel rounded-2xl flex items-center p-2 bg-background/60 backdrop-blur-xl border border-border/50">
              <Search className="w-6 h-6 text-primary ml-4 mr-2" />
              <Input
                type="text"
                placeholder="Search by title, author, or coordinate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 bg-transparent border-none focus-visible:ring-0 text-lg text-foreground placeholder:text-muted-foreground/50 shadow-none px-2"
              />
              <Button onClick={() => navigate("/add-book")} className="h-12 px-6 btn-gradient rounded-xl whitespace-nowrap ml-2">
                <Plus className="w-5 h-5 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Add Entry</span>
              </Button>
            </div>
          </div>

          <div 
            ref={filtersAnim.ref}
            className={`transition-all duration-1000 delay-200 ${filtersAnim.isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            {/* Atmosphere (Mood) Filters */}
            <div className="mb-10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" /> Atmospheric Conditions
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={clearMood}
                  className={`px-5 py-3 rounded-2xl text-sm font-bold tracking-wide transition-all ${
                    selectedMood === null
                      ? "bg-foreground text-background shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                      : "card-cosmic text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Any Atmosphere
                </button>
                {moods.map((mood, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedMood(idx === selectedMood ? null : idx);
                      setSelectedGenre("All");
                    }}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold tracking-wide transition-all border ${
                      selectedMood === idx
                        ? `${mood.bg}/20 ${mood.border} ${mood.color} shadow-[0_0_20px_rgba(var(--primary),0.15)]`
                        : "border-border/30 bg-card/40 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-border/60"
                    }`}
                  >
                    <mood.icon className={`w-4 h-4 ${selectedMood === idx ? mood.color : "opacity-60"}`} />
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Filters: Collections & Genres */}
            <div className="flex flex-col lg:flex-row gap-6 mb-10 justify-between">
              {/* Collections */}
              <div className="flex-1">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-right">
                  {collections.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => setSelectedCollection(col.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl whitespace-nowrap transition-all text-sm font-semibold ${
                        selectedCollection === col.id
                          ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                          : "bg-card/30 border border-border/30 text-muted-foreground hover:text-foreground hover:bg-card/50"
                      }`}
                    >
                      <col.icon className={`w-4 h-4 ${selectedCollection === col.id ? "text-primary" : ""}`} />
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genres */}
              <div className="flex-1">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-right lg:justify-end">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => { setSelectedGenre(genre); setSelectedMood(null); }}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all text-xs font-semibold uppercase tracking-wider ${
                        selectedGenre === genre
                          ? "bg-foreground text-background"
                          : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/20">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-primary" />
              {filteredBooks.length} {filteredBooks.length === 1 ? "Signal" : "Signals"} Detected
            </p>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span>Sort by:</span>
              <span className="text-primary font-semibold cursor-pointer flex items-center">Resonance <ChevronRight className="w-3 h-3 ml-0.5" /></span>
            </div>
          </div>

          {/* Books Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-cosmic p-4 rounded-3xl overflow-hidden flex gap-4">
                  <Skeleton className="w-32 h-48 rounded-2xl bg-muted/20" />
                  <div className="flex-1 space-y-4 py-2">
                    <Skeleton className="h-6 w-3/4 bg-muted/20" />
                    <Skeleton className="h-4 w-1/2 bg-muted/20" />
                    <div className="pt-4 space-y-2">
                      <Skeleton className="h-3 w-full bg-muted/20" />
                      <Skeleton className="h-3 w-4/5 bg-muted/20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="card-cosmic p-16 text-center max-w-2xl mx-auto rounded-3xl">
              <div className="w-20 h-20 bg-background/50 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-xl mb-6 mx-auto">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-3">No Signals Found</h3>
              <p className="text-muted-foreground text-lg mb-6">Shift your orbital sensors or clear current filters to find new coordinates.</p>
              <Button onClick={() => { setSelectedGenre("All"); setSelectedCollection("all"); setSelectedMood(null); setSearchQuery(""); }} className="btn-outline-glow rounded-xl">
                Reset Scanners
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pb-20">
              {filteredBooks.map((book, idx) => (
                <div 
                  key={book.id} 
                  className="card-cosmic rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(var(--primary),0.15)] flex animate-fade-in-up border border-border/30 hover:border-primary/40 relative cursor-pointer" 
                  style={{ animationDelay: `${idx * 100}ms` }}
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  {/* Decorative background pulse for high resonance books */}
                  {book.resonance > 90 && (
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  )}

                  <div className="w-2/5 p-4 relative z-10 flex flex-col items-center border-r border-border/10 bg-background/20 backdrop-blur-sm">
                    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500 mb-4">
                      <img src={book.cover} alt={book.title} className="w-full h-auto aspect-[2/3] object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/10 to-transparent opacity-80" />
                      
                      {/* Floating interaction button */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(book.id); }}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors border border-white/10"
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(book.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
                      </button>
                    </div>

                    {/* Book DNA Mini View */}
                    <div className="w-full flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity mt-auto pb-1 transform group-hover:scale-110">
                      <BookDNA themes={book.dna} size={70} />
                    </div>
                  </div>

                  <div className="w-3/5 p-5 flex flex-col relative z-10">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                        {book.genre}
                      </span>
                      {book.collection === "staff" && <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" title="Oracle Pick"/>}
                      {book.collection === "award" && <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" title="Hall of Fame"/>}
                      {book.collection === "new" && <Zap className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" title="New Arrival"/>}
                    </div>

                    <h3 className="font-heading text-xl font-bold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-semibold mb-4">{book.author} <span className="opacity-50 mx-1">•</span> {book.year}</p>

                    <div className="space-y-3 mt-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold text-foreground">{book.rating}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-foreground">{book.resonance}%</span>
                          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Resonance</span>
                        </div>
                      </div>

                      <div className="h-1 w-full bg-muted/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000" style={{ width: `${book.resonance}%` }} />
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                        <Activity className="w-3 h-3 opacity-70" />
                        <span>{(book.readers / 1000).toFixed(1)}k readers</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;
