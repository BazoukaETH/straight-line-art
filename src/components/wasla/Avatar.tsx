import { memberById } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function Avatar({
  memberId,
  size = 28,
  status,
  className,
}: {
  memberId: string;
  size?: number;
  status?: boolean;
  className?: string;
}) {
  const m = memberById(memberId);
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center rounded-full font-medium text-white", className)}
      style={{ width: size, height: size, backgroundColor: m.color, fontSize: Math.max(10, size * 0.4) }}
    >
      {m.initials}
      {status && m.online && (
        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-[color:var(--success)] ring-2 ring-background" />
      )}
    </span>
  );
}
