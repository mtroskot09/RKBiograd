interface PageBannerProps {
  title: string;
  subtitle?: string;
  /** Small label above the title, e.g. "Seniori" */
  eyebrow?: string;
  /** Background photo; without it the banner uses the club gradient with the crest */
  imageSrc?: string;
}

// Page header used at the top of team and content pages.
export default function PageBanner({ title, subtitle, eyebrow, imageSrc }: PageBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-brand-gradient shadow-xl shadow-primary/20 mb-10">
      {imageSrc ? (
        <>
          <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(232_85%_10%)] via-[hsl(230_80%_18%/0.75)] to-[hsl(218_85%_32%/0.3)]" />
        </>
      ) : (
        <img
          src="/rk-biograd-logo-192.png"
          alt=""
          aria-hidden="true"
          className="absolute -right-6 -bottom-10 h-56 md:h-72 w-auto opacity-10 rotate-6"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-accent" />

      <div className={`relative flex flex-col justify-end p-6 md:p-10 ${imageSrc ? "min-h-56 md:min-h-72" : "min-h-40 md:min-h-48"}`}>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
        )}
        <h1 className="font-display text-4xl md:text-6xl font-extrabold uppercase leading-none text-white">{title}</h1>
        {subtitle && <p className="mt-3 max-w-3xl text-base md:text-lg text-white/85">{subtitle}</p>}
      </div>
    </section>
  );
}
