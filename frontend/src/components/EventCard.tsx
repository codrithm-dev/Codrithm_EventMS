import Link from "next/link";
import { Calendar, MapPin, Users, type LucideIcon } from "lucide-react";

export interface EventCardProps {
  slug: string;
  title: string;
  category: string;
  categoryColor: string; /* hex or css color for the badge bg tint */
  date: string;
  venue: string;
  registeredCount: number;
  capacity: number;
  bannerIcon: LucideIcon;
  bannerGradient: string; /* CSS gradient string */
}

export default function EventCard({
  slug,
  title,
  category,
  categoryColor,
  date,
  venue,
  registeredCount,
  capacity,
  bannerIcon: BannerIcon,
  bannerGradient,
}: EventCardProps) {
  const pct = Math.round((registeredCount / capacity) * 100);

  return (
    <Link
      href={`/events/${slug}`}
      className="
        group flex flex-col
        bg-[var(--color-surface)]
        border border-[var(--color-border)]
        rounded-2xl overflow-hidden
        hover:border-[var(--color-primary-blue)]
        hover:scale-[1.02]
        transition-all duration-200
        cursor-pointer
      "
    >
      {/* Banner placeholder */}
      <div
        className="relative h-40 flex items-center justify-center shrink-0"
        style={{ background: bannerGradient }}
      >
        <BannerIcon size={40} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Category badge */}
        <span
          className="self-start px-2.5 py-0.5 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: `${categoryColor}22`,
            color: categoryColor,
          }}
        >
          {category}
        </span>

        {/* Title */}
        <h3 className="font-bold text-base leading-snug text-[var(--color-text-primary)] group-hover:text-[var(--color-primary-blue)] transition-colors duration-150">
          {title}
        </h3>

        {/* Date + venue */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <Calendar size={13} strokeWidth={2} className="shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <MapPin size={13} strokeWidth={2} className="shrink-0" />
            <span className="truncate">{venue}</span>
          </div>
        </div>

        {/* Capacity */}
        <div className="mt-auto pt-3 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <Users size={13} strokeWidth={2} className="shrink-0" />
              <span>{registeredCount}/{capacity} registered</span>
            </div>
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">{pct}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, #0066ff, #87ffbc)",
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
