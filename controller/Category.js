// import { Category } from "../model/Category.js";

// export async function fetchCategories(req, res) {
//   try {
//     const categories = await Category.find({}).exec();
//     res.status(200).json(categories);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// }

// export async function createCategory(req, res) {
//   const category = new Category(req.body);
//   try {
//     const doc = await category.save();
//     res.status(201).json(doc);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// }
import { Category } from "../model/Category.js";

export async function addSubCategory(req, res) {
  const { categoryName, subcategoryName } = req.body;
  const allCategories = await Category.find({}).exec();
  try {
    // Find the category by name
    let category = await Category.findOne({ name: categoryName });

    if (!category) {
      // If the category does not exist, create a new one
      category = new Category({
        name: categoryName,
        subcategories: [{ name: subcategoryName }],
      });
      console.log("category33", category);
      await category.save(); // Save the new category
      return res.status(201).json({
        message: "Category & Sub-category saved successfully",
        category,
      });
    }

    // Check if subcategory already exists
    const subcategoryExists = category.subcategories.some(
      (sub) => sub.name.toLowerCase() === subcategoryName.toLowerCase()
    );

    if (subcategoryExists) {
      return res.status(400).json({ message: "Subcategory already exists" });
    }

    // Add the new subcategory
    category.subcategories.push({ name: subcategoryName });
    await category.save(); // Save the updated category

    res
      .status(200)
      .json({ message: "Subcategory added successfully", category });
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
    const category = await Category.findOne({ name: categoryName });
    console.log("1234", category);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ subcategories: category.subcategories });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
