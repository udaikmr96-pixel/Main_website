import { Mail, MessageCircle } from "lucide-react";

const QUICK_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

const SERVICE_LINKS = [
  { href: "#services", label: "Website Design & Hosting" },
  { href: "#services", label: "Workflow Automation" },
  { href: "#services", label: "Linguistic Services" },
];

const WHATSAPP_NUMBER = "919210283191"; // +91 92102 83191
const WHATSAPP_MSG = encodeURIComponent(
  "Hi Individual Stake — I'd like to discuss a project.",
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative border-t border-white/10 pt-20 pb-10 px-6 md:px-12 lg:px-16 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <span className="block w-2 h-2 bg-white rounded-full" />
              <span className="font-display tracking-tight text-lg font-medium">
                Individual Stake
              </span>
            </div>
            <p className="mt-5 text-neutral-400 max-w-sm leading-relaxed text-sm">
              A studio for ambitious individuals. Websites, automations and
              multilingual content — built with skin in the game across 9
              languages.
            </p>
            <div className="mt-8 flex items-center gap-4 text-neutral-400">
              <a
                href="mailto:uk@individualstake.com"
                aria-label="Email"
                data-testid="footer-social-email"
                className="hover:text-white transition"
              >
                <Mail size={18} />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                data-testid="footer-social-whatsapp"
                className="inline-flex items-center gap-2 text-sm hover:text-white transition border border-white/15 hover:border-white px-3 py-1.5 rounded-full"
              >
                <MessageCircle size={16} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-semibold">
              Navigate
            </div>
            <ul className="mt-5 space-y-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    data-testid={`footer-link-${l.label.toLowerCase()}`}
                    className="text-neutral-300 hover:text-white text-sm transition"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-semibold">
              Services
            </div>
            <ul className="mt-5 space-y-3">
              {SERVICE_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-neutral-300 hover:text-white text-sm transition"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          aria-hidden
          className="font-display select-none text-[15vw] leading-none font-bold tracking-tighter text-white/[0.06] whitespace-nowrap text-center md:text-left"
        >
          INDIVIDUAL STAKE
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} Individual Stake. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Crafted with care.</span>
            <a
              href="#home"
              data-testid="footer-back-to-top"
              className="hover:text-white transition"
            >
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
