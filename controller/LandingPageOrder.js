import { LandingPageOrder } from "../model/LandingPageOrder.js";
// import { Product } from "../model/Product.js";
import { sunglassProduct } from "../model/SunglassProduct.js";
// import { User } from "../model/User.js";

// export async function fetchOrdersByUser(req, res) {
//   const { id } = req.user; //user coming from authorize middleware
//   try {
//     const orders = await Order.find({ user: id });
//     res.status(200).json(orders);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// }

export async function createOrder(req, res) {
  if (req.body.paymentMethod === "card") {
    req.body.paymentStatus = "received";
  }

  const order = new LandingPageOrder(req.body);

  try {
    for (let item of order.items) {
      let product = await sunglassProduct.findOne({ _id: item.product.id });
      // product.stock -= item.quantity;
      // if (product.stock < 0) {
      //   return res
      //     .status(400)
      //     .json({ error: "Insufficient stock for : " + product.title });
      // }

      await product.save();
    }
    const doc = await order.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to create order" });
  }
}
