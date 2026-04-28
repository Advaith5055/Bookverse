import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./components/PageTransition";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Books from "./pages/Books";
import Marketplace from "./pages/Marketplace";
import BookDetail from "./pages/BookDetail";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import AddBook from "./pages/AddBook";
import PostDetail from "./pages/PostDetail";
import Discover from "./pages/Discover";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/books" element={<PageTransition><Books /></PageTransition>} />
        <Route path="/marketplace" element={<PageTransition><Marketplace /></PageTransition>} />
        <Route path="/book/:id" element={<PageTransition><BookDetail /></PageTransition>} />
        <Route path="/community" element={<PageTransition><Community /></PageTransition>} />
        <Route path="/discover" element={<PageTransition><Discover /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/chat" element={<PageTransition><Chat /></PageTransition>} />
        <Route path="/add-book" element={<PageTransition><AddBook /></PageTransition>} />
        <Route path="/post/:id" element={<PageTransition><PostDetail /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
