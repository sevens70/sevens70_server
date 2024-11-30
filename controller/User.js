// import { Category } from '../model/Category';
import { User } from "../model/User.js";

export async function fetchUserById(req, res) {
  const { id } = req.user; //user coming from authorize middleware
  console.log(id);
  try {
    const user = await User.findById(id);
    res.status(200).json({
      id: user.id,
      addresses: user.addresses,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(400).json(err);
  }
}
export async function fetchAllUsers(req, res) {
  try {
    const users = await User.find({}).select("email _id role").exec();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
}
