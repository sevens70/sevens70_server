// import { Product } from '../model/Product';
import { Banner } from "../model/Banner.js";
import cloudinary from "cloudinary";

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// export async function createBanner(req, res) {
//   const banner = new Banner(req.body);

//   const savedBanner = await banner.save();
//   res.status(201).json(savedBanner);

export async function createBanner(req, res) {
  try {
    const banner = new Banner(req.body);
    const savedBanner = await banner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    if (error.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Validation Error", errors: error.errors });
    } else {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
}

export async function fetchAllBanners(req, res) {
  try {
    const banners = await Banner.find({ deleted: { $ne: true } }).exec();
    res.status(200).json(banners);
  } catch (err) {
    res.status(400).json(err);
  }
}

export async function fetchBannerById(req, res) {
  const { id } = req.params;

  try {
    const banner = await Banner.findById(id);
    res.status(200).json(banner);
  } catch (err) {
    res.status(400).json(err);
  }
}

export async function updateBanner(req, res) {
  const { id } = req.params;
  try {
    const banner = await Banner.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    const updatedBanner = await banner.save();
    res.status(200).json(updatedBanner);
  } catch (err) {
    res.status(400).json(err);
  }
}
