import { Banner } from "../model/Banner.js";
import cloudinary from "cloudinary";

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Create a new banner
 */
export async function createBanner(req, res) {
  try {
    const banner = new Banner(req.body);
    const savedBanner = await banner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({
        message: "Validation Error",
        errors: error.errors,
      });
    } else {
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
}

/**
 * Fetch all banners (excluding deleted ones)
 */
export async function fetchAllBanners(req, res) {
  try {
    const banners = await Banner.find({ deleted: { $ne: true } }).exec();
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch banners",
      error: error.message,
    });
  }
}

/**
 * Fetch a single banner by ID
 */
export async function fetchBannerById(req, res) {
  const { id } = req.params;

  try {
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch banner",
      error: error.message,
    });
  }
}

/**
 * Update a banner by ID
 */
export async function updateBanner(req, res) {
  const { id } = req.params;

  try {
    const banner = await Banner.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.status(200).json(banner);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({
        message: "Validation Error",
        errors: error.errors,
      });
    } else {
      res.status(500).json({
        message: "Failed to update banner",
        error: error.message,
      });
    }
  }
}
