// const { Order } = require("../model/Order");
// const { Product } = require("../model/Product");
// const { User } = require("../model/User");
// const { sendMail, invoiceTemplate } = require("../services/common.js");

import { Order } from "../model/Order.js";
import { Product } from "../model/Product.js";
// import { User } from "../model/User.js";

export async function fetchOrdersByUser(req, res) {
  const { id } = req.user; //user coming from authorize middleware
  try {
    const orders = await Order.find({ user: id });
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
}

export async function createOrder(req, res) {
  const order = new Order(req.body);

  try {
    for (let item of order.items) {
      // if (!item?.product.hasOwnProperty("review")) {
      //   item.product.review = false;
      // }
      let product = await Product.findOne({ _id: item.product.id });
      product.stock -= item.quantity;
      if (product.stock < 0) {
        return res
          .status(400)
          .json({ error: "Insufficient stock for : " + product.title });
      }

      await product.save();
    }
    const doc = await order.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to create order" });
  }
}

export async function deleteOrder(req, res) {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
}

export async function updateOrder(req, res) {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
}

// without pagination
export async function fetchAllOrdersWithoutPagination(req, res) {
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  let query = Order.find({ deleted: { $ne: true } });
  let totalOrdersQuery = Order.find({ deleted: { $ne: true } });

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalOrdersQuery.count().exec();
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

//with pagination
export async function fetchAllOrders(req, res) {
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  let query = Order.find({ deleted: { $ne: true } });
  let totalOrdersQuery = Order.find({ deleted: { $ne: true } });

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const totalDocs = await totalOrdersQuery.count().exec();
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
export async function fetchOrdersByUserId(req, res) {
  const { id } = req.user; //user coming from authorize middleware

  // Combine the filters for deleted and user ID
  let query = Order.find({ deleted: { $ne: true }, user: id });
  let totalOrdersQuery = Order.find({ deleted: { $ne: true }, user: id });

  // Sort the query if sorting parameters are provided
  if (req.query._sort && req.query._order) {
    const sortField = req.query._sort;
    const sortOrder = req.query._order.toLowerCase() === "desc" ? -1 : 1;
    query = query.sort({ [sortField]: sortOrder });
  } else {
    query = query.sort({ createdAt: -1 });
  }

  // Get the total count of orders matching the criteria
  const totalDocs = await totalOrdersQuery.countDocuments().exec();
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
