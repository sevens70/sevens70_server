import { TopBanner } from "../model/TopBanner.js";

// export async function createTopBanner(req, res) {
//   const banner = new TopBanner(req.body);

//   const savedBanner = await banner.save();
//   res.status(201).json(savedBanner);
// }
export async function createTopBanner(req, res) {
  try {
    const { bannerImage } = req.body;

    if (!bannerImage) {
      return res.status(400).json({ message: "Banner image is required" });
    }

    const banner = new TopBanner(req.body);
    const savedBanner = await banner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    console.error(error); 
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function fetchAllTopBanners(req, res) {
  try {
    const banners = await TopBanner.find({}).exec();
    res.status(200).json(banners);
  } catch (err) {
    res.status(400).json(err);
  }
}
export async function deleteTopBanner(req, res) {
  const { id } = req.params;

  try {
    const deletedTopBanner = await TopBanner.findByIdAndDelete(id);

    if (!deletedTopBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res
      .status(200)
      .json({ message: "Banner deleted successfully", deletedTopBanner });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred while deleting the banner",
      error: err,
    });
  }
}

// export async function fetchBannerById(req, res) {
//   const { id } = req.params;

//   try {
//     const banner = await Banner.findById(id);
//     res.status(200).json(banner);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// }

// export async function updateBanner(req, res) {
//   const { id } = req.params;
//   try {
//     const banner = await Banner.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });

//     const updatedBanner = await banner.save();
//     res.status(200).json(updatedBanner);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// }
