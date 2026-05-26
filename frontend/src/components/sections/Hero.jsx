import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";

const HERO_BG =
  "https://static.prod-images.emergentagent.com/jobs/71fb6a3c-0c6d-4451-91be-bce1c9f179a2/images/8afe45ad6ccee9b39ad07a6f873bc2542f1fa7d157b9b445079cee848f919758.png";

export default function Hero() {
  return (
    <section
      id="home"
      data-testid="hero-section"
      className="relative min-h-screen w-full overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black"
        aria-hidden
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pt-40 md:pt-48 pb-24 md:pb-32 min-h-screen flex flex-col justify-between">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-neutral-400 font-medium">
            <span className="block w-8 h-px bg-neutral-500" />
            A digital craft studio · est. 2025
          </span>

          <h1
            data-testid="hero-headline"
            className="font-display mt-8 md:mt-10 text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] leading-[0.95] tracking-tighter font-light text-white max-w-5xl"
          >
            Design. Automate.
            <br />
            <span className="text-neutral-400">Translate.</span>
          </h1>

          <p className="mt-8 max-w-xl text-base md:text-lg text-neutral-300 leading-relaxed">
            Lumen Works is a small, senior studio building bespoke websites,
            workflow automations, and multilingual content for ambitious teams
            who care how things feel — not just how they ship.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              data-testid="hero-cta-primary"
              className="group inline-flex items-center gap-3 bg-white text-black px-7 py-4 rounded-full text-sm font-medium hover:bg-neutral-200 transition"
            >
              Start a project
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
            <a
              href="#services"
              data-testid="hero-cta-secondary"
              className="inline-flex items-center gap-3 border border-white/25 hover:border-white text-white px-7 py-4 rounded-full text-sm font-medium hover:bg-white/5 transition"
            >
              Explore services
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
          className="hidden md:flex items-end justify-between text-xs text-neutral-500 uppercase tracking-[0.3em]"
        >
          <div className="flex items-center gap-3">
            <span>Scroll</span>
            <ArrowDown size={14} className="animate-bounce" />
          </div>
          <div className="grid grid-cols-3 gap-12">
            <div>
              <div className="text-3xl font-display font-light text-white">
                40+
              </div>
              <div className="mt-1 normal-case tracking-normal text-neutral-500">
                websites shipped
              </div>
            </div>
            <div>
              <div className="text-3xl font-display font-light text-white">
                8
              </div>
              <div className="mt-1 normal-case tracking-normal text-neutral-500">
                languages spoken
              </div>
            </div>
            <div>
              <div className="text-3xl font-display font-light text-white">
                ∞
              </div>
              <div className="mt-1 normal-case tracking-normal text-neutral-500">
                hours of automation saved
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
