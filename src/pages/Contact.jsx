import { useState } from "react";
import { Mail, MapPin, Phone, Clock, ArrowUpRight, Send } from "lucide-react";

const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // Replace with real WhatsApp number
const CONTACT_EMAIL = "info@kottikurra.com"; // Replace with real email
const CONTACT_PHONE = "+91 XXXXX XXXXX"; // Replace with real phone number

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    interest: "Buying a property",
    message: "",
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!/^[0-9+\-\s()]{8,18}$/.test(form.phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (WHATSAPP_NUMBER.includes("X")) {
      setError("Please set the real WhatsApp number in Contact.jsx before using this form.");
      return;
    }

    const message = [
      "Hello Kottikurra Real Estate,",
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Interested in: ${form.interest}`,
      `Message: ${form.message || "I would like to know more."}`,
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <>
      <section className="section section-wrap contact-layout">
        <div className="contact-info">
          <p className="eyebrow">GET IN TOUCH</p>
          <h2>Every great move<br />starts with a <em>conversation.</em></h2>
          <p className="contact-intro">
            Looking to buy a home, explore land, or find a commercial property?
            Send us your requirements and we'll start from there.
          </p>

          <div className="contact-detail">
            <span><Phone size={19} /></span>
            <div><small>CALL US</small><a href={`tel:${CONTACT_PHONE.replace(/[^\d+]/g, "")}`}>{CONTACT_PHONE}</a></div>
          </div>
          <div className="contact-detail">
            <span><Mail size={19} /></span>
            <div><small>EMAIL US</small><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div>
          </div>
          <div className="contact-detail">
            <span><MapPin size={19} /></span>
            <div><small>LOCATION</small><p>Hyderabad, Telangana, India</p></div>
          </div>
          <div className="contact-detail">
            <span><Clock size={19} /></span>
            <div><small>AVAILABILITY</small><p>Contact us to arrange a conversation</p></div>
          </div>

          <a
            className="contact-whatsapp"
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
          >
            Message us on WhatsApp <ArrowUpRight size={16} />
          </a>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <p className="eyebrow">PROPERTY ENQUIRY</p>
          <h2>How can we <em>help?</em></h2>

          <label>
            Your name *
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </label>

          <label>
            Phone number *
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              autoComplete="tel"
              required
            />
          </label>

          <label>
            What are you interested in?
            <select name="interest" value={form.interest} onChange={handleChange}>
              <option>Buying a property</option>
              <option>Residential property</option>
              <option>Commercial property</option>
              <option>Plot or land</option>
              <option>Selling a property</option>
              <option>General enquiry</option>
            </select>
          </label>

          <label>
            Tell us a little more
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Preferred location, budget, property type..."
              rows="4"
            />
          </label>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button type="submit" className="btn btn-primary form-submit">
            Send enquiry <Send size={16} />
          </button>
          <p className="form-note">Your enquiry will open in WhatsApp so you can send it to our team.</p>
        </form>
      </section>
    </>
  );
}