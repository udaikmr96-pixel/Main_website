import Marquee from "react-fast-marquee";

const LANGS = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Arabic",
  "Mandarin",
  "Japanese",
];

export default function LanguageMarquee() {
  return (
    <section
      id="languages"
      data-testid="languages-marquee"
      className="relative py-16 md:py-24 border-y border-white/10 overflow-hidden"
    >
      <Marquee gradient={false} speed={45} pauseOnHover>
        {LANGS.concat(LANGS).map((lang, i) => (
          <span
            key={`${lang}-${i}`}
            className="font-display text-stroke text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter px-8 md:px-12 whitespace-nowrap"
          >
            {lang} <span className="text-neutral-700">·</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
