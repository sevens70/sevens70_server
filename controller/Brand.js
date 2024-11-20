import { Brand } from "../model/Brand.js";

// Fetch all brands
export async function fetchBrands(req, res) {
  try {
    const brands = await Brand.find({}).exec();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch brands",
      error: error.message,
    });
  }
}

// Create a new brand
export async function createBrand(req, res) {
  try {
    const brand = new Brand(req.body);
    const savedBrand = await brand.save();
    res.status(201).json({
      message: "Brand created successfully",
      brand: savedBrand,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({
        message: "Validation Error",
        errors: error.errors,
      });
    } else {
      res.status(500).json({
        message: "Failed to create brand",
        error: error.message,
      });
    }
  }
}

// Update an existing brand
export async function updateBrand(req, res) {
  const { id } = req.params;

  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validators run during updates
    });

    if (!updatedBrand) {
      return res.status(404).json({
        message: "Brand not found",
      });
    }

    res.status(200).json({
      message: "Brand updated successfully",
      brand: updatedBrand,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update brand",
      error: error.message,
    });
  }
}

// Delete a brand
export async function deleteBrand(req, res) {
  const { id } = req.params;

  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);

    if (!deletedBrand) {
      return res.status(404).json({
        message: "Brand not found",
      });
    }

    res.status(200).json({
      message: "Brand deleted successfully",
      brand: deletedBrand,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete brand",
      error: error.message,
    });
  }
}
