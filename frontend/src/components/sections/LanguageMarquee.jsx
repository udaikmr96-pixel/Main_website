import Marquee from "react-fast-marquee";

const LANGS = [
  "Hindi",
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
      <div className="px-6 md:px-12 lg:px-16 mb-8 max-w-[1400px] mx-auto">
        <span
          className="text-xs tracking-[0.25em] uppercase text-neutral-500 font-semibold"
          data-testid="languages-overline"
        >
          We work in 9 languages.
        </span>
      </div>
      <Marquee gradient={false} speed={45} pauseOnHover>
        {LANGS.concat(LANGS).map((lang, i) => (
          <span
            key={`${lang}-${i}`}
            data-testid={`lang-item-${i}`}
            className="font-display text-stroke text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter px-8 md:px-12 whitespace-nowrap"
          >
            {lang} <span className="text-neutral-700">·</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
