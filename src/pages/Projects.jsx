
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Building2 } from "lucide-react";
import PropertyCard from "../components/PropertyCard";
import "./Projects.css";

const API_URL = "http://localhost:5000";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState("All Projects");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/projects`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load projects from the database.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected response from the projects API.");
        }

        setProjects(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Projects loading failed:", err);
          setError(err.message || "Unable to load projects.");
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

  const categories = useMemo(() => {
    const types = [
      ...new Set(
        projects
          .map((project) => project.type?.trim())
          .filter(Boolean)
      ),
    ];

    return ["All Projects", ...types];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory =
        category === "All Projects" || project.type === category;

      const searchableText = [
        project.name,
        project.type,
        project.status,
        project.location,
        project.size,
        project.description,
        ...(Array.isArray(project.amenities) ? project.amenities : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!term || searchableText.includes(term));
    });
  }, [projects, category, search]);

  return (
    <section className="section section-wrap projects-page">
      <div className="projects-toolbar">
        <div>
          <p className="eyebrow">OUR PROJECTS</p>
          <h2>
            Explore <em>our projects.</em>
          </h2>
          <p className="muted-text">
            {loading
              ? "Loading projects..."
              : `${filteredProjects.length} project(s) shown`}
          </p>
        </div>

        <label className="project-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search name, location, or type..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>

      <div className="filter-row">
        <SlidersHorizontal size={17} />

        {categories.map((item) => (
          <button
            type="button"
            key={item}
            className={`filter-button ${
              category === item ? "selected" : ""
            }`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {loading && (
        <div className="empty-state" role="status">
          Loading projects from the database...
        </div>
      )}

      {!loading && error && (
        <div className="empty-state" role="alert">
          <h3>Unable to load projects</h3>
          <p>{error}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filteredProjects.length > 0 && (
        <div className="property-grid">
          {filteredProjects.map((project) => (
            <PropertyCard key={project._id} property={project} />
          ))}
        </div>
      )}

      {!loading && !error && filteredProjects.length === 0 && (
        <div className="empty-state">
          <Building2 size={32} />
          <h3>No projects found</h3>
          <p>
            {projects.length === 0
              ? "Add your first project from the admin dashboard."
              : "Try another search or choose a different category."}
          </p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setCategory("All Projects");
              setSearch("");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      <p className="listing-disclaimer">
        Please confirm project information and availability before making
        a decision.
      </p>
    </section>
  );
}
