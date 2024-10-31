
import { Favourite } from "../model/Favourite.js";

export async function fetchFavouriteByUser(req, res) {
  const { id } = req.user; //user coming from authorize middleware 
  try {
    const favouriteItems = await Favourite.find({ user: id }).populate("product");
    res.status(200).json(favouriteItems);
  } catch (err) {
    res.status(400).json(err);
  }
}

export async function addToFavourite(req, res) {
  const { id } = req.user; //user coming from authorize middleware 
  const favourite = new Favourite({ ...req.body, user: id });
  try {
    const doc = await favourite.save();
    const result = await doc.populate("product");
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
}

export async function deleteFromFavourite(req, res) {
  const { id } = req.params;
  try {
    const doc = await Favourite.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
}

export async function updateFavourite(req, res) {
  const { id } = req.params;
  try {
    const favourite = await Favourite.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = await favourite.populate("product");

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
}
