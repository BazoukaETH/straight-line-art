import { pillarMeta, type Pillar } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function PillarTag({ pillar, className, dot = false }: { pillar: Pillar; className?: string; dot?: boolean }) {
  const meta = pillarMeta[pillar];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
        className,
      )}
      style={{
        backgroundColor: `color-mix(in oklab, ${meta.color} 14%, transparent)`,
        color: meta.color,
      }}
    >
      {dot && <span className="size-1.5 rounded-full" style={{ backgroundColor: meta.color }} />}
      {meta.label}
    </span>
  );
}

export function SpaceTag({ name, pillar }: { name: string; pillar: Pillar }) {
  const meta = pillarMeta[pillar];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{
        backgroundColor: `color-mix(in oklab, ${meta.color} 12%, transparent)`,
        color: meta.color,
      }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
      {name}
    </span>
  );
}
