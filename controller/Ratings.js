import { Product } from "../model/Product.js";
import { Ratings } from "../model/Ratings.js";
// export async function addToRating(req, res) {
//   const { id } = req.user;
//   console.log("rating 1234 =", req.body)
//   const rating = new Ratings({ ...req.body, user: id });
//   try {
//     const doc = await rating.save();
//     // const result = await doc.populate("product");
//     const result = await doc.populate("user");
//     // const result = await doc.populate("product").populate("user");
//     res.status(201).json(result);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// }
export async function addToRating(req, res) {
  const { id } = req.user;
  const rating = new Ratings({ ...req.body, user: id });

  try {
    // Save the rating
    const doc = await rating.save();
    const result = await doc.populate([
      { path: "product" },
      { path: "user", select: "name email" },
    ]);

    res.status(201).json(result);
  } catch (err) {
    console.error("Error saving rating:", err);
    res.status(400).json(err);
  }
}

export async function deleteFromRatings(req, res) {
  const { id } = req.params;
  try {
    const doc = await Ratings.findByIdAndDelete(id);
    if (!doc) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json({ error: "Failed to delete item", details: err });
  }
}

export async function fetchAllRating(req, res) {
  let query = Ratings.find({ rating: 5 });
  let totalRatingQuery = Ratings.find({ rating: 5 });

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalRatingQuery.count().exec();

  if (req.query._page && req.query._limit) {
    const pageSize = parseInt(req.query._limit);
    const page = parseInt(req.query._page);
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query
      .populate([
        { path: "product" },
        { path: "user", select: "name email" }, // Project name, email
      ])
      .exec();

    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
}
export async function fetchRatingsByUserId(req, res) {
  const { id } = req.user;

  // Combine the filters for deleted and user ID
  let query = Ratings.find({ user: id });
  let totalRatingsQuery = Ratings.find({ user: id });

  // Sort the query if sorting parameters are provided
  if (req.query._sort && req.query._order) {
    const sortField = req.query._sort;
    const sortOrder = req.query._order.toLowerCase() === "desc" ? -1 : 1;
    query = query.sort({ [sortField]: sortOrder });
  } else {
    query = query.sort({ createdAt: -1 });
  }

  // Get the total count of orders matching the criteria
  const totalDocs = await totalRatingsQuery.countDocuments().exec();
  console.log({ totalDocs });

  // Apply pagination if pagination parameters are provided
  if (req.query._page && req.query._limit) {
    const pageSize = parseInt(req.query._limit);
    const page = parseInt(req.query._page);
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    // Execute the query and send the response with pagination headers
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
}
