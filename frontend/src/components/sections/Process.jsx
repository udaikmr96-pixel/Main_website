import { motion } from "framer-motion";

const STEPS = [
  {
    no: "01",
    title: "Discovery",
    text: "We listen first. Goals, audiences, constraints — and the messy reality of how your team works today.",
  },
  {
    no: "02",
    title: "Strategy & Design",
    text: "We translate findings into a brief, then design the system: site map, flows, UI, content tone, languages.",
  },
  {
    no: "03",
    title: "Build & Automate",
    text: "Engineering, content production and integrations happen in parallel — with weekly demos, no surprises.",
  },
  {
    no: "04",
    title: "Launch & Iterate",
    text: "We ship to managed hosting, hand off documentation, and stay on as a retainer to keep iterating.",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      data-testid="process-section"
      className="relative py-24 md:py-36 px-6 md:px-12 lg:px-16 border-t border-white/10"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-2xl mb-16 md:mb-24">
          <span className="text-xs tracking-[0.25em] uppercase text-neutral-500 font-semibold">
            How we work
          </span>
          <h2 className="font-display mt-6 text-4xl md:text-5xl lg:text-6xl tracking-tight font-light leading-[1.05]">
            Four steps. No drama.
            <br />
            <span className="text-neutral-500">Just signal.</span>
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.no}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.05 }}
              data-testid={`process-step-${s.no}`}
              className="bg-[#050505] p-8 md:p-12 group hover:bg-[#0a0a0a] transition-colors"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-5xl md:text-6xl font-light text-neutral-700 group-hover:text-white transition-colors">
                  {s.no}
                </span>
                <span className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                  Step
                </span>
              </div>
              <h3 className="mt-8 font-display text-2xl md:text-3xl tracking-tight font-medium">
                {s.title}
              </h3>
              <p className="mt-4 text-neutral-400 leading-relaxed max-w-md">
                {s.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
