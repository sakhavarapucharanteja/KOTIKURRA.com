
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  MapPin,
  ShieldCheck,
  Compass,
  Handshake,
  Check,
} from "lucide-react";
import "./Home.css";

const API_URL = "https://koti-kurra-api.onrender.com";

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadFeaturedProjects() {
      try {
        const response = await fetch(`${API_URL}/api/projects`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load projects.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("The projects API returned unexpected data.");
        }

        setFeaturedProjects(
          data.filter((project) => project.featured).slice(0, 3)
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load featured projects:", error);
          setProjectsError("Featured projects are temporarily unavailable.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setProjectsLoading(false);
        }
      }
    }

    loadFeaturedProjects();

    return () => controller.abort();
  }, []);

  return (
    <div className="lux-home">
      {/* HERO VIDEO — independent property advisory */}
      <section className="lux-hero">
        <video
          className="lux-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=90"
        >
          <source src="/videos/luxury-home.mp4" type="video/mp4" />
        </video>

        <div className="lux-hero-overlay" />

        <div className="lux-hero-inner">
          <div className="lux-hero-content">
            <div className="lux-overline lux-overline-light">
              <span className="lux-overline-rule" />
              INDEPENDENT PROPERTY ADVISORY · HYDERABAD
            </div>

            <h1>
              Your property journey.
              <br />
              <em>A more personal perspective.</em>
            </h1>

            <p>
              Personal guidance for buying, selling, finding investment
              properties, and exploring plots and land across Hyderabad.
              Make your next property decision with greater confidence.
            </p>

            <div className="lux-hero-actions">
              <Link to="/contact" className="lux-btn lux-btn-white">
                Discuss Your Requirements
                <ArrowUpRight size={18} />
              </Link>

              <Link to="/projects" className="lux-hero-secondary">
                Explore Properties
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <div className="lux-hero-bottom">
            <a href="#lux-intro" className="lux-scroll-link">
              <span className="lux-scroll-icon">
                <ArrowDown size={18} />
              </span>
              DISCOVER OUR APPROACH
            </a>

            <div className="lux-hero-bottom-right">
              <span>INDEPENDENT PROPERTY GUIDANCE</span>
              <span className="lux-bottom-divider" />
              <span>HYDERABAD, INDIA</span>
            </div>
          </div>
        </div>

        <span className="lux-hero-side-label">
          PROPERTY ADVICE, WITH A PERSONAL TOUCH
        </span>
      </section>


      
      {/* INDEPENDENT PROPERTY ADVISORY */}
      <section className="lux-intro lux-container" id="lux-intro">
        <div className="lux-intro-label">
          <span className="lux-section-index">01 / OUR APPROACH</span>
          <span className="lux-mini-line" />
          <span className="lux-section-index">EXPERIENCE SINCE 1999</span>
        </div>

        <div className="lux-intro-main">
          <div className="lux-overline">
            <span className="lux-overline-rule" />
            KOTIKURRA REAL ESTATE
          </div>

          <h2>
            Real Estate Experience.
            <br />
            <em>Personal Guidance.</em>
          </h2>

          <div className="lux-intro-bottom">
            <p>
              With real estate experience dating back to 1999, Kotikurra
              offers a personal, independent approach to property advisory
              in Hyderabad. Whether you are buying a home, searching for
              investment opportunities, selling a property, or exploring
              plots and land, the focus is on understanding your needs and
              helping you make informed property decisions.
            </p>
          </div>
        </div>
      </section>



      {/* dedicated services section */}
      <section className="advisor-services lux-section">
        <div className="lux-container">
          <div className="advisor-services-heading">
            <div className="lux-overline">
              <span className="lux-overline-rule" />
              HOW WE CAN HELP
            </div>

            <h2>
              Property decisions,
              <br />
              <em>with a personal perspective.</em>
            </h2>

            <p>
              Practical, individual guidance shaped around your property
              goals, priorities and plans in Hyderabad.
            </p>
          </div>

          <div className="advisor-services-grid">
            <article className="advisor-service">
              <span className="advisor-service-number">01</span>
              <h3>Buying Assistance</h3>
              <p>
                Explore suitable properties with guidance tailored
                to your requirements, location and budget.
              </p>
              <Link to="/contact">Discuss your needs <ArrowUpRight size={16} /></Link>
            </article>

            <article className="advisor-service">
              <span className="advisor-service-number">02</span>
              <h3>Selling Assistance</h3>
              <p>
                Get personalised support as you assess your property
                sale and consider your next steps.
              </p>
              <Link to="/contact">Discuss your needs <ArrowUpRight size={16} /></Link>
            </article>

            <article className="advisor-service">
              <span className="advisor-service-number">03</span>
              <h3>Plots &amp; Land</h3>
              <p>
                Explore land and plot opportunities with attention
                to your intended use and requirements.
              </p>
              <Link to="/contact">Discuss your needs <ArrowUpRight size={16} /></Link>
            </article>

            <article className="advisor-service">
              <span className="advisor-service-number">04</span>
              <h3>Investment Property Search</h3>
              <p>
                Identify property options to research in line with
                your objectives, budget and risk considerations.
              </p>
              <Link to="/contact">Discuss your needs <ArrowUpRight size={16} /></Link>
            </article>
          </div>
        </div>
      </section>



      {/* FEATURED PROJECTS — loaded from MongoDB through the API */}
      <section
        className="lux-properties lux-section"
        id="featured-projects"
      >
        <div className="lux-container">
          <div className="lux-section-top">
            <div>
              <div className="lux-overline">
                <span className="lux-overline-rule" />
                KOTIKURRA REAL ESTATE
              </div>

              <h2>
                Featured
                <br />
                <em>Projects.</em>
              </h2>
            </div>

            <div className="lux-section-top-right">
              <Link to="/projects" className="lux-text-action">
                View All Projects <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>

          {projectsLoading && (
            <p role="status">Loading featured projects...</p>
          )}

          {!projectsLoading && projectsError && (
            <p role="alert">{projectsError}</p>
          )}

          {!projectsLoading &&
            !projectsError &&
            featuredProjects.length === 0 && (
              <p>
                No featured projects are available yet. Check back soon.
              </p>
            )}

          {!projectsLoading && !projectsError && featuredProjects.length > 0 && (
            <div className="lux-property-grid">
              {featuredProjects.map((project, index) => (
                <article
                  className="lux-property-card"
                  key={project._id}
                >
                  <Link
                    to={`/projects/${project._id}`}
                    className="lux-property-photo"
                    >
                    <img
                      src={project.coverPhoto?.url}
                      alt={project.name}
                      loading="lazy"
                    />

                    <span className="lux-property-category">
                      {project.type}
                    </span>

                    <span className="lux-property-image-arrow">
                      <ArrowUpRight size={20} />
                    </span>
                  </Link>

                  <div className="lux-property-details">
                    <div className="lux-property-meta">
                      <span>
                        {String(index + 1).padStart(2, "0")} / FEATURED PROJECT
                      </span>
                      <span>{project.status}</span>
                    </div>

                    <h3>{project.name}</h3>

                    <p className="lux-property-location">
                      <MapPin size={15} />
                      {project.location}
                    </p>

                    {project.description && (
                        <p className="lux-property-description">
                            {project.description}
                        </p>
                    )}

                    <div className="lux-property-bottom">
                      <div>
                        <span>PROJECT SIZE</span>
                        <strong>{project.size}</strong>
                        <span>{project.units} units</span>
                      </div>

                      <Link
                        to={`/projects/${project._id}`}
                        className="lux-property-enquire"
                        >
                        Explore <ArrowUpRight size={17} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <p className="lux-disclaimer">
            Please confirm project information and availability before making
            a decision.
          </p>
        </div>
      </section>

      {/* WHY CHOOSE US — independent property advisory */}
      <section className="lux-philosophy">
        <div className="lux-philosophy-image">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85"
            alt="Contemporary residential property in Hyderabad"
            loading="lazy"
          />
          <span className="lux-image-tag">
            INDEPENDENT PROPERTY ADVISORY
          </span>
        </div>

        <div className="lux-philosophy-content">
          <div className="lux-overline">
            <span className="lux-overline-rule" />
            A PERSONAL APPROACH
          </div>

          <h2>
            Real estate is personal.
            <br />
            <em>Your guidance should be too.</em>
          </h2>

          <p className="lux-philosophy-lead">
            Independent advice. A direct conversation. A more personal
            property journey.
          </p>

          <p className="lux-philosophy-body">
            With real estate experience dating back to 1999, Kotikurra
            brings an experienced perspective to property conversations
            in Hyderabad. Every client's needs are different, so the
            focus stays on listening, sharing clear information and
            exploring appropriate options.
          </p>

          <div className="lux-benefits">
            <div>
              <ShieldCheck size={19} />
              <span>Clear and transparent communication</span>
              <Check size={16} />
            </div>
            <div>
              <Compass size={19} />
              <span>Guidance tailored to your requirements</span>
              <Check size={16} />
            </div>
            <div>
              <Handshake size={19} />
              <span>Personal support throughout your property journey</span>
              <Check size={16} />
            </div>
          </div>

          <Link to="/contact" className="lux-btn lux-btn-dark">
            Let's Discuss Your Requirements
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
