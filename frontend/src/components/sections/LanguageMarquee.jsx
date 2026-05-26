import Marquee from "react-fast-marquee";

const LANGS = [
  { name: "हिन्दी", highlight: true, devanagari: true, latin: "Hindi" },
  { name: "English", highlight: false },
  { name: "Spanish", highlight: false },
  { name: "French", highlight: false },
  { name: "German", highlight: false },
  { name: "Portuguese", highlight: false },
  { name: "Arabic", highlight: false },
  { name: "Mandarin", highlight: false },
  { name: "Japanese", highlight: false },
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
          We work in 9 languages — and Hindi is home.
        </span>
      </div>
      <Marquee gradient={false} speed={45} pauseOnHover>
        {LANGS.concat(LANGS).map((lang, i) => (
          <span
            key={`${lang.name}-${i}`}
            data-testid={lang.highlight ? `lang-highlight-${i}` : undefined}
            className={[
              "text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter px-8 md:px-12 whitespace-nowrap",
              lang.devanagari ? "font-devanagari" : "font-display",
              lang.highlight
                ? "text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.25)]"
                : "text-stroke",
            ].join(" ")}
          >
            {lang.name}{" "}
            {lang.highlight && (
              <span className="text-stroke font-display align-middle text-3xl md:text-5xl ml-2">
                ({lang.latin})
              </span>
            )}{" "}
            <span className="text-neutral-700">·</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
