// import { Product } from '../model/Product';
import { Product } from "../model/Product.js";
import cloudinary from "cloudinary";

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createProduct(req, res) {
  const product = new Product(req.body);
  // Optional discount price calculation
  if (product.discountPercentage > 0) {
    product.discountPrice = Math.round(
      product.price * (1 - product.discountPercentage / 100)
    );
  } else {
    product.discountPrice = product.price;
  }

  const savedProduct = await product.save();
  res.status(201).json(savedProduct);
}

export async function fetchAllProducts(req, res) {
  let condition = {};

  // Exclude deleted products if not admin
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  // Filter by category
  if (req.query.category) {
    const categories = req.query.category.split(",");
    query = query.find({ category: { $in: categories } });
    totalProductsQuery = totalProductsQuery.find({
      category: { $in: categories },
    });
  }

  // Filter by subcategory
  if (req.query.subcategory) {
    const subcategories = req.query.subcategory.split(",");
    query = query.find({ subcategory: { $in: subcategories } });
    totalProductsQuery = totalProductsQuery.find({
      subcategory: { $in: subcategories },
    });
  }

  // Filter by colors
  if (req.query.colors) {
    const colors = req.query.colors.split(",");
    query = query.find({
      colors: { $elemMatch: { id: { $in: colors } } },
    });
    totalProductsQuery = totalProductsQuery.find({
      colors: { $elemMatch: { id: { $in: colors } } },
    });
  }

  // Filter by sizes
  if (req.query.sizes) {
    const sizes = req.query.sizes.split(",");
    query = query.find({
      sizes: { $elemMatch: { id: { $in: sizes } } },
    });
    totalProductsQuery = totalProductsQuery.find({
      sizes: { $elemMatch: { id: { $in: sizes } } },
    });
  }

  // Filter by brand //   store database in lowercase()
  if (req.query.brand) {
    const brands = req.query.brand.split(",");
    query = query.find({ brand: { $in: brands } });
    totalProductsQuery = totalProductsQuery.find({ brand: { $in: brands } });
  }

  // Filter by discountPrice range
  if (req.query.price) {
    const [minPrice, maxPrice] = req.query.price.split("-").map(Number);
    query = query.where("discountPrice").gte(minPrice).lte(maxPrice);
    totalProductsQuery = totalProductsQuery
      .where("discountPrice")
      .gte(minPrice)
      .lte(maxPrice);
  }

  // Sort products based on the specified sort order
  if (req.query.sort) {
    switch (req.query.sort) {
      case "newest":
        query = query.sort({ createdAt: -1 });
        break;
      case "price high - low":
        query = query.sort({ discountPrice: -1 });
        break;
      case "price low - high":
        query = query.sort({ discountPrice: 1 });
        break;
      default:
        break;
    }
  }

  // Count total documents for pagination metadata
  const totalDocs = await totalProductsQuery.count().exec();
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = parseInt(req.query._limit);
    const page = parseInt(req.query._page);
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    // Set total count for pagination metadata in headers
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(400).json({ error: "Failed to fetch products", details: err });
  }
}

export async function fetchProductById(req, res) {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
}

export async function updateProduct(req, res) {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    product.discountPrice = Math.round(
      product.price * (1 - product.discountPercentage / 100)
    );
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
}
