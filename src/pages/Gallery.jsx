
import { useEffect, useMemo, useState } from "react";
import { X, ArrowUpRight } from "lucide-react";

const API_URL = "https://koti-kurra-api.onrender.com/api/projects";

function getCategory(project) {
  const type = (project.type || "").toLowerCase();

  if (type.includes("land") || type.includes("plot")) return "Land";
  if (
    type.includes("interior") ||
    type.includes("apartment") ||
    type.includes("flat")
  ) {
    return "Interiors";
  }
  if (
    type.includes("villa") ||
    type.includes("home") ||
    type.includes("residence")
  ) {
    return "Homes";
  }

  return "Architecture";
}

function getGalleryItems(projects) {
  const items = [];

  projects.forEach((project) => {
    const category = getCategory(project);

    if (project.coverPhoto?.url) {
      items.push({
        id: `${project._id}-cover`,
        title: project.name || "Property",
        category,
        image: project.coverPhoto.url,
      });
    }

    (project.gallery || []).forEach((photo, index) => {
      if (photo?.url) {
        items.push({
          id: photo._id || `${project._id}-gallery-${index}`,
          title: project.name || "Property",
          category,
          image: photo.url,
        });
      }
    });
  });

  // Avoid showing the same image more than once.
  return items.filter(
    (item, index, array) =>
      array.findIndex((other) => other.image === item.image) === index
  );
}

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Could not load projects (${response.status}).`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("The projects API returned an unexpected response.");
        }

        setProjects(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Gallery loading error:", err);
          setError("Unable to load gallery photos. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => controller.abort();
  }, []);

  const galleryItems = useMemo(
    () => getGalleryItems(projects),
    [projects]
  );

  const categories = useMemo(
    () => ["All", ...new Set(galleryItems.map((item) => item.category))],
    [galleryItems]
  );

  const visibleItems = galleryItems.filter(
    (item) => filter === "All" || item.category === filter
  );

  return (
    <>
      <section className="section section-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE GALLERY</p>
            <h2>
              Details make the <em>difference.</em>
            </h2>
          </div>
        </div>

        {!loading && !error && galleryItems.length > 0 && (
          <div className="gallery-filters">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={`filter-button ${
                  filter === item ? "selected" : ""
                }`}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <p role="status">Loading property photos...</p>
        )}

        {error && (
          <div role="alert">
            <p>{error}</p>
            <button
              type="button"
              className="filter-button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && galleryItems.length === 0 && (
          <p>
            No gallery photos have been added yet. Upload a cover photo or
            gallery photos for a project from the admin dashboard.
          </p>
        )}

        {!loading && !error && visibleItems.length > 0 && (
          <div className="gallery-grid">
            {visibleItems.map((item) => (
              <button
                type="button"
                className="gallery-item"
                key={item.id}
                onClick={() => setSelected(item)}
                aria-label={`View ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                />

                <span className="gallery-overlay">
                  <span>
                    <small>{item.category}</small>
                    <strong>{item.title}</strong>
                  </span>
                  <span className="gallery-arrow">
                    <ArrowUpRight size={20} />
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setSelected(null)}
            aria-label="Close image"
          >
            <X size={25} />
          </button>

          <img
            src={selected.image}
            alt={selected.title}
            onClick={(event) => event.stopPropagation()}
          />

          <p>{selected.title}</p>
        </div>
      )}
    </>
  );
}
