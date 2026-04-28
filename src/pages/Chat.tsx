import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, BookOpen, TrendingUp, Lightbulb, MessageCircle, Star, Terminal, Hexagon, Zap, Compass, Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface BookRec {
  title: string;
  author: string;
  rating: number;
  match: number;
  tags: string[];
}

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  books?: BookRec[];
  actionLink?: string;
  actionText?: string;
}

const suggestedQuestions = [
  { icon: Compass, text: "I need an epic fantasy that will ruin my sleep schedule" },
  { icon: Search, text: "Find books similar to Dune but with more politics" },
  { icon: TrendingUp, text: "What's the community obsessed with this week?" },
  { icon: Users, text: "Suggest a controversial book for my next club meeting" },
];

// Helper to access lucide icon statically
import { Users } from "lucide-react";

// Smart responses based on keywords
const getSmartResponse = (input: string): { text: string; books?: BookRec[]; actionLink?: string; actionText?: string } => {
  const lower = input.toLowerCase();

  if (lower.includes("sci-fi") || lower.includes("science fiction") || lower.includes("dune")) {
    return {
      text: "Analyzing the science fiction continuum... I've isolated three exceptional coordinates that match your criteria. These titles feature intricate world-building and profound speculative themes:",
      books: [
        { title: "Dune", author: "Frank Herbert", rating: 4.8, match: 98, tags: ["Politics", "Epic", "Desert Planet"] },
        { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", rating: 4.7, match: 92, tags: ["Social Sci-Fi", "Gender", "Journey"] },
        { title: "Foundation", author: "Isaac Asimov", rating: 4.6, match: 89, tags: ["Empire", "Psychohistory", "Classic"] },
      ],
    };
  }

  if (lower.includes("trending") || lower.includes("popular") || lower.includes("obsessed")) {
    return {
      text: "Accessing real-time community pulse... The following titles are experiencing massive reading surges across the BookVerse network this week:",
      books: [
        { title: "Project Hail Mary", author: "Andy Weir", rating: 4.9, match: 99, tags: ["Space Survival", "Science", "Humor"] },
        { title: "Fourth Wing", author: "Rebecca Yarros", rating: 4.7, match: 95, tags: ["Dragons", "Romance", "War College"] },
        { title: "Tomorrow, and Tomorrow, and Tomorrow", author: "Gabrielle Zevin", rating: 4.5, match: 88, tags: ["Gaming", "Friendship", "Modern"] },
      ],
    };
  }

  if (lower.includes("fantasy") || lower.includes("magic") || lower.includes("sleep")) {
    return {
      text: "Warning: The following magical realms have a high probability of inducing late-night reading binges. Proceed with caution:",
      books: [
        { title: "The Name of the Wind", author: "Patrick Rothfuss", rating: 4.8, match: 97, tags: ["Music", "Magic School", "Tragedy"] },
        { title: "The Way of Kings", author: "Brandon Sanderson", rating: 4.9, match: 96, tags: ["Epic", "Storms", "Knights"] },
        { title: "The Fifth Season", author: "N.K. Jemisin", rating: 4.6, match: 91, tags: ["Earthquakes", "Oppression", "Award-Winner"] },
      ],
    };
  }

  if (lower.includes("club") || lower.includes("book club") || lower.includes("controversial")) {
    return {
      text: "Compiling discussion catalysts... These books are guaranteed to spark passionate debate and divided opinions at your next gathering:",
      books: [
        { title: "The Secret History", author: "Donna Tartt", rating: 4.4, match: 94, tags: ["Dark Academia", "Murder", "Classics"] },
        { title: "My Year of Rest and Relaxation", author: "Ottessa Moshfegh", rating: 3.9, match: 87, tags: ["Unlikable Protagonist", "Satire", "Mental Health"] },
        { title: "Yellowface", author: "R.F. Kuang", rating: 4.3, match: 91, tags: ["Publishing", "Race", "Thriller"] },
      ],
    };
  }

  return {
    text: "I am recalibrating my sensors to your request. Based on your unique reading DNA and current community vectors, I recommend exploring our curated constellation maps. Shall I plot a course?",
    actionLink: "/discover",
    actionText: "Open Constellation Map"
  };
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Greetings, traveler. I am The Oracle, your AI literary navigator. My neural pathways are connected to the BookVerse continuum. Tell me your desires, your moods, or your favorite worlds, and I shall chart your next reading expedition.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const headerAnim = useScrollAnimation();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate thinking with artificial delay based on complexity
    setTimeout(() => {
      const response = getSmartResponse(messageText);
      const botMessage: Message = {
        id: messages.length + 2,
        text: response.text,
        isBot: true,
        timestamp: new Date(),
        books: response.books,
        actionLink: response.actionLink,
        actionText: response.actionText
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  // Oracle animated core component
  const OracleCore = ({ pulsing = false }: { pulsing?: boolean }) => (
    <div className="relative flex items-center justify-center w-10 h-10">
      <div className={`absolute inset-0 rounded-full bg-primary/20 ${pulsing ? 'animate-ping' : ''}`} style={{ animationDuration: '3s' }} />
      <div className={`absolute inset-1 rounded-full bg-gradient-to-tr from-primary to-purple-500 opacity-50 ${pulsing ? 'animate-pulse' : ''}`} />
      <Hexagon className={`w-5 h-5 text-primary-foreground relative z-10 ${pulsing ? 'animate-spin-slow' : ''}`} />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="noise-overlay z-0" />
      
      {/* Mystical Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen" />
        {/* Giant faint oracle ring */}
        <div className="absolute w-[800px] h-[800px] border border-primary/5 rounded-full animate-spin-slow" style={{ animationDuration: '60s' }} />
        <div className="absolute w-[600px] h-[600px] border border-purple-500/5 rounded-full animate-spin-slow" style={{ animationDuration: '45s', animationDirection: 'reverse' }} />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        <Navigation />

        <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-[calc(100vh-80px)]">
          {/* Header */}
          <div 
            ref={headerAnim.ref}
            className={`mb-6 text-center transform transition-all duration-700 ${headerAnim.isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
              <Sparkles className="w-3 h-3" />
              Online & Listening
            </div>
            <h1 className="font-heading text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
              The <span className="text-gradient-cosmic">Oracle</span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Tap into the collective intelligence of the Literary Cosmos.
            </p>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-6 pr-2 scrollbar-thin">
            {/* Suggested Questions (only show initially) */}
            {messages.length <= 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 px-2 mt-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q.text)}
                    className="flex items-center gap-3 p-4 rounded-2xl glass-panel text-left text-sm text-foreground/80 hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all group hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(var(--primary),0.15)]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <q.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{q.text}</span>
                  </button>
                ))}
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.isBot ? "" : "flex-row-reverse"} animate-fade-in-up`}
                style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 mt-1">
                  {message.isBot ? (
                    <OracleCore />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                      <Terminal className="w-5 h-5 text-amber-500" />
                    </div>
                  )}
                </div>

                {/* Message Body */}
                <div className={`max-w-[85%] sm:max-w-[75%] space-y-4 ${message.isBot ? '' : 'flex flex-col items-end'}`}>
                  
                  {/* Speech Bubble */}
                  <div className={`p-4 sm:p-5 rounded-2xl md:rounded-3xl relative overflow-hidden group ${
                    message.isBot 
                      ? "glass-panel rounded-tl-none border-primary/20 bg-background/40 backdrop-blur-md" 
                      : "bg-gradient-to-br from-amber-500/10 to-orange-500/5 text-amber-50/90 rounded-tr-none border border-amber-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                  }`}>
                    {/* Bot inner glow */}
                    {message.isBot && <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />}
                    
                    <p className={`relative z-10 leading-relaxed ${message.isBot ? 'text-[15px] text-foreground/90 font-medium' : 'text-[15px]'}`}>
                      {message.text}
                    </p>
                  </div>

                  {/* Recommendations Cards */}
                  {message.books && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 w-full">
                      {message.books.map((book, i) => (
                        <div 
                          key={i} 
                          className="card-cosmic p-4 rounded-2xl flex flex-col gap-3 group cursor-pointer hover:-translate-y-1 transition-all duration-300"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0 pr-3">
                              <h4 className="font-bold text-foreground truncate group-hover:text-primary transition-colors text-base">{book.title}</h4>
                              <p className="text-xs text-muted-foreground truncate font-medium">{book.author}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                              <Zap className="w-3 h-3 text-primary fill-primary" />
                              <span className="text-xs font-bold text-primary">{book.match}%</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5 mt-auto">
                            {book.tags.slice(0, 2).map((tag, tIdx) => (
                              <span key={tIdx} className="text-[10px] uppercase tracking-wider font-semibold bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                            <div className="flex items-center gap-1 ml-auto">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-xs font-bold text-foreground/80">{book.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Link */}
                  {message.actionLink && message.actionText && (
                    <Button 
                      variant="outline" 
                      className="mt-2 btn-outline-glow rounded-xl border-primary/30 text-primary hover:bg-primary/10 w-auto"
                      onClick={() => window.location.href = message.actionLink!}
                    >
                      {message.actionText}
                    </Button>
                  )}

                  <span className={`text-[10px] font-medium tracking-wider text-muted-foreground/50 block mt-1 ${message.isBot ? 'text-left ml-2' : 'text-right mr-2'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {isTyping && (
              <div className="flex gap-4 animate-fade-in-up">
                <div className="flex-shrink-0 mt-1">
                  <OracleCore pulsing={true} />
                </div>
                <div className="glass-panel p-4 rounded-3xl rounded-tl-none border-primary/20 w-auto inline-flex items-center gap-3 backdrop-blur-md">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary/70">Synthesizing</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0ms", animationDuration: '800ms' }} />
                    <div className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-pulse" style={{ animationDelay: "200ms", animationDuration: '800ms' }} />
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: "400ms", animationDuration: '800ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} className="h-4" />
          </div>

          {/* Input Area */}
          <div className="relative mt-2 animate-fade-in-up">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative glass-panel rounded-2xl p-2 flex gap-2 items-center bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl overflow-hidden">
              {/* Decorative inner glow line */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              
              <Input
                type="text"
                placeholder="Ask The Oracle for coordinates to your next book..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="h-12 bg-transparent border-none rounded-xl flex-1 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 px-4 font-medium text-base shadow-none"
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSend()}
                disabled={isTyping || !inputValue.trim()}
                className={`h-12 w-12 p-0 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg ${
                  inputValue.trim() 
                    ? "bg-gradient-to-br from-primary to-purple-600 hover:scale-105 hover:shadow-[0_0_20px_rgba(var(--primary),0.4)]" 
                    : "bg-muted/50 text-muted-foreground border border-border/50"
                }`}
              >
                <Send className="w-5 h-5 ml-0.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
