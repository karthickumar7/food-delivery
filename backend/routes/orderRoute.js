import express from "express"
import Order from "../models/orderModel.js"

const orderRouter = express.Router()

orderRouter.post("/", async (req, res) => {
  try {
    const order = await Order.create(req.body)

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

orderRouter.get("/", async (req, res) => {
  try {
    const { userId } = req.query
    const filter = userId ? { userId } : {}
    const orders = await Order.find(filter).sort({ createdAt: -1 })

    res.json({
      success: true,
      orders,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

orderRouter.patch("/:id/status", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    )

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    res.json({
      success: true,
      message: "Order status updated",
      order,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

orderRouter.patch("/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    if (["delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "This order can no longer be cancelled",
      })
    }

    order.status = "cancelled"
    await order.save()

    res.json({
      success: true,
      message: "Order cancelled",
      order,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

export default orderRouter
