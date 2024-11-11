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
    console.log("rating 1234 =", req.body);
    const rating = new Ratings({ ...req.body, user: id });
    try {
      const doc = await rating.save();
      const result = await doc.populate([
        { path: "product" },
        { path: "user" }
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
    // sort = {_sort:"price",_order="desc"}
    // pagination = {_page:1,_limit=10}
    let query = Ratings.find({});
    let totalRatingQuery = Ratings.find({});
  
    if (req.query._sort && req.query._order) {
      query = query.sort({ [req.query._sort]: req.query._order });
    }
  
    const totalDocs = await totalRatingQuery.count().exec();
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
