import { SunglassBanner } from "../model/SunglassBanner.js";

// Fetch all brands
export async function fetchSunglassBanner(req, res) {
  try {
    const banners = await SunglassBanner.find({}).exec();
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch banners",
      error: error.message,
    });
  }
}

// Create a new brand
export async function createSunglassBanner(req, res) {
  try {
    const banner = new SunglassBanner(req.body);
    const savedBanner = await banner.save();
    res.status(201).json({
      message: "Banner created successfully",
      banner: savedBanner,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({
        message: "Validation Error",
        errors: error.errors,
      });
    } else {
      res.status(500).json({
        message: "Failed to create banner",
        error: error.message,
      });
    }
  }
}

// Update an existing brand
export async function updateSunglassBanner(req, res) {
  const { id } = req.params;

  try {
    const updatedBanner = await SunglassBanner.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validators run during updates
    });

    if (!updatedBanner) {
      return res.status(404).json({
        message: "Banner not found",
      });
    }

    res.status(200).json({
      message: "Banner updated successfully",
      banner: updatedBanner,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update banner",
      error: error.message,
    });
  }
}

// Delete a brand
export async function deleteSunglassBanner(req, res) {
  const { id } = req.params;

  try {
    const deletedBanner = await SunglassBanner.findByIdAndDelete(id);

    if (!deletedBanner) {
      return res.status(404).json({
        message: "Banner not found",
      });
    }

    res.status(200).json({
      message: "Banner deleted successfully",
      banner: deletedBanner,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete banner",
      error: error.message,
    });
  }
}
