export type EventItem = {
  slug: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: number;
  color: string;
  icon: string;
  attendees: number;
};

export const events: EventItem[] = [
  { slug: "future-of-design", title: "The Future of Design", category: "Design", date: "18 Jul", time: "6:30 PM", location: "The Glasshouse, Lahore", price: 2500, color: "coral", icon: "✦", attendees: 284 },
  { slug: "midnight-music-fest", title: "Midnight Music Fest", category: "Music", date: "24 Jul", time: "8:00 PM", location: "Arts Council, Karachi", price: 3200, color: "purple", icon: "♫", attendees: 612 },
  { slug: "founders-breakfast", title: "Founders' Breakfast", category: "Business", date: "02 Aug", time: "9:00 AM", location: "COLABS, Islamabad", price: 1800, color: "blue", icon: "↗", attendees: 96 },
  { slug: "slow-living-workshop", title: "The Art of Slow Living", category: "Lifestyle", date: "09 Aug", time: "11:00 AM", location: "Nishat Hotel, Lahore", price: 1500, color: "green", icon: "❋", attendees: 128 },
  { slug: "code-connect-2026", title: "Code & Connect 2026", category: "Technology", date: "16 Aug", time: "10:00 AM", location: "Expo Centre, Karachi", price: 4000, color: "navy", icon: "⌘", attendees: 430 },
  { slug: "ceramic-sundays", title: "Ceramic Sundays", category: "Workshop", date: "23 Aug", time: "2:00 PM", location: "Studio 7, Lahore", price: 2200, color: "sand", icon: "◒", attendees: 42 },
];

export const stats = [
  { label: "Upcoming events", value: "08", trend: "+2 this month" },
  { label: "Tickets sold", value: "1,284", trend: "+18.2%" },
  { label: "Total revenue", value: "Rs 2.4M", trend: "+12.5%" },
  { label: "Avg. attendance", value: "87%", trend: "+4.1%" },
];
