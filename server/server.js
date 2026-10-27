
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Project from "./models/Project.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://koti-kurra-in.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as local tools.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
  })
);
app.use(express.json());


app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      !username ||
      !password ||
      username !== process.env.ADMIN_USERNAME ||
      !process.env.ADMIN_PASSWORD_HASH ||
      !process.env.JWT_SECRET
    ) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      { role: "admin", username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({ token, username });
  } catch (error) {
    console.error("Admin login failed:", error.message);
    return res.status(500).json({
      message: "Login failed",
    });
  }
});


function requireAdmin(req, res, next) {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Please log in to manage projects.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      decoded.role !== "admin" ||
      decoded.username !== process.env.ADMIN_USERNAME
    ) {
      return res.status(403).json({
        message: "Admin access denied.",
      });
    }

    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({
      message: "Your session expired. Please log in again.",
    });
  }
}


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 11,
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype?.startsWith("image/")) {
      callback(null, true);
    } else {
      callback(new Error("Only image files are allowed"));
    }
  },
});

function uploadToCloudinary(file, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(file.buffer);
  });
}

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Kottikurra API is running",
  });
});

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Fetch projects failed:", error.message);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});


app.get("/api/projects/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID." });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.json(project);
  } catch (error) {
    console.error("Fetch project failed:", error.message);
    res.status(500).json({ message: "Failed to fetch project." });
  }
});


/* =========================================
   UPDATE PROJECT — ADMIN ONLY
   Supports:
   - Editing project details
   - Replacing cover photo
   - Adding gallery photos
   - Removing selected gallery photos
========================================= */

app.put(
  "/api/projects/:id",
  requireAdmin,
  upload.fields([
    { name: "coverPhoto", maxCount: 1 },
    { name: "galleryPhotos", maxCount: 10 },
  ]),
  async (req, res) => {
    const newlyUploadedPublicIds = [];

    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          message: "Invalid project ID.",
        });
      }

      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({
          message: "Project not found.",
        });
      }

      const {
        name,
        type,
        status,
        location,
        googleMapsUrl,
        size,
        units,
        description,
        amenities,
        featured,
        removeGalleryPublicIds,
      } = req.body;

      const nextName = name ?? project.name;
      const nextType = type ?? project.type;
      const nextStatus = status ?? project.status;
      const nextLocation = location ?? project.location;
      const nextSize = size ?? project.size;
      const nextUnits = units ?? project.units;

      if (
        !String(nextName).trim() ||
        !String(nextType).trim() ||
        !String(nextStatus).trim() ||
        !String(nextLocation).trim() ||
        !String(nextSize).trim() ||
        nextUnits === ""
      ) {
        return res.status(400).json({
          message:
            "Name, type, status, location, size, and units are required.",
        });
      }

      const unitCount = Number(nextUnits);

      if (!Number.isInteger(unitCount) || unitCount < 0) {
        return res.status(400).json({
          message: "Units must be a non-negative whole number.",
        });
      }

      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        return res.status(500).json({
          message: "Cloudinary credentials are not configured.",
        });
      }

      // Save the old image references before changing anything.
      const oldCoverPublicId = project.coverPhoto?.publicId;
      const oldGallery = [...(project.gallery || [])];

      // Parse the amenities field sent by FormData.
      let amenityList = project.amenities || [];

      if (amenities !== undefined) {
        if (Array.isArray(amenities)) {
          amenityList = amenities
            .map(String)
            .map((item) => item.trim())
            .filter(Boolean);
        } else {
          try {
            const parsed = JSON.parse(amenities);
            amenityList = Array.isArray(parsed)
              ? parsed.map(String).map((item) => item.trim()).filter(Boolean)
              : [];
          } catch {
            amenityList = String(amenities)
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean);
          }
        }
      }

      // Parse requested gallery removals.
      let removeIds = [];

      if (removeGalleryPublicIds !== undefined) {
        try {
          removeIds = JSON.parse(removeGalleryPublicIds);

          if (!Array.isArray(removeIds)) {
            return res.status(400).json({
              message: "Gallery removals must be a list.",
            });
          }
        } catch {
          return res.status(400).json({
            message: "Invalid gallery removal data.",
          });
        }
      }

      // Only allow removing gallery images that belong to this project.
      const galleryToRemove = oldGallery.filter(
        (image) =>
          image?.publicId && removeIds.includes(image.publicId)
      );

      let nextCover = project.coverPhoto;
      let nextGallery = oldGallery.filter(
        (image) =>
          !image?.publicId || !removeIds.includes(image.publicId)
      );

      // Upload a replacement cover when supplied.
      const coverFile = req.files?.coverPhoto?.[0];

      if (coverFile) {
        const uploadedCover = await uploadToCloudinary(
          coverFile,
          "kottikurra/projects"
        );

        newlyUploadedPublicIds.push(uploadedCover.publicId);
        nextCover = uploadedCover;
      }

      // Append new gallery images.
      const galleryFiles = req.files?.galleryPhotos || [];

      for (const file of galleryFiles) {
        const uploadedImage = await uploadToCloudinary(
          file,
          "kottikurra/gallery"
        );

        newlyUploadedPublicIds.push(uploadedImage.publicId);
        nextGallery.push(uploadedImage);
      }

      // Apply updates while retaining values not submitted.
      project.name = String(nextName).trim();
      project.type = String(nextType).trim();
      project.status = String(nextStatus).trim();
      project.location = String(nextLocation).trim();
      project.size = String(nextSize).trim();
      project.units = unitCount;

      if (googleMapsUrl !== undefined) {
        project.googleMapsUrl = String(googleMapsUrl).trim();
      }

      if (description !== undefined) {
        project.description = String(description).trim();
      }

      if (amenities !== undefined) {
        project.amenities = amenityList;
      }

      if (featured !== undefined) {
        project.featured = featured === true || featured === "true";
      }

      project.coverPhoto = nextCover;
      project.gallery = nextGallery;

      // Save to MongoDB before deleting any old Cloudinary images.
      await project.save();

      const oldPublicIdsToDelete = [
        ...(coverFile && oldCoverPublicId ? [oldCoverPublicId] : []),
        ...galleryToRemove.map((image) => image.publicId),
      ];

      const cleanupResults = await Promise.allSettled(
        [...new Set(oldPublicIdsToDelete)].map((publicId) =>
          cloudinary.uploader.destroy(publicId)
        )
      );

      const failedImageDeletes = cleanupResults.filter(
        (result) => result.status === "rejected"
      ).length;

      return res.json({
        message:
          failedImageDeletes > 0
            ? "Project updated, but some old images could not be removed from Cloudinary."
            : "Project updated successfully.",
        project,
        failedImageDeletes,
      });
    } catch (error) {
      console.error("Update project failed:", error);

      // Clean up newly uploaded images if the update failed.
      await Promise.allSettled(
        newlyUploadedPublicIds.map((publicId) =>
          cloudinary.uploader.destroy(publicId)
        )
      );

      return res.status(500).json({
        message: "Failed to update project. Check the server terminal.",
      });
    }
  }
);


/* =========================================
   DELETE PROJECT — ADMIN ONLY
========================================= */

app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid project ID.",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    // Remove the project from MongoDB.
    await Project.findByIdAndDelete(id);

    // Remove the cover and gallery images from Cloudinary.
    const publicIds = [
      project.coverPhoto?.publicId,
      ...(project.gallery || []).map((image) => image?.publicId),
    ].filter(Boolean);

    const cleanupResults = await Promise.allSettled(
      [...new Set(publicIds)].map((publicId) =>
        cloudinary.uploader.destroy(publicId)
      )
    );

    const failedImageDeletes = cleanupResults.filter(
      (result) => result.status === "rejected"
    ).length;

    return res.json({
      message:
        failedImageDeletes > 0
          ? "Project deleted, but some Cloudinary images could not be removed."
          : "Project deleted successfully.",
      failedImageDeletes,
    });
  } catch (error) {
    console.error("Delete project failed:", error);

    return res.status(500).json({
      message: "Failed to delete project. Check the server terminal.",
    });
  }
});


app.post(
  "/api/projects",
  requireAdmin,
  upload.fields([
    { name: "coverPhoto", maxCount: 1 },
    { name: "galleryPhotos", maxCount: 10 },
  ]),


  async (req, res) => {
    const uploadedImages = [];

    try {
      const {
        name,
        type,
        status,
        location,
        googleMapsUrl,
        size,
        units,
        description,
        amenities,
        featured,
      } = req.body;

      if (
        !name?.trim() ||
        !type?.trim() ||
        !status?.trim() ||
        !location?.trim() ||
        !size?.trim() ||
        units === undefined ||
        units === "" ||
        !req.files?.coverPhoto?.[0]
      ) {
        return res.status(400).json({
          message:
            "Name, type, status, location, size, units, and cover photo are required.",
        });
      }

      const unitCount = Number(units);

      if (!Number.isInteger(unitCount) || unitCount < 0) {
        return res.status(400).json({
          message: "Units must be a non-negative whole number.",
        });
      }

      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        return res.status(500).json({
          message: "Cloudinary credentials are not configured.",
        });
      }

      const coverPhoto = await uploadToCloudinary(
        req.files.coverPhoto[0],
        "kottikurra/projects"
      );
      uploadedImages.push(coverPhoto.publicId);

      const galleryFiles = req.files.galleryPhotos || [];
      const gallery = [];

      for (const file of galleryFiles) {
        const image = await uploadToCloudinary(
          file,
          "kottikurra/gallery"
        );
        gallery.push(image);
        uploadedImages.push(image.publicId);
      }

      let amenityList = [];

      if (amenities) {
        try {
          const parsed = JSON.parse(amenities);
          amenityList = Array.isArray(parsed)
            ? parsed.map(String).map((item) => item.trim()).filter(Boolean)
            : [];
        } catch {
          amenityList = amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }

      const project = await Project.create({
        name: name.trim(),
        type: type.trim(),
        status: status.trim(),
        location: location.trim(),
        googleMapsUrl: googleMapsUrl || "",
        size: size.trim(),
        units: unitCount,
        coverPhoto,
        description: description || "",
        amenities: amenityList,
        gallery,
        featured: featured === "true",
      });

      res.status(201).json(project);
    } catch (error) {
      // Remove images uploaded during a failed creation.
      await Promise.allSettled(
        uploadedImages.map((publicId) =>
          cloudinary.uploader.destroy(publicId)
        )
      );

      console.error("Create project failed:", error.message);
      res.status(500).json({
        message: "Failed to create project. Check the server terminal.",
      });
    }
  }
);

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message: "Upload failed. Each image must be under 5 MB.",
    });
  }

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
});

startServer();
