import Image from "next/image";

import { cn } from "@/lib/utils";

type PhoneImageProps = {
  imageUrl?: string;
  alt: string;
  priority?: boolean;
  featured?: boolean;
  className?: string;
};

export function PhoneImage({ imageUrl, alt, priority = false, featured = false, className }: PhoneImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/80 bg-[radial-gradient(circle_at_50%_20%,#ffffff_0%,#edf7ff_34%,#d8ecff_62%,#c7e4ff_100%)] shadow-xl",
        featured ? "h-[300px] w-[200px]" : "h-[220px] w-[160px]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,255,255,0.12))]" />
      <div className="absolute inset-3 rounded-[1.6rem] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.95),rgba(255,255,255,0.05)_48%,transparent_70%)]" />
      <div className="absolute inset-x-5 top-5 h-24 rounded-full bg-cyan-200/45 blur-2xl" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(21,94,117,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(21,94,117,0.08)_1px,transparent_1px)] [background-position:center_center] [background-size:18px_18px]" />
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          priority={priority}
          sizes={featured ? "(max-width: 1024px) 240px, 320px" : "(max-width: 1024px) 200px, 220px"}
          className="object-contain p-4 [filter:saturate(1.08)_contrast(1.08)_drop-shadow(0_18px_25px_rgba(15,23,42,0.18))] [mix-blend-mode:multiply] transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-center text-sm font-bold uppercase tracking-[0.25em] text-primary-700/70">
          Sem imagem
        </div>
      )}
      <div className="absolute inset-x-4 bottom-4 h-8 rounded-full bg-white/45 blur-xl" />
    </div>
  );
}
