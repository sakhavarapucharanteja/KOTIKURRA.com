
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

const API_URL = "http://localhost:5000";

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
      {/* HERO VIDEO — kept unchanged */}
      <section className="lux-hero">
        <video
          className="lux-hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=90"
        >
          <source src="/videos/luxury-home.mp4" type="video/mp4" />
        </video>

        <div className="lux-hero-overlay" />

        <div className="lux-hero-inner">
          <div className="lux-hero-content">
            <div className="lux-overline lux-overline-light">
              <span className="lux-overline-rule" />
              KOTTIKURRA REAL ESTATE · HYDERABAD
            </div>

            <h1>
              Exceptional spaces.
              <br />
              <em>Extraordinary living.</em>
            </h1>

            <p>
              Discover properties that reflect your aspirations. Thoughtful
              choices, meaningful spaces, and a better way to find where you
              belong.
            </p>

            <div className="lux-hero-actions">
              <Link to="/projects" className="lux-btn lux-btn-white">
                Explore Our Properties
                <ArrowUpRight size={18} />
              </Link>

              <Link to="/contact" className="lux-hero-secondary">
                Connect With Us
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <div className="lux-hero-bottom">
            <a href="#lux-intro" className="lux-scroll-link">
              <span className="lux-scroll-icon">
                <ArrowDown size={18} />
              </span>
              SCROLL TO DISCOVER
            </a>

            <div className="lux-hero-bottom-right">
              <span>CURATED PROPERTY EXPERIENCES</span>
              <span className="lux-bottom-divider" />
              <span>HYDERABAD, INDIA</span>
            </div>
          </div>
        </div>

        <span className="lux-hero-side-label">
          A DIFFERENT PERSPECTIVE ON REAL ESTATE
        </span>
      </section>

      {/* SINCE 2020 */}
      <section className="lux-intro lux-container" id="lux-intro">
        <div className="lux-intro-label">
          <span className="lux-section-index">01 / OUR JOURNEY</span>
          <span className="lux-mini-line" />
          <span className="lux-section-index">EST. 2020</span>
        </div>

        <div className="lux-intro-main">
          <div className="lux-overline">
            <span className="lux-overline-rule" />
            KOTTIKURRA REAL ESTATE
          </div>

          <h2>
            Excellence in Real Estate
            <br />
            <em>Since 2020.</em>
          </h2>

          <div className="lux-intro-bottom">
            <p>
              Since 2020, Kottikurra Real Estate has focused on helping people
              explore property opportunities with thoughtful guidance,
              transparent communication, and a personal approach.
            </p>
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
                KOTTIKURRA REAL ESTATE
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

      {/* WHY CHOOSE US — kept unchanged */}
      <section className="lux-philosophy" id="why-choose-us">
        <div className="lux-philosophy-image">
          <img
            src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=90"
            alt="Contemporary residential interior"
            loading="lazy"
          />
          <span className="lux-image-tag">WHY KOTTIKURRA</span>
        </div>

        <div className="lux-philosophy-content">
          <div className="lux-overline">
            <span className="lux-overline-rule" />
            WHY CHOOSE US
          </div>

          <h2>
            Property choices.
            <br />
            <em>With confidence.</em>
          </h2>

          <p className="lux-philosophy-lead">
            A thoughtful, personal approach to your property journey.
          </p>

          <p className="lux-philosophy-body">
            We listen to your priorities, share clear information, and help you
            explore property options that suit your needs.
          </p>

          <div className="lux-benefits">
            <div>
              <ShieldCheck size={21} />
              <span>Transparent communication</span>
              <Check size={15} />
            </div>

            <div>
              <Compass size={21} />
              <span>Guidance built around your needs</span>
              <Check size={15} />
            </div>

            <div>
              <Handshake size={21} />
              <span>Support through your journey</span>
              <Check size={15} />
            </div>
          </div>

          <Link to="/contact" className="lux-btn lux-btn-dark">
            Talk to Our Team <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
