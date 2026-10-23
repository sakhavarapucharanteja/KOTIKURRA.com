import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Building2, Images, LogOut, Plus, RefreshCw, X,
  Upload, Trash2, Pencil, Search, Star, MapPin, CheckCircle2, Clock3, ArrowRight
} from "lucide-react";
import "./AdminDashboard.css";

const API_URL = "https://koti-kurra-api.onrender.com";
const emptyForm = {
  name: "", type: "Farm Houses", status: "Ongoing", location: "",
  googleMapsUrl: "", size: "", units: "", description: "", amenities: "", featured: false
};
const projectTypes = ["Farm Houses", "Villa", "Apartments", "Residential Plots", "Commercial", "Resorts", "Other"];
const projectStatuses = ["Ongoing", "Completed", "Upcoming"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [removedGalleryIds, setRemovedGalleryIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [formError, setFormError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [galleryUploadProject, setGalleryUploadProject] = useState(null);
  const [quickGalleryFiles, setQuickGalleryFiles] = useState([]);
  const [quickGalleryError, setQuickGalleryError] = useState("");
  const [quickGallerySaving, setQuickGallerySaving] = useState(false);
  const [galleryImageToDelete, setGalleryImageToDelete] = useState(null);
  const [galleryImageDeleting, setGalleryImageDeleting] = useState(false);
  const username = sessionStorage.getItem("adminUsername") || "Admin";
  const token = () => sessionStorage.getItem("adminToken");

  async function loadProjects() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json().catch(() => []);
      if (!response.ok) throw new Error(data.message || "Unable to load projects.");
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token()) {
      navigate("/admin", { replace: true });
      return;
    }
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);


  function logout() {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUsername");
    navigate("/admin", { replace: true });
  }

  function updateField(event) {
    const { name, value, checked, type } = event.target;
    setForm(current => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setCoverFile(null);
    setGalleryFiles([]);
    setRemovedGalleryIds([]);
    setEditingProject(null);
    setFormError("");
  }

  function openAddForm() {
    resetForm();
    setShowForm(true);
  }

  function openEditForm(project) {
    setEditingProject(project);
    setForm({
      name: project.name || "",
      type: project.type || "Farm Houses",
      status: project.status || "Ongoing",
      location: project.location || "",
      googleMapsUrl: project.googleMapsUrl || "",
      size: project.size || "",
      units: String(project.units ?? ""),
      description: project.description || "",
      amenities: Array.isArray(project.amenities) ? project.amenities.join(", ") : (project.amenities || ""),
      featured: Boolean(project.featured)
    });
    setCoverFile(null);
    setGalleryFiles([]);
    setRemovedGalleryIds([]);
    setFormError("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;
    setShowForm(false);
    resetForm();
  }

  function handleGalleryChange(event) {
    const selected = Array.from(event.target.files || []);
    if (galleryFiles.length + selected.length > 10) {
      setFormError("You can upload a maximum of 10 new gallery photos.");
      event.target.value = "";
      return;
    }
    if (selected.some(file => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)) {
      setFormError("Select image files only, each smaller than 5 MB.");
      event.target.value = "";
      return;
    }
    setGalleryFiles(current => [...current, ...selected]);
    setFormError("");
    event.target.value = "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");
    if (!editingProject && !coverFile) {
      setFormError("Please upload a cover photo.");
      return;
    }
    if (coverFile && (!coverFile.type.startsWith("image/") || coverFile.size > 5 * 1024 * 1024)) {
      setFormError("The cover photo must be an image smaller than 5 MB.");
      return;
    }
    const authToken = token();
    if (!authToken) {
      navigate("/admin", { replace: true });
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "amenities") {
        data.append(key, JSON.stringify(value.split(",").map(item => item.trim()).filter(Boolean)));
      } else {
        data.append(key, String(value));
      }
    });
    if (coverFile) data.append("coverPhoto", coverFile);
    galleryFiles.forEach(file => data.append("galleryPhotos", file));
    if (editingProject) data.append("removeGalleryPublicIds", JSON.stringify(removedGalleryIds));

    setSaving(true);
    try {
      const response = await fetch(
        editingProject ? `${API_URL}/api/projects/${editingProject._id}` : `${API_URL}/api/projects`,
        {
          method: editingProject ? "PUT" : "POST",
          headers: { Authorization: `Bearer ${authToken}` },
          body: data
        }
      );
      const result = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminUsername");
        navigate("/admin", { replace: true });
        return;
      }
      if (!response.ok) throw new Error(result.message || "Unable to save project.");
      const savedProject = result.project || result;
      if (editingProject) {
        setProjects(current => current.map(project => project._id === savedProject._id ? savedProject : project));
        setSuccessMessage(result.message || "Project updated successfully.");
      } else {
        setProjects(current => [savedProject, ...current]);
        setSuccessMessage("Project created successfully.");
      }
      setShowForm(false);
      resetForm();
    } catch (err) {
      setFormError(err.message || "Could not save project.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(project) {
    const authToken = token();
    if (!authToken) {
      navigate("/admin", { replace: true });
      return;
    }
    setDeletingId(project._id);
    setError("");
    setSuccessMessage("");
    try {
      const response = await fetch(`${API_URL}/api/projects/${project._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminUsername");
        navigate("/admin", { replace: true });
        return;
      }
      if (!response.ok) throw new Error(result.message || "Unable to delete project.");
      setProjects(current => current.filter(item => item._id !== project._id));
      setProjectToDelete(null);
      setSuccessMessage(result.message || "Project deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete project.");
    } finally {
      setDeletingId("");
    }
  }

  async function toggleFeatured(project) {
    const authToken = token();
    if (!authToken) {
      navigate("/admin", { replace: true });
      return;
    }
    const data = new FormData();
    data.append("featured", String(!project.featured));
    try {
      const response = await fetch(`${API_URL}/api/projects/${project._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${authToken}` },
        body: data
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminUsername");
        navigate("/admin", { replace: true });
        return;
      }
      if (!response.ok) throw new Error(result.message || "Unable to update featured status.");
      if (result.project) {
        setProjects(current => current.map(item => item._id === result.project._id ? result.project : item));
      } else {
        await loadProjects();
      }
      setSuccessMessage(!project.featured ? "Project marked as featured." : "Project removed from featured.");
      setError("");
    } catch (err) {
      setError(err.message || "Unable to update featured status.");
    }
  }

  function openQuickGalleryUpload(project) {
    setGalleryUploadProject(project);
    setQuickGalleryFiles([]);
    setQuickGalleryError("");
  }

  function handleQuickGalleryFiles(event) {
    const selected = Array.from(event.target.files || []);
    if (quickGalleryFiles.length + selected.length > 10) {
      setQuickGalleryError("Choose up to 10 photos at a time.");
      event.target.value = "";
      return;
    }
    if (selected.some(file => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)) {
      setQuickGalleryError("Select image files only, each smaller than 5 MB.");
      event.target.value = "";
      return;
    }
    setQuickGalleryFiles(current => [...current, ...selected]);
    setQuickGalleryError("");
    event.target.value = "";
  }

  async function submitQuickGalleryUpload(event) {
    event.preventDefault();
    if (!galleryUploadProject || quickGalleryFiles.length === 0) {
      setQuickGalleryError("Choose at least one photo to upload.");
      return;
    }
    const authToken = token();
    if (!authToken) { navigate("/admin", { replace: true }); return; }
    const project = galleryUploadProject;
    const data = new FormData();
    data.append("name", project.name || "");
    data.append("type", project.type || "Farm Houses");
    data.append("status", project.status || "Ongoing");
    data.append("location", project.location || "");
    data.append("googleMapsUrl", project.googleMapsUrl || "");
    data.append("size", project.size || "");
    data.append("units", String(project.units ?? "0"));
    data.append("description", project.description || "");
    data.append("amenities", JSON.stringify(Array.isArray(project.amenities) ? project.amenities : []));
    data.append("featured", String(Boolean(project.featured)));
    data.append("removeGalleryPublicIds", JSON.stringify([]));
    quickGalleryFiles.forEach(file => data.append("galleryPhotos", file));
    setQuickGallerySaving(true);
    setQuickGalleryError("");
    try {
      const response = await fetch(`${API_URL}/api/projects/${project._id}`, {
        method: "PUT", headers: { Authorization: `Bearer ${authToken}` }, body: data
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("adminToken"); sessionStorage.removeItem("adminUsername");
        navigate("/admin", { replace: true }); return;
      }
      if (!response.ok) throw new Error(result.message || "Unable to upload gallery photos.");
      const saved = result.project || result;
      if (saved?._id) setProjects(current => current.map(item => item._id === saved._id ? saved : item));
      else await loadProjects();
      setGalleryUploadProject(null);
      setQuickGalleryFiles([]);
      setSuccessMessage(`${quickGalleryFiles.length} gallery photo(s) uploaded successfully.`);
    } catch (err) {
      setQuickGalleryError(err.message || "Unable to upload gallery photos.");
    } finally { setQuickGallerySaving(false); }
  }

  async function confirmGalleryImageDelete() {
    if (!galleryImageToDelete) return;
    const { project, image } = galleryImageToDelete;
    if (!image?.publicId) {
      setError("This image has no Cloudinary public ID, so it cannot be safely deleted.");
      setGalleryImageToDelete(null);
      return;
    }
    const authToken = token();
    if (!authToken) { navigate("/admin", { replace: true }); return; }
    const data = new FormData();
    data.append("name", project.name || "");
    data.append("type", project.type || "Farm Houses");
    data.append("status", project.status || "Ongoing");
    data.append("location", project.location || "");
    data.append("googleMapsUrl", project.googleMapsUrl || "");
    data.append("size", project.size || "");
    data.append("units", String(project.units ?? "0"));
    data.append("description", project.description || "");
    data.append("amenities", JSON.stringify(Array.isArray(project.amenities) ? project.amenities : []));
    data.append("featured", String(Boolean(project.featured)));
    data.append("removeGalleryPublicIds", JSON.stringify([image.publicId]));
    setGalleryImageDeleting(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/projects/${project._id}`, {
        method: "PUT", headers: { Authorization: `Bearer ${authToken}` }, body: data
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("adminToken"); sessionStorage.removeItem("adminUsername");
        navigate("/admin", { replace: true }); return;
      }
      if (!response.ok) throw new Error(result.message || "Unable to remove gallery photo.");
      const saved = result.project || result;
      if (saved?._id) setProjects(current => current.map(item => item._id === saved._id ? saved : item));
      else await loadProjects();
      setGalleryImageToDelete(null);
      setPreviewImage(null);
      setSuccessMessage("Gallery photo removed successfully.");
    } catch (err) { setError(err.message || "Unable to remove gallery photo."); }
    finally { setGalleryImageDeleting(false); }
  }

  function toggleGalleryRemoval(image) {
    if (!image?.publicId) {
      setFormError("This gallery image has no Cloudinary public ID and cannot be removed here.");
      return;
    }
    setRemovedGalleryIds(current => current.includes(image.publicId)
      ? current.filter(id => id !== image.publicId)
      : [...current, image.publicId]);
  }

  const featuredCount = projects.filter(project => project.featured).length;
  const filteredProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return projects.filter(project => {
      const searchable = [project.name, project.location, project.type, project.status]
        .some(value => String(value || "").toLowerCase().includes(term));
      return (!term || searchable)
        && (typeFilter === "All" || project.type === typeFilter)
        && (statusFilter === "All" || project.status === statusFilter);
    });
  }, [projects, searchTerm, typeFilter, statusFilter]);

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-login-logo">K</div>
          <strong>KOTTIKURRA</strong>
          <small>ADMINISTRATION</small>
        </div>
        <nav className="admin-sidebar-nav" aria-label="Admin dashboard sections">
          <a
            href="#overview"
            className={activeSection === "overview" ? "active" : ""}
            aria-current={activeSection === "overview" ? "location" : undefined}
            onClick={(event) => { event.preventDefault(); setActiveSection("overview"); }}
          >
            <LayoutDashboard size={18} /> Overview
          </a>
          <a
            href="#projects"
            className={activeSection === "projects" ? "active" : ""}
            aria-current={activeSection === "projects" ? "location" : undefined}
            onClick={(event) => { event.preventDefault(); setActiveSection("projects"); }}
          >
            <Building2 size={18} /> Projects
          </a>
          <a
            href="#gallery"
            className={activeSection === "gallery" ? "active" : ""}
            aria-current={activeSection === "gallery" ? "location" : undefined}
            onClick={(event) => { event.preventDefault(); setActiveSection("gallery"); }}
          >
            <Images size={18} /> Gallery
          </a>
        </nav>
        <button className="admin-logout" onClick={logout}><LogOut size={18} /> Sign Out</button>
      </aside>

      <main className="admin-dashboard-main">
        <header className="admin-dashboard-header">
          <div>
            <p className="admin-dashboard-eyebrow">KOTTIKURRA REAL ESTATE</p>
            <h1>Dashboard</h1>
            <p>Manage your projects and website content.</p>
          </div>
          <div className="admin-user">
            <div className="admin-user-avatar">{username.charAt(0).toUpperCase()}</div>
            <span>{username}</span>
          </div>
        </header>

        {successMessage && <div className="admin-success-message">{successMessage}</div>}
        <section
          id="overview"
          className="admin-overview-page"
          style={{ display: activeSection === "overview" ? "block" : "none" }}
        >
          <div className="admin-overview-welcome">
            <div>
              <span className="admin-overview-kicker">YOUR PROPERTY WORKSPACE</span>
              <h2>Good to see you, {username}.</h2>
              <p>Here's a quick look at your Kottikurra projects and website content.</p>
            </div>
            <div className="admin-overview-welcome-icon"><Building2 size={30} /></div>
          </div>

          <div className="admin-overview-stats">
            <article className="admin-overview-stat admin-overview-stat-primary">
              <div className="admin-overview-stat-top"><span>Total Projects</span><span className="admin-overview-stat-icon"><Building2 size={20} /></span></div>
              <strong>{loading ? "—" : projects.length}</strong>
              <small>All listed properties</small>
            </article>
            <article className="admin-overview-stat">
              <div className="admin-overview-stat-top"><span>Featured Projects</span><span className="admin-overview-stat-icon"><Star size={20} /></span></div>
              <strong>{loading ? "—" : featuredCount}</strong>
              <small>Highlighted on your website</small>
            </article>
            <article className="admin-overview-stat">
              <div className="admin-overview-stat-top"><span>Completed</span><span className="admin-overview-stat-icon"><CheckCircle2 size={20} /></span></div>
              <strong>{loading ? "—" : projects.filter(project => project.status === "Completed").length}</strong>
              <small>Completed projects</small>
            </article>
            <article className="admin-overview-stat">
              <div className="admin-overview-stat-top"><span>Gallery Photos</span><span className="admin-overview-stat-icon"><Images size={20} /></span></div>
              <strong>{loading ? "—" : projects.reduce((total, project) => total + (project.gallery?.length || 0), 0)}</strong>
              <small>Images across all projects</small>
            </article>
          </div>

          <div className="admin-overview-content-grid">
            <section className="admin-overview-panel admin-overview-quick-panel">
              <div className="admin-overview-panel-heading">
                <div><h3>Quick actions</h3><p>Common tasks, right where you need them.</p></div>
              </div>
              <div className="admin-overview-quick-actions">
                <button type="button" className="admin-overview-action" onClick={openAddForm}>
                  <span className="admin-overview-action-icon"><Plus size={20} /></span>
                  <span><strong>Add a project</strong><small>Create a new property listing</small></span>
                  <ArrowRight size={17} />
                </button>
                <button type="button" className="admin-overview-action" onClick={() => {
                  if (projects.length) openQuickGalleryUpload(projects[0]);
                  else { setActiveSection("projects"); setSuccessMessage("Create a project first, then you can upload gallery photos."); }
                }}>
                  <span className="admin-overview-action-icon"><Upload size={20} /></span>
                  <span><strong>Upload gallery photos</strong><small>Add photos to a property gallery</small></span>
                  <ArrowRight size={17} />
                </button>
                <button type="button" className="admin-overview-action" onClick={() => setActiveSection("projects")}>
                  <span className="admin-overview-action-icon"><Building2 size={20} /></span>
                  <span><strong>Manage projects</strong><small>Edit details and featured status</small></span>
                  <ArrowRight size={17} />
                </button>
                <button type="button" className="admin-overview-action" onClick={() => setActiveSection("gallery")}>
                  <span className="admin-overview-action-icon"><Images size={20} /></span>
                  <span><strong>Open gallery</strong><small>Preview or remove photos</small></span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </section>

            <section className="admin-overview-panel admin-overview-status-panel">
              <div className="admin-overview-panel-heading">
                <div><h3>Project status</h3><p>Current breakdown by status.</p></div>
              </div>
              {["Ongoing", "Upcoming", "Completed"].map(status => {
                const count = projects.filter(project => project.status === status).length;
                const percent = projects.length ? Math.round((count / projects.length) * 100) : 0;
                return (
                  <div className="admin-overview-status-row" key={status}>
                    <div><span>{status}</span><strong>{loading ? "—" : count}</strong></div>
                    <div className="admin-overview-status-track"><span style={{ width: `${loading ? 0 : percent}%` }} /></div>
                  </div>
                );
              })}
              <button type="button" className="admin-overview-text-link" onClick={() => setActiveSection("projects")}>
                View all projects <ArrowRight size={16} />
              </button>
            </section>
          </div>

          <section className="admin-overview-panel admin-overview-recent-panel">
            <div className="admin-overview-panel-heading admin-overview-recent-heading">
              <div><h3>Recent projects</h3><p>A quick view of your latest property listings.</p></div>
              <button type="button" className="admin-overview-text-link" onClick={() => setActiveSection("projects")}>View all <ArrowRight size={16} /></button>
            </div>
            {loading ? <p className="admin-overview-empty">Loading your projects...</p> : projects.length === 0 ? (
              <div className="admin-overview-empty"><Building2 size={26} /><strong>No projects yet</strong><span>Add your first project to see it here.</span><button type="button" className="admin-primary-button" onClick={openAddForm}><Plus size={16} /> Add Project</button></div>
            ) : (
              <div className="admin-overview-recent-list">
                {projects.slice(0, 4).map(project => (
                  <article className="admin-overview-recent-item" key={project._id}>
                    {project.coverPhoto?.url
                      ? <img src={project.coverPhoto.url} alt={project.name} loading="lazy" />
                      : <div className="admin-overview-recent-placeholder"><Building2 size={22} /></div>}
                    <div className="admin-overview-recent-info">
                      <strong>{project.name}</strong>
                      <span><MapPin size={13} /> {project.location || "Location not set"}</span>
                      <small>{project.type || "Property"}</small>
                    </div>
                    <span className={`admin-overview-status-badge status-${String(project.status || "ongoing").toLowerCase()}`}>{project.status || "Ongoing"}</span>
                    <button type="button" className="admin-overview-edit-button" onClick={() => openEditForm(project)} aria-label={`Edit ${project.name}`}><Pencil size={16} /></button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>

        <section id="projects" className="admin-projects-panel" style={{ display: activeSection === "projects" ? "block" : "none" }}>
          <div className="admin-panel-heading">
            <div><h2>Projects</h2><p>Search, edit, feature, or remove database projects.</p></div>
            <button className="admin-primary-button" onClick={openAddForm}><Plus size={18} /> Add Project</button>
          </div>

          <div className="admin-project-toolbar">
            <label className="admin-search-box"><Search size={18} />
              <input type="search" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Search name, location, type, status..." aria-label="Search projects" />
            </label>
            <select value={typeFilter} onChange={event => setTypeFilter(event.target.value)} aria-label="Filter project type">
              <option value="All">All types</option>{projectTypes.map(type => <option key={type}>{type}</option>)}
            </select>
            <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} aria-label="Filter project status">
              <option value="All">All statuses</option>{projectStatuses.map(status => <option key={status}>{status}</option>)}
            </select>
          </div>

          {loading && <p>Loading projects...</p>}
          {error && <div className="admin-dashboard-error">{error}<button onClick={loadProjects}><RefreshCw size={15} /> Retry</button></div>}
          {!loading && !error && projects.length === 0 && <div className="admin-empty-state"><Building2 size={32} /><h3>No projects yet</h3><p>Add your first project above.</p></div>}
          {!loading && !error && projects.length > 0 && filteredProjects.length === 0 && <div className="admin-empty-state"><Search size={28} /><h3>No matching projects</h3><p>Change your search or filters.</p></div>}

          {!loading && filteredProjects.length > 0 && (
            <div className="admin-project-list">
              {filteredProjects.map(project => (
                <article className="admin-project-row admin-project-row-enhanced" key={project._id}>
                  {project.coverPhoto?.url ? <img src={project.coverPhoto.url} alt={project.name} /> : <div className="admin-project-placeholder"><Building2 size={24} /></div>}
                  <div className="admin-project-info">
                    <h3>{project.name}</h3>
                    <p><MapPin size={13} /> {project.location}</p>
                    <span>{project.type} · {project.status}</span>
                  </div>
                  <div className="admin-project-price">{project.size}<small>{project.units} units</small>{project.featured && <small className="admin-featured-label">Featured</small>}</div>
                  <div className="admin-project-actions">
                    <button type="button" className={`admin-action-button ${project.featured ? "is-featured" : ""}`} onClick={() => toggleFeatured(project)} title="Toggle featured"><Star size={16} /><span>{project.featured ? "Featured" : "Feature"}</span></button>
                    <button type="button" className="admin-action-button" onClick={() => openEditForm(project)}><Pencil size={16} /><span>Edit</span></button>
                    <button type="button" className="admin-action-button admin-action-danger" disabled={deletingId === project._id} onClick={() => setProjectToDelete(project)}>{deletingId === project._id ? <RefreshCw size={16} /> : <Trash2 size={16} />}<span>{deletingId === project._id ? "Deleting..." : "Delete"}</span></button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="gallery" className="admin-gallery-panel" style={{ display: activeSection === "gallery" ? "block" : "none" }}>
          <div className="admin-panel-heading">
            <div>
              <h2>Gallery Management</h2>
              <p>Browse project photos, preview them, or manage each project's gallery.</p>
            </div>
            <div className="admin-gallery-heading-actions">
              <span className="admin-gallery-count">
                {projects.reduce((total, project) => total + (project.gallery?.length || 0), 0)} photos
              </span>
              {projects.length > 0 && <button type="button" className="admin-primary-button" onClick={() => openQuickGalleryUpload(projects[0])}><Upload size={16} /> Upload Photos</button>}
            </div>
          </div>

          {projects.every(project => !project.gallery?.length) ? (
            <div className="admin-empty-state">
              <Images size={32} />
              <h3>No gallery photos yet</h3>
              <p>Choose a project below to upload photos and build its gallery.</p>
              <div className="admin-gallery-project-picker">
                {projects.map(project => (
                  <button key={project._id} type="button" className="admin-secondary-button" onClick={() => openEditForm(project)}>
                    <Upload size={16} /> Add photos to {project.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="admin-gallery-grid">
              {projects.flatMap(project =>
                (project.gallery || []).map((image, index) => ({
                  ...image,
                  key: `${project._id}-${image.publicId || image.url || index}`,
                  project,
                  imageIndex: index
                }))
              ).filter(image => image.url).map(image => (
                <article className="admin-gallery-card" key={image.key}>
                  <button
                    type="button"
                    className="admin-gallery-image-button"
                    onClick={() => setPreviewImage(image)}
                    aria-label={`Preview image from ${image.project.name}`}
                  >
                    <img src={image.url} alt={`${image.project.name} gallery ${image.imageIndex + 1}`} loading="lazy" />
                    <span className="admin-gallery-preview-hint"><Images size={15} /> Preview</span>
                  </button>
                  <div className="admin-gallery-card-info">
                    <div>
                      <strong>{image.project.name}</strong>
                      <span>Photo {image.imageIndex + 1} · {image.project.location || image.project.type}</span>
                    </div>
                    <button
                      type="button"
                      className="admin-gallery-manage-button"
                      onClick={() => openEditForm(image.project)}
                    >
                      <Pencil size={15} /> Manage
                    </button>
                    <button type="button" className="admin-gallery-delete-button" onClick={() => setGalleryImageToDelete({ project: image.project, image })} aria-label={`Delete photo from ${image.project.name}`} title="Delete photo">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div className="admin-gallery-upload-projects">
              <h3>Upload or remove photos</h3>
              <p>Select a project to add new images or mark existing gallery photos for removal.</p>
              <div className="admin-gallery-project-picker">
                {projects.map(project => (
                  <button key={project._id} type="button" className="admin-secondary-button" onClick={() => openEditForm(project)}>
                    <Images size={16} /> Manage {project.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {showForm && (
        <div className="admin-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) closeForm(); }}>
          <section className="admin-project-modal" role="dialog" aria-modal="true" aria-labelledby="admin-project-modal-title">
            <header className="admin-modal-header">
              <div><p className="admin-dashboard-eyebrow">PROJECT MANAGEMENT</p><h2 id="admin-project-modal-title">{editingProject ? "Edit Project" : "Add New Project"}</h2></div>
              <button type="button" className="admin-modal-close" onClick={closeForm} disabled={saving} aria-label="Close form"><X size={21} /></button>
            </header>

            <form className="admin-project-form" onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <div className="admin-form-field"><label htmlFor="project-name">Project Name *</label><input id="project-name" name="name" value={form.name} onChange={updateField} required /></div>
                <div className="admin-form-field"><label htmlFor="project-type">Type *</label><select id="project-type" name="type" value={form.type} onChange={updateField} required>{projectTypes.map(type => <option key={type}>{type}</option>)}</select></div>
                <div className="admin-form-field"><label htmlFor="project-status">Status *</label><select id="project-status" name="status" value={form.status} onChange={updateField} required>{projectStatuses.map(status => <option key={status}>{status}</option>)}</select></div>
                <div className="admin-form-field"><label htmlFor="project-location">Location *</label><input id="project-location" name="location" value={form.location} onChange={updateField} required /></div>
                <div className="admin-form-field"><label htmlFor="project-map">Google Maps URL</label><input id="project-map" name="googleMapsUrl" type="url" value={form.googleMapsUrl} onChange={updateField} /></div>
                <div className="admin-form-field"><label htmlFor="project-size">Size *</label><input id="project-size" name="size" value={form.size} onChange={updateField} required /></div>
                <div className="admin-form-field"><label htmlFor="project-units">Units *</label><input id="project-units" name="units" type="number" min="0" step="1" value={form.units} onChange={updateField} required /></div>
                <div className="admin-form-field admin-form-full"><label htmlFor="project-description">Description</label><textarea id="project-description" name="description" value={form.description} onChange={updateField} rows="4" /></div>
                <div className="admin-form-field admin-form-full"><label htmlFor="project-amenities">Amenities</label><textarea id="project-amenities" name="amenities" value={form.amenities} onChange={updateField} rows="3" placeholder="Swimming Pool, Gym, Clubhouse..." /><small>Separate amenities with commas.</small></div>

                <div className="admin-form-field admin-form-full">
                  <label>{editingProject ? "Cover Photo (optional replacement)" : "Cover Photo *"}</label>
                  {editingProject?.coverPhoto?.url && !coverFile && <div className="admin-current-cover"><img src={editingProject.coverPhoto.url} alt="Current cover" /><span>Current cover is kept unless you choose a replacement.</span></div>}
                  <label className="admin-upload-zone"><Upload size={25} /><strong>{coverFile ? coverFile.name : editingProject ? "Choose replacement cover photo" : "Upload cover photo"}</strong><span>Image · Maximum 5 MB</span><input type="file" accept="image/*" required={!editingProject && !coverFile} onChange={event => { setCoverFile(event.target.files?.[0] || null); setFormError(""); }} /></label>
                  {coverFile && <div className="admin-image-preview"><img src={URL.createObjectURL(coverFile)} alt="Cover preview" /><button type="button" onClick={() => setCoverFile(null)}><Trash2 size={16} /></button></div>}
                </div>

                {editingProject?.gallery?.length > 0 && <div className="admin-form-field admin-form-full">
                  <label>Existing gallery photos — click an image to mark it for removal</label>
                  <div className="admin-existing-gallery">
                    {editingProject.gallery.map((image, index) => {
                      const marked = removedGalleryIds.includes(image.publicId);
                      return <button type="button" key={image.publicId || image.url || index} className={`admin-existing-gallery-item ${marked ? "marked-remove" : ""}`} onClick={() => toggleGalleryRemoval(image)}>
                        {image.url && <img src={image.url} alt={`Gallery ${index + 1}`} />}
                        <span>{marked ? "Marked for removal — click to keep" : "Click to remove"}</span>
                      </button>;
                    })}
                  </div>
                  <small>Gallery changes are saved when you click Save Changes.</small>
                </div>}

                <div className="admin-form-field admin-form-full"><label>Add gallery photos (maximum 10 new photos)</label><label className="admin-upload-zone admin-gallery-upload"><Images size={25} /><strong>Select gallery photos</strong><span>Image files · Maximum 5 MB each</span><input type="file" accept="image/*" multiple onChange={handleGalleryChange} /></label>
                  {galleryFiles.length > 0 && <div className="admin-gallery-previews">{galleryFiles.map((file, index) => <div className="admin-image-preview" key={`${file.name}-${index}`}><img src={URL.createObjectURL(file)} alt={file.name} /><button type="button" onClick={() => setGalleryFiles(current => current.filter((_, i) => i !== index))}><Trash2 size={16} /></button></div>)}</div>}
                </div>

                <label className="admin-featured-checkbox admin-form-full"><input type="checkbox" name="featured" checked={form.featured} onChange={updateField} /><span><strong>Feature this project</strong><small>Featured projects can be highlighted on the homepage.</small></span></label>
              </div>
              {formError && <div className="admin-dashboard-error admin-form-error">{formError}</div>}
              <footer className="admin-modal-actions"><button type="button" className="admin-secondary-button" onClick={closeForm} disabled={saving}>Cancel</button><button type="submit" className="admin-primary-button" disabled={saving}>{saving ? "Saving..." : editingProject ? "Save Changes" : "Create Project"}</button></footer>
            </form>
          </section>
        </div>
      )}

      {projectToDelete && (
        <div className="admin-delete-backdrop" onMouseDown={event => { if (event.target === event.currentTarget && !deletingId) setProjectToDelete(null); }}>
          <section className="admin-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-modal-title" aria-describedby="delete-modal-description">
            <div className="admin-delete-icon"><Trash2 size={26} /></div>
            <h2 id="delete-modal-title">Delete this project?</h2>
            <p id="delete-modal-description">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="admin-delete-project-info">
              <strong>{projectToDelete.name}</strong>
              <span>{projectToDelete.location} · {projectToDelete.type}</span>
            </div>
            <div className="admin-delete-actions">
              <button type="button" className="admin-secondary-button" onClick={() => setProjectToDelete(null)} disabled={Boolean(deletingId)}>Cancel</button>
              <button type="button" className="admin-delete-confirm-button" onClick={() => deleteProject(projectToDelete)} disabled={Boolean(deletingId)}>
                {deletingId === projectToDelete._id ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </section>
        </div>
      )}

      {galleryUploadProject && (
        <div className="admin-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget && !quickGallerySaving) setGalleryUploadProject(null); }}>
          <section className="admin-project-modal admin-quick-gallery-modal" role="dialog" aria-modal="true" aria-labelledby="quick-gallery-title">
            <header className="admin-modal-header">
              <div><p className="admin-dashboard-eyebrow">GALLERY MANAGEMENT</p><h2 id="quick-gallery-title">Upload Photos</h2><p>Add images to {galleryUploadProject.name}</p></div>
              <button type="button" className="admin-modal-close" disabled={quickGallerySaving} onClick={() => setGalleryUploadProject(null)} aria-label="Close upload dialog"><X size={21} /></button>
            </header>
            <form className="admin-project-form" onSubmit={submitQuickGalleryUpload}>
              <div className="admin-form-field admin-form-full"><label htmlFor="quick-gallery-project">Project</label><select id="quick-gallery-project" value={galleryUploadProject._id} onChange={event => { const selected = projects.find(item => item._id === event.target.value); if (selected) setGalleryUploadProject(selected); }}>
                {projects.map(project => <option key={project._id} value={project._id}>{project.name}</option>)}
              </select></div>
              <div className="admin-form-field admin-form-full"><label className="admin-upload-zone admin-gallery-upload"><Images size={25} /><strong>Select multiple gallery photos</strong><span>Up to 10 images · Maximum 5 MB each</span><input type="file" accept="image/*" multiple onChange={handleQuickGalleryFiles} /></label></div>
              {quickGalleryFiles.length > 0 && <div className="admin-quick-gallery-file-list">{quickGalleryFiles.map((file, index) => <div key={`${file.name}-${index}`}><span>{file.name}</span><button type="button" onClick={() => setQuickGalleryFiles(current => current.filter((_, i) => i !== index))} aria-label={`Remove ${file.name} from upload list`}><X size={15} /></button></div>)}</div>}
              {quickGalleryError && <div className="admin-dashboard-error admin-form-error">{quickGalleryError}</div>}
              <footer className="admin-modal-actions"><button type="button" className="admin-secondary-button" disabled={quickGallerySaving} onClick={() => setGalleryUploadProject(null)}>Cancel</button><button type="submit" className="admin-primary-button" disabled={quickGallerySaving || quickGalleryFiles.length === 0}>{quickGallerySaving ? "Uploading..." : `Upload ${quickGalleryFiles.length || ""} Photo${quickGalleryFiles.length === 1 ? "" : "s"}`}</button></footer>
            </form>
          </section>
        </div>
      )}

      {galleryImageToDelete && (
        <div className="admin-delete-backdrop" onMouseDown={event => { if (event.target === event.currentTarget && !galleryImageDeleting) setGalleryImageToDelete(null); }}>
          <section className="admin-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-gallery-title">
            <div className="admin-delete-icon"><Trash2 size={26} /></div>
            <h2 id="delete-gallery-title">Delete this photo?</h2>
            <p>This removes the photo from the project's gallery.</p>
            <div className="admin-gallery-delete-confirm-preview"><img src={galleryImageToDelete.image.url} alt="Photo to delete" /><strong>{galleryImageToDelete.project.name}</strong></div>
            <div className="admin-delete-actions"><button type="button" className="admin-secondary-button" disabled={galleryImageDeleting} onClick={() => setGalleryImageToDelete(null)}>Cancel</button><button type="button" className="admin-delete-confirm-button" disabled={galleryImageDeleting} onClick={confirmGalleryImageDelete}>{galleryImageDeleting ? "Deleting..." : "Delete Photo"}</button></div>
          </section>
        </div>
      )}

      {previewImage && (
        <div className="admin-image-preview-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setPreviewImage(null); }}>
          <section className="admin-image-preview-modal" role="dialog" aria-modal="true" aria-labelledby="admin-image-preview-title">
            <header>
              <div>
                <p className="admin-dashboard-eyebrow">PROJECT GALLERY</p>
                <h2 id="admin-image-preview-title">{previewImage.project.name}</h2>
                <p>{previewImage.project.location} · Photo {previewImage.imageIndex + 1}</p>
              </div>
              <button type="button" className="admin-modal-close" onClick={() => setPreviewImage(null)} aria-label="Close image preview"><X size={21} /></button>
            </header>
            <img className="admin-image-preview-large" src={previewImage.url} alt={`${previewImage.project.name} gallery image`} />
            <footer>
              <button type="button" className="admin-secondary-button" onClick={() => setPreviewImage(null)}>Close preview</button>
              <button type="button" className="admin-primary-button" onClick={() => { const project = previewImage.project; setPreviewImage(null); openEditForm(project); }}>
                <Pencil size={16} /> Manage project photos
              </button>
            </footer>
          </section>
        </div>
      )}

    </div>
  );
}
