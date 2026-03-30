import { HardDrive, Server } from "lucide-react";

import { cn } from "@/lib/utils";

type PhoneImageProps = {
  imageUrl?: string;
  alt: string;
  priority?: boolean;
  featured?: boolean;
  className?: string;
};

export function PhoneImage({ alt, featured = false, className }: PhoneImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-[radial-gradient(circle_at_top,rgba(0,212,255,0.14),transparent_40%),linear-gradient(180deg,rgba(14,17,26,0.95),rgba(10,10,10,0.96))] shadow-[0_24px_70px_rgba(0,0,0,0.32)]",
        featured ? "h-[300px] w-full" : "h-[220px] w-full",
        className,
      )}
      aria-label={alt}
    >
      <div className="absolute -right-12 top-8 h-24 w-24 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute -left-10 bottom-2 h-24 w-24 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute inset-0 panel-grid opacity-40" />
      <div className="relative flex h-full flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
          <Server size={featured ? 38 : 32} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">VPS node</p>
          <p className="px-6 text-sm text-slate-300">{alt}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
          <HardDrive size={14} className="text-[#00ff88]" />
          Storage NVMe otimizado
        </div>
      </div>
    </div>
  );
}
