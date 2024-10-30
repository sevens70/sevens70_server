// import { Product } from '../model/Product';
import { Product } from "../model/Product.js";
import cloudinary from "cloudinary";

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// export async function createProduct(req, res) {
//   // const { images, ...rest } = req.body;
//   // ===============
//   //  try {
//   //    if (image) {
//   //      const uploadedResponse = await cloudinary.uploader.upload(image, {
//   //        upload_preset: "online-shop",
//   //      });

//   //      if (uploadedResponse) {
//   //        const product = new Product({
//   //          name,
//   //          brand,
//   //          desc,
//   //          price,
//   //          image: uploadedResponse,
//   //        });

//   //        const savedProduct = await product.save();
//   //        res.status(200).send(savedProduct);
//   //      }
//   //    }
//   //  } catch (error) {
//   //    console.log(error);
//   //    res.status(500).send(error);
//   //  }
//   // ===============
//   const product = new Product(req.body);
//   product.discountPrice = Math.round(
//     product.price * (1 - product.discountPercentage / 100)
//   );
//   try {
//     const doc = await product.save();
//     res.status(201).json(doc);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// }

export async function createProduct(req, res) {
  const { images, thumbnailIndex = 0, ...productData } = req.body;

  try {
    // Upload all images to Cloudinary and get URLs
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const response = await cloudinary.v2.uploader.upload(image, {
          upload_preset: "product-images",
        });
        return response.secure_url;
      })
    );

    // Set thumbnail as the specified image or default to the first image
    const thumbnail = uploadedImages[thumbnailIndex];

    // Create the product with images and thumbnail
    const product = new Product({
      ...productData,
      images: uploadedImages,
      thumbnail,
    });

    // Optional discount price calculation
    product.discountPrice = Math.round(
      product.price * (1 - product.discountPercentage / 100)
    );

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
}

export async function fetchAllProducts(req, res) {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  if (req.query.category) {
    query = query.find({ category: { $in: req.query.category.split(",") } });
    totalProductsQuery = totalProductsQuery.find({
      category: { $in: req.query.category.split(",") },
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: { $in: req.query.brand.split(",") } });
    totalProductsQuery = totalProductsQuery.find({
      brand: { $in: req.query.brand.split(",") },
    });
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.count().exec();
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
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
