import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div><Link href="/" className="brand brand-light"><span className="brand-mark">c</span>coderithm <small className="brand-sub">events</small></Link><p>Real people. Remarkable moments.</p></div>
      <div className="footer-links"><Link href="/events">Events</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/login">Log in</Link></div>
      <p className="copyright">© 2026 Coderithm Events. Made for moments.</p>
    </footer>
  );
}
