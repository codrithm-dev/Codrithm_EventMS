import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { EventItem } from "@/lib/data";

export function EventCard({ event }: { event: EventItem }) {
  return (
    <Link href={`/events/${event.slug}`} className="event-card">
      <div className={`event-art ${event.color}`}>
        <span className="art-icon">{event.icon}</span>
        <span className="date-tile"><b>{event.date.split(" ")[0]}</b>{event.date.split(" ")[1]}</span>
        <span className="card-arrow"><ArrowUpRight size={19} /></span>
      </div>
      <div className="event-card-body">
        <span className="eyebrow">{event.category} · {event.time}</span>
        <h3>{event.title}</h3>
        <p><MapPin size={15} /> {event.location}</p>
        <div className="card-bottom"><b>Rs {event.price.toLocaleString()}</b><span>{event.attendees} going</span></div>
      </div>
    </Link>
  );
}
