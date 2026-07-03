import { Search, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { EventCard } from "@/components/EventCard";
import { Footer } from "@/components/Footer";
import { events } from "@/lib/data";

export default function EventsPage() {
  return <main><Navbar/><section className="page-hero"><span className="eyebrow">The good stuff</span><h1>Go somewhere.<br/><em>Feel something.</em></h1><p>Curated happenings for curious people.</p></section>
    <section className="events-section"><div className="filter-row"><label className="catalog-search"><Search size={18}/><input placeholder="Search by event, artist, or venue"/></label><div className="chips">{["All","This week","Music","Workshops","Business"].map((x,i)=><button className={i===0?"selected":""} key={x}>{x}</button>)}</div><button className="filter-button"><SlidersHorizontal size={17}/> Filters</button></div>
    <div className="catalog-title"><h2>All events</h2><span>24 experiences</span></div><div className="event-grid">{events.map(e=><EventCard event={e} key={e.slug}/>)}</div></section><Footer/></main>
}
