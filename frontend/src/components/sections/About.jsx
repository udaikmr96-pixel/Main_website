import { motion } from "framer-motion";

const ABOUT_IMG_1 =
  "https://images.pexels.com/photos/7674640/pexels-photo-7674640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
const ABOUT_IMG_2 =
  "https://images.pexels.com/photos/3137084/pexels-photo-3137084.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const values = [
  {
    title: "Made by hand",
    text: "No theme dumps, no template factories. Every line of code and pixel is considered.",
  },
  {
    title: "Multilingual by default",
    text: "We think globally from day one — copy, UX and SEO designed to cross borders.",
  },
  {
    title: "Automation as leverage",
    text: "We build systems that work while you sleep, so the team can focus on what matters.",
  },
];

export default function About() {
  return (
    <section
      id="about"
      data-testid="about-section"
      className="relative py-24 md:py-36 px-6 md:px-12 lg:px-16"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-2 gap-4"
            >
              <img
                src={ABOUT_IMG_1}
                alt="A creative team working in a minimalist studio"
                className="col-span-2 w-full h-[360px] md:h-[460px] object-cover border border-white/10"
              />
              <img
                src={ABOUT_IMG_2}
                alt="Minimalist modern architecture"
                className="col-span-2 w-full h-[180px] md:h-[220px] object-cover border border-white/10"
              />
            </motion.div>
          </div>

          <div className="lg:col-span-7 lg:pl-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.05 }}
            >
              <span className="text-xs tracking-[0.25em] uppercase text-neutral-500 font-semibold">
                About the studio
              </span>
              <h2
                data-testid="about-headline"
                className="font-display mt-6 text-4xl md:text-5xl lg:text-6xl tracking-tight font-light leading-[1.05]"
              >
                A small studio with a wide tongue
                <span className="text-neutral-500">.</span>
              </h2>
              <div className="mt-8 space-y-5 text-neutral-300 text-base md:text-lg leading-relaxed max-w-2xl">
                <p>
                  Lumen Works is a senior, independent practice. We pair the
                  craft of a design studio with the rigour of an engineering
                  team — and we speak in eight languages so your message
                  doesn’t get lost in translation.
                </p>
                <p>
                  We partner with founders, agencies, and lean marketing teams
                  to ship websites that convert, automations that reclaim
                  hours, and content that lands in the reader’s native
                  cadence.
                </p>
              </div>
            </motion.div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border border-white/10">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  data-testid={`about-value-${i}`}
                  className="bg-[#050505] p-6 md:p-8"
                >
                  <div className="font-display text-lg md:text-xl tracking-tight">
                    {v.title}
                  </div>
                  <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                    {v.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
