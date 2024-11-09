import { Category } from "../model/Category.js";

export async function addSubCategory(req, res) {
  const { categoryName, subcategoryName } = req.body;
  // const allCategories = await Category.find({}).exec();
  try {
    let category = await Category.findOne({ name: categoryName });

    if (!category) {
      category = new Category({
        name: categoryName,
        subcategories: [{ name: subcategoryName }],
      });
      await category.save(); // Save the new category
      return res.status(201).json({
        status: 201,
        message: "Category & Sub-category saved successfully",
        category,
      });
    }

    // Check if subcategory already exists
    const subcategoryExists = category.subcategories.some(
      (sub) => sub.name.toLowerCase() === subcategoryName.toLowerCase()
    );

    if (subcategoryExists) {
      return res
        .status(400)
        .json({ status: 404, message: "Subcategory already exists" });
    }

    // Add the new subcategory
    category.subcategories.push({ name: subcategoryName });
    await category.save(); // Save the updated category

    res.status(200).json({
      status: 200,
      message: "Subcategory added successfully",
      category,
    });
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export async function fetchCategories(req, res) {
  try {
    const categories = await Category.find({}).exec();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
}

export async function getSubCategory(req, res) {
  const { categoryName } = req.params;
  try {
    const category = await Category.findOne({
      name: categoryName.toLowerCase(),
    });
    if (!category)
      return res
        .status(404)
        .json({ status: 404, message: "Category not found" });

    res
      .status(200)
      .json({ status: 200, subcategories: category.subcategories });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error", error });
  }
}
