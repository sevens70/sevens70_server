// import { sunglassProduct } from "../model/SunglassProduct.js";

// // Fetch all brands
// export async function fetchsunglassProduct(req, res) {
//   try {
//     const products = await sunglassProduct.find({}).exec();
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch products",
//       error: error.message,
//     });
//   }
// }

// // Create a new brand
// export async function createsunglassProduct(req, res) {
//   try {
//     const banner = new sunglassProduct(req.body);
//     const savedBanner = await banner.save();
//     res.status(201).json({
//       message: "Product created successfully",
//       banner: savedBanner,
//     });
//   } catch (error) {
//     if (error.name === "ValidationError") {
//       res.status(400).json({
//         message: "Validation Error",
//         errors: error.errors,
//       });
//     } else {
//       res.status(500).json({
//         message: "Failed to create product",
//         error: error.message,
//       });
//     }
//   }
// }

// // Update an existing brand
// export async function updatesunglassProduct(req, res) {
//   const { id } = req.params;

//   try {
//     const updatedBanner = await sunglassProduct.findByIdAndUpdate(
//       id,
//       req.body,
//       {
//         new: true, // Return the updated document
//         runValidators: true, // Ensure validators run during updates
//       }
//     );

//     if (!updatedBanner) {
//       return res.status(404).json({
//         message: "Product not found",
//       });
//     }

//     res.status(200).json({
//       message: "Product updated successfully",
//       banner: updatedBanner,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to update product",
//       error: error.message,
//     });
//   }
// }

// // Delete a brand
// export async function deletesunglassProduct(req, res) {
//   const { id } = req.params;

//   try {
//     const deletedBanner = await sunglassProduct.findByIdAndDelete(id);

//     if (!deletedBanner) {
//       return res.status(404).json({
//         message: "Product not found",
//       });
//     }

//     res.status(200).json({
//       message: "Product deleted successfully",
//       banner: deletedBanner,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to delete product",
//       error: error.message,
//     });
//   }
// }
