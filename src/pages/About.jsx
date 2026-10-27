
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
  Handshake,
} from "lucide-react";
import "./About.css";

export default function About() {
  const values = [
    {
      icon: ShieldCheck,
      title: "Transparent Communication",
      description:
        "Clear conversations and relevant information to help you evaluate your property options.",
    },
    {
      icon: HeartHandshake,
      title: "Personal Attention",
      description:
        "Your budget, priorities and preferences guide the property search and discussion.",
    },
    {
      icon: Compass,
      title: "Thoughtful Guidance",
      description:
        "Compare suitable options and understand the next steps before making a property decision.",
    },
    {
      icon: Eye,
      title: "Attention to Detail",
      description:
        "Consider location, property details, suitability and documentation as part of your decision.",
    },
  ];

  const services = [
    {
      number: "01",
      title: "Buying Assistance",
      description:
        "Explore property options based on your requirements, preferred location and budget.",
    },
    {
      number: "02",
      title: "Investment Property Search",
      description:
        "Find properties to evaluate in line with your investment objectives and risk preferences.",
    },
    {
      number: "03",
      title: "Selling Assistance",
      description:
        "Discuss your selling requirements and explore the next steps for your property.",
    },
    {
      number: "04",
      title: "Plots & Land Advisory",
      description:
        "Explore plots and land according to your intended use and property goals.",
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
            INDEPENDENT PROPERTY ADVISORY · HYDERABAD
          </p>

          <h1>
            Real estate is personal.
            <br />
            <em>Your guidance should be too.</em>
          </h1>

          <p className="about-hero-description">
            A personal approach to buying, selling, investment property
            searches, and exploring plots and land in Hyderabad.
          </p>

          <Link to="/contact" className="about-primary-button">
            Discuss Your Requirements
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <span className="about-hero-location">
          HYDERABAD, INDIA
        </span>
      </section>

      {/* OUR APPROACH */}
      <section className="about-story section-wrap">
        <div className="about-story-image">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85"
            alt="Modern home surrounded by landscaped outdoor spaces"
            loading="lazy"
          />
          <div className="about-image-caption">
            A MORE PERSONAL PROPERTY JOURNEY
          </div>
        </div>

        <div className="about-story-copy">
          <p className="about-eyebrow dark">
            <span />
            OUR APPROACH
          </p>

          <h2>
            Your goals deserve a
            <br />
            <em>thoughtful approach.</em>
          </h2>

          <p>
            Kottikurra Real Estate takes an independent, personal
            approach to property advisory in Hyderabad. Every buyer,
            seller and investor has different priorities, and we believe
            those priorities should shape the conversation.
          </p>

          <p>
            With real estate experience dating back to 1999, our
            approach centres on understanding your requirements,
            discussing available options and helping you make informed
            decisions. The aim is to make your property journey clearer,
            more considered and better aligned with your needs.
          </p>

          <div className="about-experience">
            <strong>1999</strong>
            <span>
              Experience in real estate
              <small>Personal guidance. Individual attention.</small>
            </span>
          </div>

          <Link to="/projects" className="about-text-link">
            Explore Properties <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* ADVISORY SERVICES */}
      <section className="about-services">
        <div className="section-wrap">
          <div className="about-section-heading">
            <div>
              <p className="about-eyebrow dark">
                <span />
                HOW WE CAN HELP
              </p>

              <h2>
                Your property goals.
                <br />
                <em>Our personal approach.</em>
              </h2>
            </div>

            <p>
              Support shaped around what you want to buy, sell or
              explore in Hyderabad.
            </p>
          </div>

          <div className="about-services-grid">
            {services.map((service) => (
              <article className="about-service-card" key={service.number}>
                <span className="about-service-number">
                  {service.number}
                </span>

                <h3>{service.title}</h3>

                <p>{service.description}</p>

                <Link to="/contact" aria-label={`Enquire about ${service.title}`}>
                  Discuss your needs <ArrowUpRight size={17} />
                </Link>
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
                Principles behind
                <br />
                <em>every conversation.</em>
              </h2>
            </div>

            <p>
              Property decisions deserve careful thought, clear
              information and a conversation that puts your needs first.
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
            Let's talk about
            <br />
            <em>what comes next.</em>
          </h2>

          <p className="about-cta-description">
            Tell us what you are looking for. Start a conversation
            about your property requirements in Hyderabad.
          </p>

          <Link to="/contact" className="about-primary-button">
            Talk to Your Property Advisor
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="about-cta-icon" aria-hidden="true">
          <Building2 size={100} strokeWidth={0.8} />
          <MapPin size={30} strokeWidth={1.2} />
        </div>
      </section>
    </main>
  );
}
