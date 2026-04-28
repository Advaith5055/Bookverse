import { useState } from "react";
import { BookOpen, Search, Users, MessageCircle, User, Plus, Store, Compass, Menu, X, Orbit } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { icon: Store, label: "Marketplace", path: "/marketplace" },
    { icon: Search, label: "Books", path: "/books" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: Compass, label: "Discover", path: "/discover" },
    { icon: MessageCircle, label: "Chat", path: "/chat" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full glassy-nav border-b border-border/50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2.5 group"
          >
            <div className="relative w-9 h-9 bg-primary/15 rounded-xl flex items-center justify-center group-hover:bg-primary/25 transition-all duration-300 overflow-hidden">
              <Orbit className="w-5 h-5 text-primary relative z-10" />
              <div className="absolute inset-0 rounded-xl bg-primary/10 scale-0 group-hover:scale-100 transition-transform duration-300" />
              {/* Tiny orbiting dot */}
              <div
                className="absolute w-1.5 h-1.5 bg-primary rounded-full"
                style={{
                  animation: 'orbit-nav 3s linear infinite',
                  transformOrigin: 'center center',
                }}
              />
              <style>{`
                @keyframes orbit-nav {
                  from { transform: rotate(0deg) translateX(12px) rotate(0deg); }
                  to { transform: rotate(360deg) translateX(12px) rotate(-360deg); }
                }
              `}</style>
            </div>
            <span className="font-heading text-xl font-bold text-foreground tracking-tight">
              Book<span className="text-gradient">Verse</span>
            </span>
          </button>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {/* Active indicator line */}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary rounded-full" />
                  )}
                  {/* Hover bg */}
                  <span className={`absolute inset-0 rounded-lg transition-colors duration-200 -z-10 ${
                    isActive ? 'bg-primary/10' : 'group-hover:bg-muted/50'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Add Book Button (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              onClick={() => navigate("/add-book")}
              className="btn-gradient rounded-xl text-sm font-semibold px-5 py-2 h-9 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Book
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-lg" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50 bg-card border-b border-border shadow-2xl pt-20 pb-8 px-6 animate-slide-down">
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              <div className="pt-4">
                <Button
                  onClick={() => {
                    navigate("/add-book");
                    setMobileOpen(false);
                  }}
                  className="w-full btn-gradient rounded-xl font-semibold gap-2 h-12"
                >
                  <Plus className="w-4 h-4" />
                  Add Book
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
