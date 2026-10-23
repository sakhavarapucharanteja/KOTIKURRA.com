import { useState } from "react";
import { X, ArrowUpRight } from "lucide-react";

const galleryItems = [
  {
    title: "Contemporary Residence",
    category: "Homes",
    image: "photo-1600607687939-ce8a6c25118c",
  },
  {
    title: "Modern Architecture",
    category: "Architecture",
    image: "photo-1613490493576-7fde63acd811",
  },
  {
    title: "Warm Living Spaces",
    category: "Interiors",
    image: "photo-1600210492486-724fe5c67fb0",
  },
  {
    title: "Elegant Family Home",
    category: "Homes",
    image: "photo-1600047509807-ba8f99d2cdde",
  },
  {
    title: "Natural Surroundings",
    category: "Land",
    image: "photo-1500382017468-9049fed747ef",
  },
  {
    title: "Refined Interiors",
    category: "Interiors",
    image: "photo-1600566753086-00f18fb6b3ea",
  },
];

const categories = ["All", "Homes", "Architecture", "Interiors", "Land"];

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const visibleItems = galleryItems.filter(
    (item) => filter === "All" || item.category === filter
  );

  const imageUrl = (id) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;

  return (
    <>
      <section className="section section-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE GALLERY</p>
            <h2>Details make the <em>difference.</em></h2>
          </div>
        </div>

        <div className="gallery-filters">
          {categories.map((item) => (
            <button
              key={item}
              className={`filter-button ${filter === item ? "selected" : ""}`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {visibleItems.map((item) => (
            <button
              type="button"
              className="gallery-item"
              key={item.title}
              onClick={() => setSelected(item)}
              aria-label={`View ${item.title}`}
            >
              <img src={imageUrl(item.image)} alt={item.title} loading="lazy" />
              <span className="gallery-overlay">
                <span><small>{item.category}</small><strong>{item.title}</strong></span>
                <span className="gallery-arrow"><ArrowUpRight size={20} /></span>
              </span>
            </button>
          ))}
        </div>
        <p className="listing-disclaimer">
          These are illustrative stock photographs. Replace them with authorised photos of actual properties and projects.
        </p>
      </section>

      {selected && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelected(null)}>
          <button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close image">
            <X size={25} />
          </button>
          <img
            src={imageUrl(selected.image)}
            alt={selected.title}
            onClick={(event) => event.stopPropagation()}
          />
          <p>{selected.title}</p>
        </div>
      )}
    </>
  );
}