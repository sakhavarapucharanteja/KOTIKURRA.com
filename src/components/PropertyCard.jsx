import { Link } from "react-router-dom";
import {
  MapPin,
  Ruler,
  Building2,
  ArrowUpRight,
} from "lucide-react";

import "./PropertyCard.css";

export default function PropertyCard({ property }) {
  if (!property || !property._id) {
    return null;
  }

  const projectUrl = `/projects/${property._id}`;
  const imageUrl = property.coverPhoto?.url;

  return (
    <article className="property-card">
      {/* Project image */}
      <Link
        to={projectUrl}
        className="property-card-image-link"
        aria-label={`View ${property.name || "project"} details`}
      >
        {imageUrl ? (
          <img
            className="property-card-image"
            src={imageUrl}
            alt={property.name || "Real estate project"}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="property-card-image-placeholder">
            <Building2 size={42} />
          </div>
        )}

        {property.status && (
          <span className="property-card-status">
            {property.status}
          </span>
        )}
      </Link>

      {/* Project information */}
      <div className="property-card-content">
        <p className="property-card-type">
          {property.type || "Real Estate"}
        </p>

        <h3 className="property-card-title">
          <Link to={projectUrl}>
            {property.name || "Untitled Project"}
          </Link>
        </h3>

        <p className="property-card-location">
          <MapPin size={16} />
          <span>
            {property.location || "Location not specified"}
          </span>
        </p>

        <p className="property-card-description">
          {property.description ||
            "Project details will be updated soon."}
        </p>

        {/* Project size and units */}
        <div className="property-card-details">
          {property.size && (
            <span className="property-card-detail">
              <Ruler size={16} />
              <span>{property.size}</span>
            </span>
          )}

          {property.units != null && (
            <span className="property-card-detail">
              <Building2 size={16} />
              <span>{property.units} units</span>
            </span>
          )}
        </div>

        {/* Details button */}
        <div className="property-card-footer">
          <Link to={projectUrl} className="property-card-link">
            View Project
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}