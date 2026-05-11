import { Link, NavLink } from "react-router-dom";
import { Sparkles } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/participate", label: "Play" },
  { to: "/status", label: "My Tickets" },
  { to: "/results", label: "Results" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0b10]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        <Link to="/" className="group flex items-center gap-2" data-testid="nav-logo">
          <Sparkles className="h-5 w-5 text-[#d4af37] transition-transform group-hover:rotate-12" />
          <span className="font-serif text-2xl tracking-tight">
            Lumière<span className="text-[#d4af37]">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              data-testid={`nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-colors ${
                  isActive ? "text-[#d4af37]" : "text-white/60 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <Link
            to="/admin/login"
            data-testid="nav-admin"
            className="text-xs uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-[#d4af37]"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}