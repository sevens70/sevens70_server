import { Brand } from "../model/Brand.js";

export async function fetchBrands(req, res) {
  try {
    const brands = await Brand.find({}).exec();
    res.status(200).json(brands);
  } catch (err) {
    res.status(400).json(err);
  }
}

export async function createBrand(req, res) {
  const brand = new Brand(req.body);
  try {
    const doc = await brand.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
}
export async function deleteBrand(req, res) {
  const { id } = req.params;

  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);

    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res
      .status(200)
      .json({ message: "Brand deleted successfully", deletedBrand });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred while deleting the brand",
      error: err,
    });
  }
}

export async function updateBrand(req, res) {
  const { id } = req.params;
  try {
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    const updatedBrand = await brand.save();
    res.status(200).json(updatedBrand);
  } catch (err) {
    res.status(400).json(err);
  }
}
