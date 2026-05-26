import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Took ownership the day they joined. Within months, 90% of our HR ops ran themselves and the team finally had room to think strategically.",
    name: "HR Director",
    role: "Mid-market services firm",
  },
  {
    quote:
      "Launched our CRM in eight weeks flat, then quietly fixed the ATS we'd been complaining about for a year. Skin in the game is not a slogan here.",
    name: "Head of Talent",
    role: "Growth-stage scaleup",
  },
  {
    quote:
      "The website looked sharp, but the real win was the multilingual content — our Hindi & English pages convert at completely different rates now.",
    name: "Founder",
    role: "D2C brand, India",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      data-testid="testimonials-section"
      className="relative py-24 md:py-36 px-6 md:px-12 lg:px-16 border-t border-white/10"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-2xl mb-16 md:mb-20">
          <span className="text-xs tracking-[0.25em] uppercase text-neutral-500 font-semibold">
            What partners say
          </span>
          <h2 className="font-display mt-6 text-4xl md:text-5xl lg:text-6xl tracking-tight font-light leading-[1.05]">
            Words from the
            <br />
            <span className="text-neutral-500">other side of the table.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name + i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              data-testid={`testimonial-${i}`}
              className="relative border border-white/10 bg-[#0a0a0a] p-8 md:p-10 flex flex-col gap-6 hover:border-white/30 transition-colors"
            >
              <Quote size={22} className="text-white/40" />
              <blockquote className="text-neutral-200 text-base md:text-[17px] leading-relaxed">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-auto pt-6 border-t border-white/10">
                <div className="font-display text-base font-medium">
                  {t.name}
                </div>
                <div className="text-xs text-neutral-500 mt-1">{t.role}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
