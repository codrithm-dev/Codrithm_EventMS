"use client";

import Link from "next/link";
import { Menu, Search, Ticket, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="navbar">
      <Link href="/" className="brand"><span className="brand-mark">c</span>coderithm <small className="brand-sub">events</small></Link>
      <nav className={open ? "nav-links open" : "nav-links"}>
        <Link href="/events">Discover</Link>
        <Link href="/organizer/dashboard">Create an event</Link>
        <Link href="/about">About</Link>
      </nav>
      <div className="nav-actions">
        <button className="icon-button" aria-label="Search"><Search size={19} /></button>
        <Link href="/login" className="text-link">Log in</Link>
        <Link href="/register" className="button button-dark"><Ticket size={17} /> Get started</Link>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
      </div>
    </header>
  );
}
