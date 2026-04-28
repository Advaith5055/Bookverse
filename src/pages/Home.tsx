import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  MessageCircle,
  TrendingUp,
  Star,
  Search,
  Heart,
  ArrowRight,
  Sparkles,
  Zap,
  ChevronRight,
  Quote,
  Trophy,
  Flame,
  Target,
  Clock,
  ChevronLeft,
  BookMarked,
  Crown,
  Cloud,
  Sun,
  Compass,
  Orbit,
  Activity,
  Globe,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Starfield Canvas ─────────────────────────────────────────
const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const stars: Array<{
      x: number; y: number; size: number;
      opacity: number; twinkleSpeed: number; hue: number;
    }> = [];
    let shootingStars: Array<{
      x: number; y: number; vx: number; vy: number;
      life: number; tail: Array<{ x: number; y: number }>;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const numStars = Math.min(250, Math.floor((canvas.width * canvas.height) / 5000));
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.003,
        hue: Math.random() > 0.7 ? 32 : Math.random() > 0.5 ? 220 : 270,
      });
    }

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      for (const star of stars) {
        const twinkle = Math.sin(frame * star.twinkleSpeed) * 0.4 + 0.6;
        const finalOpacity = star.opacity * twinkle;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        if (star.hue === 32) {
          ctx.fillStyle = `hsla(32, 95%, 72%, ${finalOpacity})`;
        } else if (star.hue === 220) {
          ctx.fillStyle = `hsla(220, 80%, 75%, ${finalOpacity * 0.6})`;
        } else {
          ctx.fillStyle = `hsla(270, 70%, 75%, ${finalOpacity * 0.5})`;
        }
        ctx.fill();

        // Glow for larger stars
        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(32, 95%, 62%, ${finalOpacity * 0.08})`;
          ctx.fill();
        }
      }

      // Shooting stars
      if (Math.random() < 0.003 && shootingStars.length < 2) {
        const startX = Math.random() * canvas.width;
        shootingStars.push({
          x: startX, y: 0,
          vx: (Math.random() - 0.3) * 3,
          vy: Math.random() * 4 + 3,
          life: 1,
          tail: [],
        });
      }

      for (const ss of shootingStars) {
        ss.tail.push({ x: ss.x, y: ss.y });
        if (ss.tail.length > 15) ss.tail.shift();
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= 0.012;

        // Draw tail
        for (let i = 0; i < ss.tail.length; i++) {
          const t = ss.tail[i];
          const alpha = (i / ss.tail.length) * ss.life * 0.4;
          const radius = (i / ss.tail.length) * 1.5;
          ctx.beginPath();
          ctx.arc(t.x, t.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(32, 95%, 72%, ${alpha})`;
          ctx.fill();
        }

        // Head glow
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(32, 95%, 82%, ${ss.life * 0.8})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(32, 95%, 62%, ${ss.life * 0.15})`;
        ctx.fill();
      }
      shootingStars = shootingStars.filter(ss => ss.life > 0);

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield-canvas" />;
};

// ─── Book DNA Radar Chart ─────────────────────────────────────
const BookDNA = ({ themes, size = 80 }: { themes: number[]; size?: number }) => {
  const labels = ["ADV", "ROM", "MYS", "PHI", "HUM", "DRK"];
  const cx = 50, cy = 50, r = 38;
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
    <div className="book-dna-container" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="book-dna-chart w-full h-full">
        {/* Grid rings */}
        {[0.33, 0.66, 1].map((scale, si) => (
          <polygon
            key={si}
            points={Array.from({ length: n }).map((_, i) => {
              const p = getPoint(scale, i);
              return `${p.x},${p.y}`;
            }).join(" ")}
            fill="none"
            stroke="rgba(240, 160, 48, 0.08)"
            strokeWidth="0.5"
          />
        ))}
        {/* Axis lines */}
        {themes.map((_, i) => {
          const p = getPoint(1, i);
          return (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={p.x} y2={p.y}
              stroke="rgba(240, 160, 48, 0.06)"
              strokeWidth="0.5"
            />
          );
        })}
        {/* Pulse ring */}
        <circle cx={cx} cy={cy} r={35} fill="none" stroke="rgba(240, 160, 48, 0.05)" strokeWidth="0.5" className="dna-pulse-ring" />
        {/* Data shape */}
        <path d={pathD} fill="rgba(240, 160, 48, 0.12)" stroke="rgba(240, 160, 48, 0.5)" strokeWidth="1" strokeLinejoin="round" />
        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2" fill="hsl(32, 95%, 62%)" opacity="0.8" />
        ))}
        {/* Labels */}
        {themes.map((_, i) => {
          const p = getPoint(1.25, i);
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fill="rgba(240, 160, 48, 0.35)" fontSize="5" fontWeight="600">
              {labels[i]}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// ─── Reading Pulse Waveform ───────────────────────────────────
const ReadingPulse = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let frame = 0;
    const animate = () => {
      frame++;
      setOffset(frame);
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  const generatePath = () => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = i;
      const y = 50 +
        Math.sin((i + offset * 0.5) * 0.08) * 18 +
        Math.sin((i + offset * 0.3) * 0.04) * 12 +
        Math.sin((i + offset * 0.8) * 0.12) * 6;
      pts.push(`${x},${y}`);
    }
    return `M ${pts.join(" L ")}`;
  };

  const generatePath2 = () => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = i;
      const y = 50 +
        Math.sin((i + offset * 0.4 + 30) * 0.06) * 14 +
        Math.sin((i + offset * 0.2 + 60) * 0.05) * 10;
      pts.push(`${x},${y}`);
    }
    return `M ${pts.join(" L ")}`;
  };

  return (
    <div className="reading-pulse-container w-full h-24 relative">
      <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pulseGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(32, 95%, 62%)" stopOpacity="0" />
            <stop offset="30%" stopColor="hsl(32, 95%, 62%)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="hsl(32, 95%, 62%)" stopOpacity="1" />
            <stop offset="70%" stopColor="hsl(32, 95%, 62%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(32, 95%, 62%)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="pulseGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(270, 70%, 55%)" stopOpacity="0" />
            <stop offset="40%" stopColor="hsl(270, 70%, 55%)" stopOpacity="0.3" />
            <stop offset="60%" stopColor="hsl(270, 70%, 55%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(270, 70%, 55%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Background glow */}
        <path d={generatePath()} fill="none" stroke="url(#pulseGrad2)" strokeWidth="3" opacity="0.3" />
        {/* Main pulse */}
        <path d={generatePath()} fill="none" stroke="url(#pulseGrad1)" strokeWidth="1" />
        {/* Secondary pulse */}
        <path d={generatePath2()} fill="none" stroke="url(#pulseGrad2)" strokeWidth="0.5" opacity="0.5" />
      </svg>
    </div>
  );
};

// ─── Animated counter ─────────────────────────────────────────────
const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 2000;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="count-up">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

// ─── Genre Constellation Map ──────────────────────────────────
const genreNodes = [
  { name: "Sci-Fi", x: 18, y: 28, size: 42, connections: [1, 4], color: "hsl(220, 80%, 60%)" },
  { name: "Fantasy", x: 35, y: 15, size: 48, connections: [0, 2, 5], color: "hsl(270, 70%, 55%)" },
  { name: "Romance", x: 58, y: 22, size: 38, connections: [1, 3], color: "hsl(340, 80%, 60%)" },
  { name: "Mystery", x: 78, y: 32, size: 36, connections: [2, 4], color: "hsl(180, 60%, 50%)" },
  { name: "Thriller", x: 65, y: 55, size: 34, connections: [0, 3, 5], color: "hsl(0, 70%, 55%)" },
  { name: "Classic", x: 25, y: 58, size: 40, connections: [1, 4], color: "hsl(43, 96%, 58%)" },
  { name: "Non-Fiction", x: 48, y: 70, size: 36, connections: [3, 5], color: "hsl(140, 60%, 50%)" },
  { name: "Biography", x: 82, y: 65, size: 30, connections: [3, 6], color: "hsl(20, 70%, 55%)" },
  { name: "Philosophy", x: 12, y: 72, size: 28, connections: [5, 6], color: "hsl(260, 50%, 60%)" },
];

const ConstellationMap = ({ onGenreClick }: { onGenreClick: (genre: string) => void }) => {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate line between two nodes
  const getLine = (i: number, j: number) => {
    const a = genreNodes[i];
    const b = genreNodes[j];
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  };

  // Collect all unique edges
  const edges: Array<{ from: number; to: number }> = [];
  genreNodes.forEach((node, i) => {
    node.connections.forEach(j => {
      if (i < j) edges.push({ from: i, to: j });
    });
  });

  return (
    <div ref={containerRef} className="relative w-full h-[350px] md:h-[400px]">
      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map((edge, idx) => {
          const line = getLine(edge.from, edge.to);
          const isHighlighted = hoveredNode === edge.from || hoveredNode === edge.to;
          return (
            <line
              key={idx}
              x1={`${line.x1}%`} y1={`${line.y1}%`}
              x2={`${line.x2}%`} y2={`${line.y2}%`}
              stroke={isHighlighted ? "hsl(32, 95%, 62%)" : "hsl(32, 95%, 62%)"}
              strokeWidth={isHighlighted ? "0.3" : "0.15"}
              opacity={isHighlighted ? 0.6 : 0.15}
              style={{ transition: "all 0.3s ease" }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {genreNodes.map((node, i) => (
        <div
          key={i}
          className="constellation-node"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          onMouseEnter={() => setHoveredNode(i)}
          onMouseLeave={() => setHoveredNode(null)}
          onClick={() => onGenreClick(node.name)}
        >
          <div
            className={`constellation-node-inner ${hoveredNode === i ? 'active' : ''}`}
            style={{
              width: node.size,
              height: node.size,
              ['--twinkle-speed' as string]: `${2 + Math.random() * 3}s`,
              background: hoveredNode === i
                ? `radial-gradient(circle, ${node.color} 0%, ${node.color}66 50%, transparent 80%)`
                : undefined,
              boxShadow: hoveredNode === i
                ? `0 0 25px ${node.color}88, 0 0 60px ${node.color}33`
                : undefined,
            }}
          >
            {hoveredNode === i && (
              <span className="text-[9px] font-bold text-white/90 text-center leading-tight px-1">
                {node.name}
              </span>
            )}
          </div>
          {/* Label */}
          <span
            className="constellation-label"
            style={{
              left: '50%',
              top: `calc(100% + 6px)`,
              transform: 'translateX(-50%)',
              color: hoveredNode === i ? node.color : undefined,
              opacity: hoveredNode === i ? 1 : 0.4,
            }}
          >
            {node.name}
          </span>
        </div>
      ))}

      {/* Background scatter stars */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={`scatter-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            background: `hsl(32, 95%, 72%)`,
            opacity: Math.random() * 0.2 + 0.05,
            animation: `star-twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

// ─── Weather Icon Component ───────────────────────────────────
const WeatherIcon = ({ mood }: { mood: string }) => {
  const icons: Record<string, typeof Sun> = {
    adventurous: Compass,
    romantic: Heart,
    thrilling: Flame,
    intellectual: Globe,
    cozy: Cloud,
  };
  const Icon = icons[mood] || Sun;
  return <Icon className="w-8 h-8 weather-icon-float" />;
};

// ─── Data ─────────────────────────────────────────────────────────

const trendingBooks = [
  {
    id: 1, title: "Dune", author: "Frank Herbert",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop",
    rating: 4.5, genre: "Sci-Fi", readers: 2340,
    dna: [0.95, 0.15, 0.4, 0.85, 0.2, 0.65],
  },
  {
    id: 2, title: "1984", author: "George Orwell",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
    rating: 4.7, genre: "Dystopian", readers: 3120,
    dna: [0.3, 0.1, 0.5, 0.9, 0.1, 0.95],
  },
  {
    id: 3, title: "Pride and Prejudice", author: "Jane Austen",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    rating: 4.6, genre: "Romance", readers: 1890,
    dna: [0.2, 0.95, 0.3, 0.6, 0.7, 0.1],
  },
  {
    id: 4, title: "The Great Gatsby", author: "F. Scott Fitzgerald",
    cover: "https://images.unsplash.com/photo-1518734540-478beb8f0e8e?w=300&h=450&fit=crop",
    rating: 4.3, genre: "Classic", readers: 1560,
    dna: [0.4, 0.7, 0.5, 0.8, 0.3, 0.6],
  },
  {
    id: 5, title: "To Kill a Mockingbird", author: "Harper Lee",
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=450&fit=crop",
    rating: 4.8, genre: "Classic", readers: 4210,
    dna: [0.5, 0.3, 0.6, 0.85, 0.4, 0.45],
  },
  {
    id: 6, title: "The Hobbit", author: "J.R.R. Tolkien",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop",
    rating: 4.6, genre: "Fantasy", readers: 2780,
    dna: [0.95, 0.3, 0.4, 0.5, 0.7, 0.35],
  },
];

const bookClubs = [
  {
    name: "Sci-Fi Explorers", members: 1420, currentBook: "Project Hail Mary",
    avatar: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop",
    gradient: "from-blue-500/20 to-purple-500/20",
  },
  {
    name: "Classic Lit Society", members: 890, currentBook: "Anna Karenina",
    avatar: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop",
    gradient: "from-amber-500/20 to-red-500/20",
  },
  {
    name: "Mystery & Thriller", members: 2100, currentBook: "The Silent Patient",
    avatar: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=100&h=100&fit=crop",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
];

const readingChallenges = [
  { title: "Summer Reading Sprint", books: 10, participants: 5200, daysLeft: 42, icon: Flame, color: "text-orange-400" },
  { title: "Around the World", books: 12, participants: 3100, daysLeft: 120, icon: Target, color: "text-emerald-400" },
  { title: "Genre Explorer", books: 8, participants: 4500, daysLeft: 60, icon: BookMarked, color: "text-blue-400" },
];

const literaryWeather = [
  {
    mood: "adventurous",
    title: "Adventurous & Bold",
    description: "Readers are diving into epics",
    genre: "Fantasy & Sci-Fi surging",
    color: "text-amber-400",
    bg: "weather-effect-sunny",
    activeReaders: 1247,
  },
  {
    mood: "thrilling",
    title: "Dark & Thrilling",
    description: "Mystery is in the air tonight",
    genre: "Thriller & Mystery trending",
    color: "text-purple-400",
    bg: "weather-effect-stormy",
    activeReaders: 892,
  },
  {
    mood: "romantic",
    title: "Warm & Romantic",
    description: "Love stories capturing hearts",
    genre: "Romance at an all-time high",
    color: "text-pink-400",
    bg: "weather-effect-misty",
    activeReaders: 634,
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Avid Reader · 142 books read",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    text: "BookVerse transformed how I discover books. The reading challenges keep me motivated and the community discussions are incredible — I've found my literary tribe!",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Book Club Leader · Sci-Fi Explorers",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    text: "Running a book club here is seamless. The constellation map helped me find genres I never knew I'd love. The Book DNA feature is genuinely addictive.",
    rating: 5,
  },
  {
    name: "Emily Roberts",
    role: "Literature Teacher · 12-week streak",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    text: "I use BookVerse with my students. The reading pulse shows our class activity in real-time. It's become an essential teaching tool and the kids love the gamification.",
    rating: 5,
  },
];

const howItWorks = [
  { step: "01", title: "Chart Your Course", description: "Set reading preferences, map your literary DNA, and calibrate your cosmic compass", icon: Compass },
  { step: "02", title: "Navigate the Cosmos", description: "Explore the constellation map, discover books through AI, and join reading expeditions", icon: Search },
  { step: "03", title: "Read & Ascend", description: "Track your voyage, earn stellar badges, light up your constellation, and level up", icon: Trophy },
  { step: "04", title: "Connect & Trade", description: "Dock at community stations, share reviews, and trade in the marketplace", icon: Zap },
];

// ─── Component ────────────────────────────────────────────────────

const Home = () => {
  const navigate = useNavigate();
  const featuresAnimation = useScrollAnimation();
  const statsAnimation = useScrollAnimation();
  const ctaAnimation = useScrollAnimation();
  const testimonialsAnimation = useScrollAnimation();
  const howItWorksAnimation = useScrollAnimation();
  const trendingAnimation = useScrollAnimation();
  const clubsAnimation = useScrollAnimation();
  const challengesAnimation = useScrollAnimation();
  const botdAnimation = useScrollAnimation();
  const constellationAnimation = useScrollAnimation();
  const weatherAnimation = useScrollAnimation();
  const pulseAnimation = useScrollAnimation();

  // Parallax mouse tracking
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Trending carousel
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollCarousel = (dir: "left" | "right") => {
    if (carouselRef.current) {
      const amount = 320;
      carouselRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  // Weather rotation
  const [activeWeather, setActiveWeather] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWeather(prev => (prev + 1) % literaryWeather.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Book of the Day
  const botd = {
    title: "Project Hail Mary",
    author: "Andy Weir",
    cover: "https://images.unsplash.com/photo-1614544048536-0d28caf77f41?w=500&h=750&fit=crop",
    rating: 4.9,
    genre: "Science Fiction",
    description: "Ryland Grace is the sole survivor on a desperate, last-chance mission — and if he fails, humanity and the earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name...",
    reviewCount: 3280,
    readTime: "14 hours",
    dna: [0.9, 0.2, 0.6, 0.7, 0.5, 0.4],
  };

  const features = [
    {
      icon: Orbit,
      title: "Constellation Discovery",
      description: "Navigate an interactive star map of genres. Each book is a celestial object in your literary cosmos.",
      accent: "from-purple-500/15 to-blue-500/10",
    },
    {
      icon: Activity,
      title: "Literary DNA Matching",
      description: "Every book has a unique genome fingerprint. Match your reader DNA for perfect recommendations.",
      accent: "from-amber-500/15 to-primary/10",
    },
    {
      icon: Users,
      title: "Space Station Clubs",
      description: "Join orbital book clubs — reading stations where crews gather, discuss, and voyage together.",
      accent: "from-emerald-500/10 to-teal-500/10",
    },
    {
      icon: TrendingUp,
      title: "Reading Pulse Monitor",
      description: "Watch the community's literary heartbeat in real-time. See what the world is reading right now.",
      accent: "from-rose-500/10 to-orange-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <div className="noise-overlay" />
      <Navigation />

      {/* ═══════════════════════════════════════════════ */}
      {/* HERO — LITERARY COSMOS                         */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[95vh] flex items-center" id="hero">
        {/* Starfield background */}
        <StarField />

        {/* Aurora bands */}
        <div className="aurora-bg">
          <div className="aurora-band aurora-band-1" />
          <div className="aurora-band aurora-band-2" />
          <div className="aurora-band aurora-band-3" />
        </div>

        {/* Floating glow orbs */}
        <div className="glow-orb w-[500px] h-[500px] bg-primary/15 top-[-10%] right-[-10%]"
          style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }} />
        <div className="glow-orb w-[400px] h-[400px] bg-purple-500/8 bottom-[0%] left-[-5%]"
          style={{ transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)`, animationDelay: "3s" }} />
        <div className="glow-orb w-[300px] h-[300px] bg-blue-500/6 top-[40%] left-[30%]"
          style={{ transform: `translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)`, animationDelay: "5s" }} />

        {/* Floating book covers */}
        {trendingBooks.slice(0, 4).map((book, i) => (
          <div
            key={`float-${i}`}
            className="floating-book hidden lg:block"
            style={{
              width: 80 + i * 10,
              height: 120 + i * 15,
              left: `${[8, 85, 5, 90][i]}%`,
              top: `${[15, 25, 65, 70][i]}%`,
              ['--float-duration' as string]: `${6 + i * 2}s`,
              ['--float-delay' as string]: `${i * 1.5}s`,
              ['--float-y' as string]: `${-15 - i * 5}px`,
              ['--rotate-start' as string]: `${-8 + i * 4}deg`,
              ['--rotate-end' as string]: `${8 - i * 4}deg`,
            }}
          >
            <img src={book.cover} alt="" className="w-full h-full object-cover" />
          </div>
        ))}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10 w-full">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 glass-panel px-5 py-2.5 rounded-full mb-8 animate-fade-in">
              <div className="live-dot" />
              <span className="text-sm font-medium text-primary">2,470 readers exploring right now</span>
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-foreground mb-6 tracking-tight leading-[1.05] animate-fade-in-up">
              Navigate Your{" "}
              <br className="hidden sm:block" />
              <span className="text-gradient-cosmic">Literary Cosmos</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              Every book is a star. Every genre, a constellation. Chart your course
              through an infinite universe of stories — discover your literary DNA,
              join reading expeditions, and watch the community pulse in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in" style={{ animationDelay: "200ms" }}>
              <Button size="lg" className="btn-gradient px-10 py-7 text-lg rounded-2xl group" onClick={() => navigate("/auth")}>
                Launch Your Voyage
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="btn-outline-glow px-10 py-7 text-lg rounded-2xl" onClick={() => navigate("/books")}>
                Explore the Cosmos
                <Orbit className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="flex -space-x-3">
                {["photo-1494790108377-be9c29b29330", "photo-1507003211169-0a1dd7228f2d", "photo-1438761681033-6461ffad8d80", "photo-1472099645785-5658abf4ff4e"].map((id, i) => (
                  <img key={i} src={`https://images.unsplash.com/${id}?w=40&h=40&fit=crop`} alt="" className="w-10 h-10 rounded-full border-2 border-background object-cover" />
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />)}
                </div>
                <p className="text-xs text-muted-foreground">Loved by <span className="text-foreground font-semibold">5,000+</span> explorers</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground ml-2 pl-6 border-l border-border/30">
                <Flame className="w-4 h-4 text-orange-400" />
                <span><span className="text-foreground font-semibold">1,200+</span> active reading streaks</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      </section>

      {/* Cosmic divider */}
      <div className="cosmic-divider" />

      {/* ═══════════════════════════════════════════════ */}
      {/* LITERARY WEATHER FORECAST                      */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={weatherAnimation.ref}
            className={`transition-all duration-700 ${weatherAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="live-dot" />
              <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
                Literary Weather — <span className="text-gradient">Live Now</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {literaryWeather.map((weather, idx) => (
                <div
                  key={idx}
                  className={`weather-card card-cosmic rounded-2xl p-6 cursor-pointer transition-all duration-500 ${activeWeather === idx ? 'ring-1 ring-primary/30 scale-[1.02]' : 'opacity-70 hover:opacity-90'
                    }`}
                  onClick={() => setActiveWeather(idx)}
                >
                  <div className={`absolute inset-0 rounded-2xl ${weather.bg} transition-opacity duration-500 ${activeWeather === idx ? 'opacity-100' : 'opacity-0'}`} />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${weather.color}`}>
                        <WeatherIcon mood={weather.mood} />
                      </div>
                      {activeWeather === idx && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <div className="live-dot" style={{ width: 4, height: 4 }} />
                          {weather.activeReaders.toLocaleString()} reading
                        </div>
                      )}
                    </div>
                    <h3 className={`font-heading text-lg font-bold mb-1 ${activeWeather === idx ? weather.color : 'text-foreground'}`}>
                      {weather.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{weather.description}</p>
                    <p className="text-xs text-primary/70 font-medium">{weather.genre}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* GENRE CONSTELLATION MAP                        */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden" id="constellation">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,hsl(270_70%_55%_/_0.03),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-6">
            <div className="deco-line mx-auto mb-6" />
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
              The Genre <span className="text-gradient-cosmic">Constellation</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Navigate the literary cosmos. Each star is a genre — click to explore, or follow the
              constellation lines to discover connected worlds.
            </p>
          </div>

          <div
            ref={constellationAnimation.ref}
            className={`glass-panel rounded-3xl p-6 md:p-10 transition-all duration-700 ${constellationAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <ConstellationMap onGenreClick={(genre) => navigate(`/books?genre=${genre}`)} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* COMMUNITY READING PULSE                        */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={pulseAnimation.ref}
            className={`glass-panel rounded-3xl p-8 md:p-10 transition-all duration-700 ${pulseAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                    Community Reading Pulse
                    <span className="live-dot ml-1" />
                  </h3>
                  <p className="text-sm text-muted-foreground">Real-time literary heartbeat of BookVerse</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-primary rounded" />
                  <span>Pages read</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-purple-500 rounded opacity-50" />
                  <span>Active sessions</span>
                </div>
                <span className="text-foreground font-semibold">12,847 pages/min</span>
              </div>
            </div>
            <ReadingPulse />
            <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span><span className="text-foreground font-semibold">3,421</span> active readers</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span><span className="text-foreground font-semibold">89</span> new streaks today</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span><span className="text-foreground font-semibold">247</span> reviews posted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cosmic divider */}
      <div className="cosmic-divider" />

      {/* ═══════════════════════════════════════════════ */}
      {/* BOOK OF THE DAY — with DNA                     */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,hsl(32_95%_62%_/_0.04),transparent_60%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="deco-line mx-auto mb-6" />
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
              Book of the <span className="text-gradient">Day</span>
            </h2>
            <p className="text-lg text-muted-foreground">Hand-picked daily by our editorial team</p>
          </div>

          <div
            ref={botdAnimation.ref}
            className={`glass-panel rounded-3xl overflow-hidden transition-all duration-700 ${botdAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <div className="grid md:grid-cols-[300px_1fr] gap-0">
              {/* Cover */}
              <div className="relative h-80 md:h-auto overflow-hidden">
                <img src={botd.cover} alt={botd.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/30" />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-bold">
                  <Crown className="w-3.5 h-3.5" />
                  TODAY'S PICK
                </div>
              </div>
              {/* Info */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-medium w-fit mb-4 inline-block">
                      {botd.genre}
                    </span>
                    <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">{botd.title}</h3>
                    <p className="text-muted-foreground text-lg mb-4">by {botd.author}</p>
                    <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">{botd.description}</p>
                  </div>
                  {/* Book DNA */}
                  <div className="hidden md:flex flex-col items-center gap-2">
                    <BookDNA themes={botd.dna} size={110} />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Book DNA</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-semibold text-foreground">{botd.rating}</span>
                    <span>({botd.reviewCount.toLocaleString()} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{botd.readTime} avg</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary" />
                    <span>2.4k reading now</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="btn-gradient rounded-xl gap-2" onClick={() => navigate(`/book/1`)}>
                    <BookOpen className="w-4 h-4" />
                    View Details
                  </Button>
                  <Button variant="outline" className="btn-outline-glow rounded-xl gap-2">
                    <Heart className="w-4 h-4" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* TRENDING BOOKS — with DNA Fingerprints          */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="deco-line mb-4" />
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                Trending <span className="text-gradient">Now</span>
              </h2>
              <p className="text-muted-foreground">Most popular books this week — with their literary DNA</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => scrollCarousel("left")} className="w-10 h-10 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scrollCarousel("right")} className="w-10 h-10 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={trendingAnimation.ref}
            className={`transition-all duration-700 ${trendingAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div ref={carouselRef} className="flex gap-5 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory">
              {trendingBooks.map((book, idx) => (
                <div
                  key={book.id}
                  className="flex-shrink-0 w-[280px] snap-start card-premium rounded-2xl overflow-hidden group cursor-pointer"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-primary/90 text-primary-foreground px-2.5 py-1 rounded-lg text-xs font-bold">
                      <TrendingUp className="w-3 h-3" />
                      #{idx + 1}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-xs px-2 py-0.5 bg-white/10 backdrop-blur-sm rounded text-white/80">{book.genre}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-base font-bold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">{book.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                            <span className="text-sm font-semibold text-foreground">{book.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{book.readers.toLocaleString()} readers</span>
                        </div>
                      </div>
                      {/* Mini DNA chart */}
                      <div className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                        <BookDNA themes={book.dna} size={55} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* FEATURES — Cosmic Unique Selling Points         */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-cosmos)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="deco-line mx-auto mb-6" />
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
              What Makes Us <span className="text-gradient-cosmic">Different</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Not just another book app — a living literary universe with features you won't find anywhere else
            </p>
          </div>

          <div ref={featuresAnimation.ref} className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ${featuresAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {features.map((feature, idx) => (
              <div key={idx} className="card-cosmic card-3d p-8 rounded-3xl group cursor-pointer relative overflow-hidden" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-3 text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-medium">Explore</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* READING CHALLENGES                             */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="deco-line mb-4" />
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-2">
                Reading <span className="text-gradient">Expeditions</span>
              </h2>
              <p className="text-lg text-muted-foreground">Embark on literary missions, earn stellar badges</p>
            </div>
            <Button variant="outline" className="btn-outline-glow rounded-xl gap-2 w-fit" onClick={() => navigate("/books")}>
              View All Expeditions <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div ref={challengesAnimation.ref} className={`grid md:grid-cols-3 gap-6 transition-all duration-700 ${challengesAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {readingChallenges.map((challenge, idx) => (
              <div key={idx} className="card-cosmic rounded-2xl p-6 group cursor-pointer relative overflow-hidden">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center`}>
                    <challenge.icon className={`w-6 h-6 ${challenge.color}`} />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                    <Clock className="w-3 h-3" />
                    {challenge.daysLeft} days left
                  </div>
                </div>

                <h3 className="font-heading text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{challenge.title}</h3>
                <p className="text-sm text-muted-foreground mb-5">Read {challenge.books} books to complete</p>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full transition-all duration-500" style={{ width: `${Math.random() * 40 + 10}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {challenge.participants.toLocaleString()} explorers
                  </div>
                  <span className="text-primary font-medium">Join Expedition →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* BOOK CLUBS (SPACE STATIONS)                     */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="deco-line mb-4" />
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-2">
                Reading <span className="text-gradient-cosmic">Stations</span>
              </h2>
              <p className="text-lg text-muted-foreground">Join orbital crews — read together, discuss deeper</p>
            </div>
            <Button variant="outline" className="btn-outline-glow rounded-xl gap-2 w-fit" onClick={() => navigate("/community")}>
              Browse All Stations <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div ref={clubsAnimation.ref} className={`grid md:grid-cols-3 gap-6 transition-all duration-700 ${clubsAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {bookClubs.map((club, idx) => (
              <div key={idx} className="card-cosmic rounded-2xl p-6 group cursor-pointer" onClick={() => navigate("/community")}>
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${club.gradient} overflow-hidden flex-shrink-0`}>
                    <img src={club.avatar} alt={club.name} className="w-full h-full object-cover mix-blend-luminosity opacity-60 group-hover:opacity-80 transition-opacity" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">{club.name}</h3>
                    <p className="text-sm text-muted-foreground">{club.members.toLocaleString()} crew members</p>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-xl p-4 border border-border/20">
                  <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider font-medium">Currently Reading</p>
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                    {club.currentBook}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-muted border-2 border-card" />
                    ))}
                    <div className="w-7 h-7 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-[10px] text-primary font-bold">+</div>
                  </div>
                  <span className="text-xs text-primary font-medium group-hover:underline">Board Station →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* HOW IT WORKS — Voyage Steps                     */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="deco-line mx-auto mb-6" />
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
              Your <span className="text-gradient-cosmic">Voyage</span> Begins
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">Chart your course through the literary cosmos in four steps.</p>
          </div>

          <div ref={howItWorksAnimation.ref} className={`grid md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-700 ${howItWorksAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {howItWorks.map((item, idx) => (
              <div key={idx} className="relative group">
                {idx < 3 && <div className="hidden lg:block absolute top-10 left-[calc(100%+0.5rem)] w-[calc(100%-1rem)] h-[1px] bg-gradient-to-r from-primary/20 to-primary/5" />}
                <div className="relative p-6 rounded-2xl border border-border/30 hover:border-primary/20 bg-card/50 transition-all duration-300 group-hover:shadow-[0_0_30px_hsl(32_95%_62%_/_0.05)]">
                  <div className="text-4xl font-heading font-black text-primary/15 mb-3">{item.step}</div>
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* STATS — Cosmic Metrics                          */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-cosmos)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={statsAnimation.ref} className={`glass-panel rounded-3xl p-12 md:p-16 transition-all duration-700 delay-100 ${statsAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
              {[
                { number: 10000, suffix: "+", label: "Books Charted", icon: BookOpen },
                { number: 5000, suffix: "+", label: "Active Explorers", icon: Users },
                { number: 25000, suffix: "+", label: "Reviews Written", icon: Star },
                { number: 8000, suffix: "+", label: "Books Traded", icon: TrendingUp },
                { number: 320, suffix: "+", label: "Active Stations", icon: Crown },
              ].map((stat, idx) => (
                <div key={idx} className="space-y-3">
                  <stat.icon className="w-8 h-8 text-primary mx-auto" />
                  <div className="font-heading text-3xl md:text-5xl font-bold text-foreground"><AnimatedCounter target={stat.number} suffix={stat.suffix} /></div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* TESTIMONIALS                                   */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="deco-line mx-auto mb-6" />
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
              Explorers <span className="text-gradient-cosmic">Love Us</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">Join thousands of happy readers who've found their cosmic community</p>
          </div>

          <div ref={testimonialsAnimation.ref} className={`grid md:grid-cols-3 gap-6 transition-all duration-700 ${testimonialsAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {testimonials.map((t, idx) => (
              <div key={idx} className="card-cosmic rounded-3xl p-8 relative group">
                <Quote className="w-10 h-10 text-primary/10 mb-4" />
                <p className="text-foreground/80 leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover border-2 border-primary/20" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 mt-4">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* FINAL CTA — Launch Your Voyage                  */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="glow-orb w-[600px] h-[600px] bg-primary/15 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2" />
          <div className="glow-orb w-[400px] h-[400px] bg-purple-500/8 top-[30%] left-[30%]" style={{ animationDelay: "3s" }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div ref={ctaAnimation.ref} className={`glass-panel p-12 md:p-16 rounded-3xl transition-all duration-700 delay-200 ${ctaAnimation.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Orbit className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Launch Your<br /><span className="text-gradient-cosmic">Literary Voyage?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of readers navigating the literary cosmos — discovering new stars,
              charting their DNA, watching the pulse, and building constellations of stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-gradient px-10 py-7 text-lg rounded-2xl group" onClick={() => navigate("/auth")}>
                Join BookVerse — It's Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
