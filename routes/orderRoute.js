const express = require("express");
const router = express.Router();
const decodeToken = require("../utils/decodeToken");
const OrderSchema = require("../models/OrderSchema");
const UserSchema = require("../models/UserSchema");
const ProductSchema = require("../models/ProductSchema");

//creating a new order
router.post("/createOrder", decodeToken, async (req, res) => {
  try {
    let user = await UserSchema.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    let order = await OrderSchema.create({
      shippingInfo: req.body.shippingInfo,
      orderItems: req.body.orderItems,
      // paymentInfo: req.body.paymentInfo,
      itemsPrice: req.body.itemsPrice,
      taxPrice: req.body.taxPrice,
      shippingPrice: req.body.shippingPrice,
      totalPrice: req.body.totalPrice,
      // paidAt: Date.now(),
      user: req.user.id,
    });
    order.save();
    res
      .status(200)
      .json({ success: true, message: "Order was placed successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, error: "Failed to create order" });
  }
});

//cancelling the order
router.put("/cancelOrder", decodeToken, async (req, res) => {
  try {
    if (!req.body.orderID) {
      return res.status(400).json({
        success: false,
        error: "OrderID is required",
      });
    }

    const order = await OrderSchema.findById(req.body.orderID);

    if (!order) {
      return res.status(400).json({
        success: false,
        error: "No such order exists with the given ID",
      });
    }

    if (order.user.toString() !== req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        error: "You can cancel only the orders created by you",
      });
    }
    if (order.orderStatus === "Delivered") {
      return res
        .status(400)
        .json({
          success: false,
          error: "The order has already been delivered",
        });
    }

    if (order.orderStatus !== "Processing") {
      return res.status(400).json({
        success: false,
        error: "Order cannot be cancelled after the processing stage",
      });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order Cancelled Successfully",
      cancelledOrder: order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ success: false, error: "Failed to cancel order" });
  }
});

//getting order details of a single user
router.get("/getOrders/singleUser", decodeToken, async (req, res) => {
  let order = await OrderSchema.find({ user: req.user.id });
  if (!order) {
    return res.status(400).json({
      success: false,
      error: "No such order exists with the given user",
    });
  }
  return res.status(200).json({
    success: true,
    order,
  });
});

//getting order details of all user --Admin
router.get("/getOrders/allUser", decodeToken, async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Unauthorized. Only admin can access all orders.",
      });
    }

    const order = await OrderSchema.find();

    if (!order || order.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders found",
        orders: [],
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, error: "Failed to fetch orders" });
  }
});

// updating order status -- Admin
router.put("/updateOrder", decodeToken, async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Unauthorized. Only admin can update orders.",
      });
    }

    if (!req.body.orderID) {
      return res.status(400).json({
        success: false,
        error: "OrderID is required",
      });
    }

    const order = await OrderSchema.findById(req.body.orderID);

    if (!order) {
      return res.status(400).json({
        success: false,
        error: "No such order exists with given ID",
      });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        error: "This order has already been delivered",
      });
    }

    if (req.body.orderStatus === "Shipped") {
      for (const item of order.orderItems) {
        let product = await ProductSchema.findById(item.product);
        if (product) {
          product.stock -= item.qty;
          await product.save();
        }
      }
    }

    order.orderStatus = req.body.orderStatus;

    if (req.body.orderStatus === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ success: false, error: "Failed to update order" });
  }
});

// deleting the order --Admin
router.delete("/admin/deleteOrder", decodeToken, async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User does not exist",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Unauthorized. Only admin can delete orders.",
      });
    }

    if (!req.body.orderID) {
      return res.status(400).json({
        success: false,
        error: "OrderID is required",
      });
    }

    const order = await OrderSchema.findById(req.body.orderID);

    if (!order) {
      return res.status(400).json({
        success: false,
        error: "No such order exists with given ID",
      });
    }

    await OrderSchema.findByIdAndDelete(req.body.orderID);

    res.status(200).json({
      success: true,
      message: "Order Deleted Successfully",
      deletedOrder: order,
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, error: "Failed to delete order" });
  }
});

module.exports = router;
