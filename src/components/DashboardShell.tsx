"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bell, CalendarDays, CheckSquare, ChevronDown, Home, LogOut, Menu, PlusCircle, Settings, Ticket, Users, X } from "lucide-react";
import { useState } from "react";

const menus = {
  user: [
    ["Overview", "/user/dashboard", Home], ["My events", "/user/events", CalendarDays], ["My tickets", "/user/tickets", Ticket], ["Profile", "/user/profile", Users], ["Settings", "/user/settings", Settings],
  ],
  organizer: [
    ["Overview", "/organizer/dashboard", Home], ["My events", "/organizer/events", CalendarDays], ["Create event", "/organizer/events/create", PlusCircle], ["Registrations", "/organizer/registrations", Users], ["Waitlist", "/organizer/waitlist", Users], ["Attendance", "/organizer/attendance", CheckSquare], ["Analytics", "/organizer/analytics", BarChart3],
  ],
  admin: [
    ["Overview", "/admin/dashboard", Home], ["Users", "/admin/users", Users], ["Organizers", "/admin/organizers", Users], ["Events", "/admin/events", CalendarDays], ["Analytics", "/admin/analytics", BarChart3], ["Settings", "/admin/settings", Settings],
  ],
} as const;

export function DashboardShell({ role, children }: { role: keyof typeof menus; children: React.ReactNode }) {
  const path = usePathname(); const [open, setOpen] = useState(false);
  return <div className="dashboard-shell">
    <aside className={open ? "sidebar open" : "sidebar"}>
      <div className="sidebar-top"><Link href="/" className="brand"><span className="brand-mark">c</span>coderithm <small className="brand-sub">events</small></Link><button onClick={()=>setOpen(false)}><X/></button></div>
      <div className="workspace"><span className="workspace-icon">CD</span><div><small>{role === "admin" ? "Platform" : "Workspace"}</small><b>{role === "user" ? "Farha's account" : role === "admin" ? "Coderithm Admin" : "Coderithm Events"}</b></div><ChevronDown size={16}/></div>
      <nav className="side-nav"><small>MENU</small>{menus[role].map(([name,href,Icon])=><Link href={href} key={href} className={path===href?"active":""}><Icon size={18}/>{name}</Link>)}</nav>
      <div className="side-bottom"><Link href="/"><LogOut size={18}/> Sign out</Link><div className="side-profile"><span>FA</span><div><b>Farha Ahmad</b><small>{role}</small></div></div></div>
    </aside>
    <div className="dashboard-main">
      <header className="dash-header"><button className="dash-menu" onClick={()=>setOpen(true)}><Menu/></button><div><span>Thursday, 2 July</span></div><div><button className="icon-button"><Bell size={19}/><i></i></button><span className="header-avatar">FA</span></div></header>
      {children}
    </div>
  </div>
}
