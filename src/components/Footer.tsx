import { Orbit, Github, Twitter, Instagram, Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Explore",
      links: [
        { label: "Books", path: "/books" },
        { label: "Marketplace", path: "/marketplace" },
        { label: "Community", path: "/community" },
        { label: "Discover", path: "/discover" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "Chat", path: "/chat" },
        { label: "Profile", path: "/profile" },
        { label: "Add Book", path: "/add-book" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "How it Works", path: "/" },
        { label: "Privacy Policy", path: "/" },
        { label: "Terms of Service", path: "/" },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-border/50 bg-gradient-to-b from-background to-[hsl(20_14%_3%)]">
      {/* Cosmic glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 via-primary/40 via-blue-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-3 group mb-6"
            >
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Orbit className="w-5 h-5 text-primary" />
              </div>
              <span className="font-heading text-xl font-bold text-foreground">
                Book<span className="text-primary">Verse</span>
              </span>
            </button>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-4">
              Your literary cosmos. Navigate constellations of books, discover your
              reading DNA, and join the most vibrant community of literary explorers.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <Sparkles className="w-3 h-3 text-primary" />
              <span>Powered by the love of reading</span>
            </div>
            <div className="flex items-center gap-4">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Github, label: "GitHub" },
              ].map((social) => (
                <button
                  key={social.label}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-heading text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} BookVerse. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-primary fill-primary" /> for literary explorers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
