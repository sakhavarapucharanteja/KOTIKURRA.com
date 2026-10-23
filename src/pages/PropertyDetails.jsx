import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Building2,
  Images,
  Ruler,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import "./PropertyDetails.css";

const API_URL = "http://localhost:5000";

export default function PropertyDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProject() {
      setLoading(true);
      setError("");
      setProject(null);
      setActiveImage("");

      try {
        if (!id) {
          throw new Error("No project ID was provided.");
        }

        const response = await fetch(
          `${API_URL}/api/projects/${encodeURIComponent(id)}`,
          { signal: controller.signal }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.error ||
              (response.status === 404
                ? "This project could not be found."
                : `Unable to load project (${response.status}).`)
          );
        }

        if (!data || !data._id) {
          throw new Error("The server returned invalid project data.");
        }

        setProject(data);
        setActiveImage(data.coverPhoto?.url || "");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Project details error:", err);

          setError(
            err.message === "Failed to fetch"
              ? "Cannot connect to the project server. Make sure the backend is running."
              : err.message || "Unable to load this project."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <section className="project-details-message" role="status">
        <RefreshCw size={28} />
        <h1>Loading project details...</h1>
        <p>Please wait while we retrieve the project information.</p>
      </section>
    );
  }

  if (error || !project) {
    return (
      <section className="project-details-message" role="alert">
        <Building2 size={36} />
        <h1>{error || "Project not found"}</h1>
        <p>
          The project may have been removed or is temporarily unavailable.
        </p>
        <Link to="/projects" className="project-back-link">
          <ArrowLeft size={17} />
          Back to Projects
        </Link>
      </section>
    );
  }

  const gallery = Array.isArray(project.gallery)
    ? project.gallery.filter((image) => image?.url)
    : [];

  const images = [
    ...(project.coverPhoto?.url ? [project.coverPhoto] : []),
    ...gallery,
  ];

  const amenities = Array.isArray(project.amenities)
    ? project.amenities.filter(Boolean)
    : [];

  return (
    <main className="project-details-page">
      <div className="project-details-container">
        <Link to="/projects" className="project-back-link">
          <ArrowLeft size={17} />
          Back to Projects
        </Link>

        <header className="project-details-heading">
          <div>
            <p className="eyebrow">
              {project.type || "REAL ESTATE PROJECT"}
            </p>

            <h1>{project.name || "Untitled Project"}</h1>

            <p className="project-details-location">
              <MapPin size={18} />
              <span>{project.location || "Location not specified"}</span>
            </p>
          </div>

          {project.status && (
            <span className="project-status">{project.status}</span>
          )}
        </header>

        {images.length > 0 ? (
          <section className="project-details-gallery">
            <div className="project-main-image">
              <img
                src={activeImage || images[0].url}
                alt={project.name || "Project photo"}
              />
            </div>

            {images.length > 1 && (
              <div className="project-thumbnail-list">
                {images.map((image, index) => (
                  <button
                    key={image.publicId || image.url || index}
                    type="button"
                    className={
                      (activeImage || images[0].url) === image.url
                        ? "active"
                        : ""
                    }
                    onClick={() => setActiveImage(image.url)}
                    aria-label={`View photo ${index + 1}`}
                    aria-pressed={
                      (activeImage || images[0].url) === image.url
                    }
                  >
                    <img
                      src={image.url}
                      alt={`${project.name || "Project"} photo ${index + 1}`}
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>
        ) : (
          <div className="project-details-no-image">
            <Images size={40} />
            <p>No project photos have been uploaded yet.</p>
          </div>
        )}

        <div className="project-details-layout">
          <section className="project-details-description">
            <p className="eyebrow">ABOUT THIS PROJECT</p>
            <h2>Project Overview</h2>

            <p className="project-description-text">
              {project.description || "Project details will be updated soon."}
            </p>

            {amenities.length > 0 && (
              <section className="project-amenities">
                <h2>Amenities and Features</h2>

                <div className="project-amenities-grid">
                  {amenities.map((amenity, index) => (
                    <div key={`${amenity}-${index}`}>
                      <CheckCircle2 size={17} />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </section>

          <aside className="project-details-sidebar">
            <p className="eyebrow">PROJECT INFORMATION</p>

            <div className="project-info-row">
              <span>Project type</span>
              <strong>{project.type || "Not specified"}</strong>
            </div>

            <div className="project-info-row">
              <span>Status</span>
              <strong>{project.status || "Not specified"}</strong>
            </div>

            <div className="project-info-row">
              <span>Project size</span>
              <strong>
                {project.size ? (
                  <>
                    <Ruler size={15} /> {project.size}
                  </>
                ) : (
                  "Not specified"
                )}
              </strong>
            </div>

            <div className="project-info-row">
              <span>Total units</span>
              <strong>{project.units ?? "Not specified"}</strong>
            </div>

            <div className="project-info-row">
              <span>Gallery photos</span>
              <strong>{gallery.length}</strong>
            </div>

            {project.googleMapsUrl && (
              <a
                href={project.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-map-link"
              >
                View on Google Maps
                <ExternalLink size={16} />
              </a>
            )}

            <Link
              to="/contact"
              state={{ propertyName: project.name }}
              className="project-enquiry-button"
            >
              Enquire About This Project
              <ArrowUpRight size={18} />
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}