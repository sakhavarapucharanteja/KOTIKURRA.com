
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    googleMapsUrl: { type: String, default: "" },
    size: { type: String, required: true, trim: true },
    units: { type: Number, required: true, min: 0 },
    coverPhoto: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    description: { type: String, default: "" },
    amenities: { type: [String], default: [] },
    gallery: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
