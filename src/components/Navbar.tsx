import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/articles", label: "Articles" },
    { to: "/about", label: "About" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-background/80 backdrop-blur-lg border-b shadow-sm py-3"
          : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative overflow-hidden rounded-lg">
            {/* Light mode logo */}
            <img
              src="/logo-artikelin.svg"
              alt="Artikelin"
              className="h-8 w-auto block dark:hidden group-hover:scale-105 transition-transform duration-300"
            />
            {/* Dark mode logo */}
            <img
              src="/logo-artikelin-light.svg"
              alt="Artikelin"
              className="h-8 w-auto hidden dark:block group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="font-bold text-lg hidden sm:block tracking-tight text-foreground"></span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-full border border-border/50">
            {links.map((l) => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="ml-4 pl-4 border-l h-6 flex items-center">
            <ThemeToggle />
          </div>
        </div>

        {/* RIGHT SIDE MOBILE */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />

          <button
            className="p-2 text-foreground bg-muted/50 rounded-full hover:bg-muted transition-colors border border-border/50"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU FULL SCREEN DRAWER */}
      <div
        className={`md:hidden fixed inset-0 top-[72px] z-40 bg-background/95 backdrop-blur-xl transition-all duration-300 ease-in-out ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex flex-col p-6 space-y-4">
          {links.map((l, i) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`text-2xl font-bold tracking-tight py-3 border-b border-border/50 transition-all duration-300 ${active
                    ? "text-primary translate-x-2"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;