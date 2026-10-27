
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  HeartHandshake,
  Compass,
  Eye,
  Building2,
  MapPin,
} from "lucide-react";
import "./About.css";

const WHATSAPP_NUMBER = "917780621225";

const WHATSAPP_LINK = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export default function About() {
  const values = [
    {
      icon: ShieldCheck,
      title: "Transparent Communication",
      description:
        "Clear conversations and relevant property information to help you evaluate your options with confidence.",
    },
    {
      icon: HeartHandshake,
      title: "Personal Attention",
      description:
        "Your budget, priorities and preferences guide every property discussion and recommendation.",
    },
    {
      icon: Compass,
      title: "Independent Property Guidance",
      description:
        "Explore suitable properties and understand your options with personalised, independent guidance.",
    },
    {
      icon: Eye,
      title: "Attention to Detail",
      description:
        "Consider location, property details, suitability and documentation before making a decision.",
    },
  ];

  const services = [
    {
      number: "01",
      title: "Layout Plotting Projects",
      description:
        "Explore residential plots and layout projects based on your preferred location, budget and property goals.",
    },
    {
      number: "02",
      title: "Farmlands",
      description:
        "Discover farmland options for your intended use, long-term plans and land ownership objectives.",
    },
    {
      number: "03",
      title: "Flats & Apartments",
      description:
        "Explore flats and apartments suited to your lifestyle, family requirements and budget.",
    },
    {
      number: "04",
      title: "Villas",
      description:
        "Find villa options that align with your preferred neighbourhood, space requirements and lifestyle.",
    },
  ];

  return (
    <main className="about-page">
      {/* ABOUT HERO */}
      <section className="about-hero">
        <div className="about-hero-image">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"
            alt="Contemporary residential property"
          />
          <div className="about-hero-overlay" />
        </div>

        <div className="about-hero-content">
          <p className="about-eyebrow">
            <span />
            INDEPENDENT PROPERTY ADVISOR · HYDERABAD
          </p>

          <h1>
            Experience that matters.
            <br />
            <em>Guidance you can trust.</em>
          </h1>

          <p className="about-hero-description">
            Led by Koteswararao Kurra, Kotikurra Real Estate brings
            decades of property experience to layout plotting projects,
            farmlands, flats and villas across Hyderabad and surrounding
            areas.
          </p>

          <a
            href={WHATSAPP_LINK(
              "Hello Kotikurra Real Estate, I would like to discuss my property requirements."
            )}
            className="about-primary-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discuss Your Requirements
            <ArrowUpRight size={18} />
          </a>
        </div>

        <span className="about-hero-location">
          HYDERABAD, INDIA
        </span>
      </section>

      {/* OUR STORY */}
      <section className="about-story section-wrap">
        <div className="about-story-image">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85"
            alt="Modern home with landscaped outdoor spaces"
            loading="lazy"
          />
          <div className="about-image-caption">
            PROPERTY EXPERIENCE SINCE 1999
          </div>
        </div>

        <div className="about-story-copy">
          <p className="about-eyebrow dark">
            <span />
            MEET YOUR PROPERTY ADVISOR
          </p>

          <h2>
            Koteswararao Kurra
            <br />
            <em>Independent Property Advisor.</em>
          </h2>

          <p>
            With real estate experience dating back to 1999, Koteswararao
            Kurra offers an independent and personal approach to property
            advisory in Hyderabad. His focus is on understanding each
            client's requirements and helping them explore property
            options suited to their individual goals.
          </p>

          <p>
            From layout plotting projects and farmlands to flats and
            villas, Kotikurra Real Estate helps buyers explore different
            property categories with personal attention, clear
            communication and thoughtful guidance throughout their
            property search.
          </p>

          <div className="about-experience">
            <strong>26+</strong>
            <span>
              Years of real estate experience
              <small>Established experience dating back to 1999</small>
            </span>
          </div>

          <Link to="/projects" className="about-text-link">
            Explore Properties <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* PROPERTY CATEGORIES */}
      <section className="about-services">
        <div className="section-wrap">
          <div className="about-section-heading">
            <div>
              <p className="about-eyebrow dark">
                <span />
                OUR PROPERTY SPECIALITIES
              </p>

              <h2>
                Different properties.
                <br />
                <em>One personal approach.</em>
              </h2>
            </div>

            <p>
              Independent guidance to help you explore property
              opportunities in Hyderabad according to your requirements
              and preferences.
            </p>
          </div>

          <div className="about-services-grid">
            {services.map((service) => (
              <article
                className="about-service-card"
                key={service.number}
              >
                <span className="about-service-number">
                  {service.number}
                </span>

                <h3>{service.title}</h3>

                <p>{service.description}</p>

                <a
                  href={WHATSAPP_LINK(
                    `Hello Kotikurra Real Estate, I would like to enquire about ${service.title}.`
                  )}
                  aria-label={`Enquire about ${service.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discuss your needs <ArrowUpRight size={17} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="values-section">
        <div className="section-wrap">
          <div className="about-section-heading values-heading">
            <div>
              <p className="about-eyebrow light">
                <span />
                WHAT GUIDES US
              </p>

              <h2>
                Built on experience.
                <br />
                <em>Guided by your needs.</em>
              </h2>
            </div>

            <p>
              Property decisions deserve careful consideration,
              transparent communication and an advisor who understands
              your priorities.
            </p>
          </div>

          <div className="values-grid">
            {values.map(({ icon: Icon, title, description }, index) => (
              <article className="value-card" key={title}>
                <span className="value-card-number">
                  0{index + 1}
                </span>

                <div className="value-card-icon">
                  <Icon size={24} strokeWidth={1.5} />
                </div>

                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="about-final-cta">
        <div>
          <p className="about-eyebrow dark">
            <span />
            YOUR PROPERTY JOURNEY
          </p>

          <h2>
            Looking for the
            <br />
            <em>right property?</em>
          </h2>

          <p className="about-cta-description">
            Connect with Koteswararao Kurra to discuss layout plots,
            farmlands, flats or villas in Hyderabad. Tell us what you
            are looking for and start a personalised property
            conversation.
          </p>

          <a
            href={WHATSAPP_LINK(
              "Hello Koteswararao Kurra, I would like to discuss my property requirements in Hyderabad."
            )}
            className="about-primary-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Talk to Your Property Advisor
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="about-cta-icon" aria-hidden="true">
          <Building2 size={100} strokeWidth={0.8} />
          <MapPin size={30} strokeWidth={1.2} />
        </div>
      </section>
    </main>
  );
}
