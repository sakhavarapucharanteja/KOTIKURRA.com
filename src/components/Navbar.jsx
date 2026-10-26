import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Phone, ArrowUpRight } from "lucide-react";

const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // Replace with the real number

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Projects", path: "/projects" },
    { label: "Gallery", path: "/gallery" },
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" },
  ];

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <span>Thoughtful spaces. Trusted guidance.</span>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
            <Phone size={14} /> Speak with our team
          </a>
        </div>
      </div>

      <header className="site-header">
        <div className="nav-inner">
          
          <Link
            to="/"
            className="brand"
            onClick={closeMenu}
            aria-label="Kottikurra Real Estate Property Advisor in Hyderabad"
          >
            <span className="brand-mark">K</span>

            <span className="brand-copy">
              <strong>KOTTIKURRA</strong>
              <small>Independent Real Estate Property Advisor · Hyderabad</small>
            </span>
          </Link>


          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <nav className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                end={item.path === "/"}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/contact" className="nav-cta" onClick={closeMenu}>
              Let's Talk <ArrowUpRight size={16} />
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}