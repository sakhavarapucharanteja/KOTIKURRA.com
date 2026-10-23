import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, HeartHandshake, Compass, Eye } from "lucide-react";

export default function About() {
  return (
    <>
      <section className="about-story section section-wrap">
        <div className="about-story-image">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85"
            alt="Modern home with carefully designed interiors"
          />
        </div>
        <div className="about-story-copy">
          <p className="eyebrow">WHO WE ARE</p>
          <h2>Your goals deserve a <em>thoughtful approach.</em></h2>
          <p>
            Kottikurra Real Estate aims to make property discovery more
            approachable. Whether you are searching for a home, considering
            a plot, or exploring a commercial space, we focus on understanding
            your requirements and helping you explore suitable options.
          </p>
          <p>
            Our approach is built around clear conversations, attention to
            your priorities, and a commitment to helping you ask the right
            questions before making a decision.
          </p>
          <Link to="/projects" className="btn btn-primary">Explore properties <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="values-section">
        <div className="section-wrap">
          <div className="section-heading centered-heading">
            <div>
              <p className="eyebrow">WHAT GUIDES US</p>
              <h2>Our values, <em>in every conversation.</em></h2>
            </div>
          </div>
          <div className="values-grid">
            <article className="value-card">
              <span><ShieldCheck size={25} /></span>
              <h3>Transparency</h3>
              <p>We value honest communication and clear information throughout the property search.</p>
            </article>
            <article className="value-card">
              <span><HeartHandshake size={25} /></span>
              <h3>People First</h3>
              <p>Your requirements, preferences, and questions should remain central to the process.</p>
            </article>
            <article className="value-card">
              <span><Compass size={25} /></span>
              <h3>Thoughtful Guidance</h3>
              <p>We help you compare options and understand the next steps before moving forward.</p>
            </article>
            <article className="value-card">
              <span><Eye size={25} /></span>
              <h3>Attention to Detail</h3>
              <p>We encourage careful review of property details, documents, and suitability.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <p className="eyebrow">YOUR PROPERTY JOURNEY</p>
        <h2>Let's find the right<br /><em>way forward.</em></h2>
        <p>Share your requirements with our team and start exploring your options.</p>
        <Link to="/contact" className="btn btn-primary">Talk to our team <ArrowRight size={16} /></Link>
      </section>
    </>
  );
}