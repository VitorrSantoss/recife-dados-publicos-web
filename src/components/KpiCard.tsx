import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";

interface Props {
  titulo: string;
  valor: number | string;
  subtitulo?: string;
  icon: LucideIcon;
  accent: "blue" | "green" | "red" | "orange";
}

const ACCENTS: Record<Props["accent"], { bg: string; text: string }> = {
  blue: { bg: "bg-[#0066B3]/10", text: "text-[#0066B3]" },
  green: { bg: "bg-[#00A651]/10", text: "text-[#00A651]" },
  red: { bg: "bg-[#E63946]/10", text: "text-[#E63946]" },
  orange: { bg: "bg-[#F39200]/10", text: "text-[#F39200]" },
};

function useCountUp(target: number, duration = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const loop = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

export function KpiCard({ titulo, valor, subtitulo, icon: Icon, accent }: Props) {
  const isNumber = typeof valor === "number";
  const animated = useCountUp(isNumber ? (valor as number) : 0);
  const display = isNumber ? animated.toLocaleString("pt-BR") : valor;
  const a = ACCENTS[accent];
  return (
    <div className="group rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{titulo}</p>
          <p className="mt-2 truncate text-3xl font-semibold text-[#1F2937]">
            {display}
          </p>
          {subtitulo && (
            <p className="mt-1 text-xs text-gray-500">{subtitulo}</p>
          )}
        </div>
        <div className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg ${a.bg}`}>
          <Icon className={`h-5 w-5 ${a.text}`} aria-hidden />
        </div>
      </div>
    </div>
  );
}

export function KpiSkeleton() {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="w-full">
          <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-8 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-3 w-20 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
