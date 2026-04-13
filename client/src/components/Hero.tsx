import { forwardRef } from 'react';

type HeroProps = {
  name: string;
  tagline: string;
};

export const Hero = forwardRef<HTMLDivElement, HeroProps>(({ name, tagline }, ref) => {
  return (
    <div ref={ref} className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
      <img
        src="/avatar.png"
        alt={name}
        loading="eager"
        className="h-20 w-20 rounded-full object-cover object-top shrink-0 ring-2 ring-stone-200 bg-stone-200"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
        }}
      />
      <div className="space-y-2">
        <h1 className="text-5xl font-semibold tracking-tight text-[#1c1917] sm:text-6xl">{name}</h1>
        <p className="text-lg text-[#78716c] leading-relaxed">{tagline}</p>
      </div>
    </div>
  );
});

Hero.displayName = 'Hero';
