import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, Phone, Mail } from "lucide-react";

const PHONE_DISPLAY = "+91 XXXXX XXXXX"; // Replace with real phone
const PHONE_LINK = "91XXXXXXXXXX"; // Digits only, with country code
const EMAIL = "info@kottikurra.com"; // Replace if needed

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-column">
          <Link to="/" className="brand footer-brand">
            <span className="brand-mark">K</span>
            <span className="brand-copy">
              <strong>KOTTIKURRA</strong>
              <small>REAL ESTATE</small>
            </span>
          </Link>
          <p>
            Helping you explore properties and make informed real estate
            decisions with clarity, care, and confidence.
          </p>
          <Link className="footer-text-link" to="/about">
            Discover our approach <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="footer-column footer-contact">
          <h3>Get in touch</h3>
          <p><MapPin size={17} /> Hyderabad, Telangana, India</p>
          <a href={`tel:+${PHONE_LINK}`}><Phone size={17} /> {PHONE_DISPLAY}</a>
          <a href={`mailto:${EMAIL}`}><Mail size={17} /> {EMAIL}</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Kottikurra Real Estate. All rights reserved.</span>
        <span>Designed with care for better living.</span>
      </div>
    </footer>
  );
}