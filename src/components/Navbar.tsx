import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/articles", label: "Articles" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b transition-colors">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <>
            {/* Light mode logo */}
            <img
              src="/logo-artikelin.svg"
              alt="Artikelin"
              className="h-8 w-auto block dark:hidden"
            />

            {/* Dark mode logo */}
            <img
              src="/logo-artikelin-light.svg"
              alt="Artikelin"
              className="h-8 w-auto hidden dark:block"
            />
          </>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const active = location.pathname === l.to;

            return (
              <Link
                key={l.to}
                to={l.to}
                className="relative text-sm font-medium transition-colors"
              >
                <span
                  className={`${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {l.label}
                </span>

                {/* Animated underline */}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}

          {/* DARK MODE DESKTOP */}
          <ThemeToggle />
        </div>

        {/* RIGHT SIDE MOBILE */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <button
            className="p-2 text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        <div className="border-t bg-background px-4 py-4 space-y-3">
          {links.map((l) => {
            const active = location.pathname === l.to;

            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`block text-sm font-medium transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
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