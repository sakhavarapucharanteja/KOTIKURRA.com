
import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  ArrowUpRight,
  Send,
  CheckCircle2,
  X,
} from "lucide-react";

const WHATSAPP_NUMBER = "917780621225";
const CONTACT_EMAIL = "kotikurra9396211097@gmail.com";
const CONTACT_PHONE = "+91 7780621225";

const GOOGLE_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbzuT5k-uU4L_xTvbgMofZLkFBbHPlp-IEpkkBXIQ7ZffdwAgG-QxmaEu_YA3IJKf6U4/exec";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    interest: "Buying a property",
    message: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const name = form.name.trim();
    const phone = form.phone.trim();
    const requirements = form.message.trim();

    if (!name) {
      setError("Please enter your name.");
      return;
    }

    if (!/^[0-9+\-\s()]{8,18}$/.test(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(
      GOOGLE_SHEETS_URL
    )) {
      setError("The Google Sheets URL is not configured correctly.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          name,
          phone,
          interest: form.interest,
          requirements,
        }),
      });

      /*
       * A no-cors response is opaque. The browser cannot confirm
       * whether Google Apps Script successfully saved the enquiry.
       */
      if (response.type !== "opaque" && !response.ok) {
        throw new Error("Enquiry submission failed.");
      }

      setForm({
        name: "",
        phone: "",
        interest: "Buying a property",
        message: "",
      });

      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Enquiry submission error:", err);

      setError(
        "Unable to send your enquiry. Please try again or contact us on WhatsApp."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function closeSuccessPopup() {
    setShowSuccessPopup(false);
  }

  return (
    <>
      <section className="section section-wrap contact-layout">
        <div className="contact-info">
          <p className="eyebrow">GET IN TOUCH</p>

          <h2>
            Every great move
            <br />
            starts with a <em>conversation.</em>
          </h2>

          <p className="contact-intro">
            Looking to buy a home, explore land, or find a commercial
            property? Send us your requirements and we'll start from there.
          </p>

          <div className="contact-detail">
            <span>
              <Phone size={19} />
            </span>
            <div>
              <small>CALL US</small>
              <a href={`tel:${CONTACT_PHONE.replace(/[^\d+]/g, "")}`}>
                {CONTACT_PHONE}
              </a>
            </div>
          </div>

          <div className="contact-detail">
            <span>
              <Mail size={19} />
            </span>
            <div>
              <small>EMAIL US</small>
              <a href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          <div className="contact-detail">
            <span>
              <MapPin size={19} />
            </span>
            <div>
              <small>LOCATION</small>
              <p>Hyderabad, Telangana, India</p>
            </div>
          </div>

          <div className="contact-detail">
            <span>
              <Clock size={19} />
            </span>
            <div>
              <small>AVAILABILITY</small>
              <p>Contact us to arrange a conversation</p>
            </div>
          </div>

          <a
            className="contact-whatsapp"
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Message us on WhatsApp <ArrowUpRight size={16} />
          </a>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <p className="eyebrow">PROPERTY ENQUIRY</p>

          <h2>
            How can we <em>help?</em>
          </h2>

          <label>
            Your name *
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              maxLength={100}
              required
            />
          </label>

          <label>
            Phone number *
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              autoComplete="tel"
              maxLength={18}
              required
            />
          </label>

          <label>
            What are you interested in?
            <select
              name="interest"
              value={form.interest}
              onChange={handleChange}
            >
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
              rows={4}
              maxLength={3000}
            />
          </label>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary form-submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Send enquiry"}
            {!submitting && <Send size={16} />}
          </button>

          <p className="form-note">
            Your enquiry details will be sent to our property enquiry
            spreadsheet.
          </p>
        </form>
      </section>

      {showSuccessPopup && (
        <div
          className="success-popup-overlay"
          onClick={closeSuccessPopup}
        >
          <div
            className="success-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-popup-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="success-popup-close"
              aria-label="Close popup"
              onClick={closeSuccessPopup}
            >
              <X size={22} />
            </button>

            <div className="success-popup-icon">
              <CheckCircle2 size={38} />
            </div>

            <p className="eyebrow">KOTIKURRA REAL ESTATE</p>

            <h2 id="success-popup-title">
              Enquiry Submitted!
            </h2>

            <p className="success-popup-message">
              Thank you for reaching out to us. We look forward to
              helping you find the right property. Our team will
              connect with you soon.
            </p>

            <button
              type="button"
              className="success-popup-button"
              onClick={closeSuccessPopup}
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}
    </>
  );
}
