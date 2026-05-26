import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-black/60 border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 h-16 md:h-20 flex items-center justify-between">
        <a
          href="#home"
          data-testid="nav-logo"
          className="flex items-center gap-2 group"
        >
          <span className="block w-2 h-2 bg-white rounded-full group-hover:scale-150 transition-transform" />
          <span className="font-display tracking-tight text-base md:text-lg font-medium">
            Individual Stake
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className="text-sm text-neutral-400 hover:text-white transition-colors relative"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          data-testid="nav-cta-button"
          className="hidden md:inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all rounded-full"
        >
          Start a project
        </a>

        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle menu"
          data-testid="mobile-menu-toggle"
          className="md:hidden p-2 text-white"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          data-testid="mobile-menu"
          className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl"
        >
          <div className="px-6 py-6 flex flex-col gap-5">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                className="text-neutral-300 hover:text-white text-lg"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              data-testid="mobile-nav-cta"
              className="mt-2 inline-flex items-center justify-center text-sm font-medium px-5 py-3 border border-white/20 hover:bg-white hover:text-black transition rounded-full"
            >
              Start a project
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
