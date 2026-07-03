import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Search, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { EventCard } from "@/components/EventCard";
import { Footer } from "@/components/Footer";
import { events } from "@/lib/data";

export default function Home() {
  return (
    <main>
      <Navbar />
      <section className="hero">
        <div className="hero-copy">
          <span className="pill"><Sparkles size={14} /> Make plans worth keeping</span>
          <h1>Find your next<br/><em>great story.</em></h1>
          <p>Discover experiences that move you—from intimate workshops to electric nights out.</p>
          <div className="search-box">
            <label><Search size={20}/><span><small>What</small><input aria-label="Search events" placeholder="Search events" /></span></label>
            <label><MapPin size={20}/><span><small>Where</small><input aria-label="Location" placeholder="All locations" /></span></label>
            <Link href="/events" className="search-submit"><ArrowRight /></Link>
          </div>
          <div className="hero-meta"><div className="avatars"><i>F</i><i>A</i><i>M</i><i>+</i></div><span><b>12,000+</b> people found their moment</span></div>
        </div>
        <div className="hero-visual">
          <div className="poster poster-one"><span>GOOD<br/>THINGS<br/><i>HAPPEN</i><br/>HERE.</span><small>SUMMER 2026</small></div>
          <div className="poster poster-two"><div className="sun"></div><b>LIVE<br/>A LITTLE.</b></div>
          <div className="floating-card"><CalendarDays size={20}/><span><small>Happening today</small><b>24 events near you</b></span></div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading"><div><span className="eyebrow">Handpicked for you</span><h2>Events worth leaving<br/>the house for.</h2></div><Link href="/events" className="inline-link">Browse all events <ArrowRight size={18}/></Link></div>
        <div className="event-grid">{events.slice(0, 3).map((event) => <EventCard key={event.slug} event={event}/>)}</div>
      </section>

      <section className="category-strip">
        <span>EXPLORE BY MOOD</span>
        <div>{["Music", "Ideas", "Food", "Art", "Wellness", "Community"].map((x,i)=><Link href={`/events?category=${x}`} key={x}><i>{["♫","✦","◉","✎","❋","♡"][i]}</i>{x}</Link>)}</div>
      </section>

      <section className="host-cta">
        <div><span className="eyebrow">For hosts & makers</span><h2>You bring the idea.<br/><em>We’ll bring the crowd.</em></h2><p>Everything you need to create, share, and grow memorable events—all in one place.</p><Link href="/organizer/dashboard" className="button button-light">Start creating <ArrowRight size={17}/></Link></div>
        <div className="host-stats"><div><b>12K+</b><span>active attendees</span></div><div><b>480+</b><span>events hosted</span></div><div><b>4.9</b><span>average rating</span></div></div>
      </section>
      <Footer />
    </main>
  );
}
