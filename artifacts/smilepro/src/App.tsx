import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { I18nProvider } from "@/lib/i18n";
import { useState } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Book from "@/pages/Book";
import About from "@/pages/About";
import Gallery from "@/pages/Gallery";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import Consultation from "@/pages/Consultation";
import Services from "@/pages/Services";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PromoBanner } from "@/components/PromoBanner";
import { FaWhatsapp } from "react-icons/fa";

const queryClient = new QueryClient();

function AdminRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  if (!isAuthenticated) return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  return <Admin onLogout={() => setIsAuthenticated(false)} />;
}

function Router() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <PromoBanner />
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/book" component={Book} />
          <Route path="/services" component={Services} />
          <Route path="/consultation" component={Consultation} />
          <Route path="/admin" component={AdminRoute} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/201095530001"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 end-6 z-40 size-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
        aria-label="WhatsApp 01095530001"
      >
        <FaWhatsapp className="h-7 w-7" />
      </a>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <I18nProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </I18nProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
