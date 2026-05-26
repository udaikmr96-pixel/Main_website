import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";

const SERVICES = [
  {
    id: "design-hosting",
    no: "01",
    title: "Website Design & Hosting",
    image:
      "https://static.prod-images.emergentagent.com/jobs/71fb6a3c-0c6d-4451-91be-bce1c9f179a2/images/5cbecd9109a345141751a6581c872ebbce2c89eece289a9295c0408d5c7727dd.png",
    desc: "Custom-built websites that load fast, look intentional and convert. Paired with managed hosting so you never think about uptime again.",
    items: [
      "Brand-aligned UI / UX design",
      "Hand-coded responsive builds",
      "Managed hosting & deployments",
      "SEO, analytics & performance audits",
    ],
  },
  {
    id: "workflow-automation",
    no: "02",
    title: "Workflow Automation",
    image:
      "https://static.prod-images.emergentagent.com/jobs/71fb6a3c-0c6d-4451-91be-bce1c9f179a2/images/90b594d1aeec6e23303a948bdd7c171d3a2d7d256083a3dc5c173fe3da26aca8.png",
    desc: "Connect the tools you already use, eliminate busywork, and unlock leverage. Automations engineered to pay for themselves in weeks.",
    items: [
      "Process discovery & mapping",
      "API & no-code integrations",
      "AI-assisted document & data flows",
      "Monitoring, logging & handoff docs",
    ],
  },
  {
    id: "linguistic-services",
    no: "03",
    title: "Linguistic Services",
    image:
      "https://static.prod-images.emergentagent.com/jobs/71fb6a3c-0c6d-4451-91be-bce1c9f179a2/images/921d81ded598595b653b11c33be40fcb1c46f8b43743ad454475bf27b3abcfc2.png",
    desc: "Translation, localization and bilingual copywriting that reads native. Real linguists, not just models — across eight working languages.",
    items: [
      "Human translation & proofreading",
      "Website & app localization",
      "Multilingual SEO copywriting",
      "Subtitling & transcription",
    ],
  },
];

export default function Services() {
  return (
    <section
      id="services"
      data-testid="services-section"
      className="relative py-24 md:py-36 px-6 md:px-12 lg:px-16 border-t border-white/10"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 md:mb-24">
          <div className="max-w-2xl">
            <span className="text-xs tracking-[0.25em] uppercase text-neutral-500 font-semibold">
              What we do
            </span>
            <h2
              data-testid="services-headline"
              className="font-display mt-6 text-4xl md:text-5xl lg:text-6xl tracking-tight font-light leading-[1.05]"
            >
              Three practices,
              <br />
              one quiet obsession with craft.
            </h2>
          </div>
          <p className="text-neutral-400 max-w-md text-base leading-relaxed">
            Engage us for one service or all three — they were built to
            compound. A site that ships, automations behind it, content that
            travels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {SERVICES.map((s, idx) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              data-testid={`service-card-${s.id}`}
              className="group relative flex flex-col border border-white/10 bg-[#0a0a0a] hover:border-white/30 transition-colors duration-500 overflow-hidden"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#0a0a0a]" />
                <span className="absolute top-5 left-5 text-xs tracking-[0.25em] uppercase text-white/80 font-semibold">
                  {s.no}
                </span>
                <ArrowUpRight
                  size={20}
                  className="absolute top-5 right-5 text-white/70 group-hover:text-white group-hover:-translate-y-1 group-hover:translate-x-1 transition-all"
                />
              </div>

              <div className="flex flex-col gap-6 p-8 md:p-10">
                <h3 className="font-display text-2xl md:text-3xl tracking-tight font-medium leading-tight">
                  {s.title}
                </h3>
                <p className="text-neutral-400 leading-relaxed text-[15px]">
                  {s.desc}
                </p>
                <ul className="mt-2 space-y-3">
                  {s.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-start gap-3 text-sm text-neutral-300"
                    >
                      <Check
                        size={16}
                        className="mt-0.5 text-white/80 shrink-0"
                      />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
