import asyncHandler from "express-async-handler"
import Order from "../models/orderModel.js"
import User from "../models/userModel.js"
import { mg } from "../server.js"

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
	} = req.body

	if (orderItems && orderItems.length === 0) {
		res.status(400)
		throw new Error("No order items")
	} else {
		const order = new Order({
			orderItems,
			user: req.user._id,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice,
		})

		const createdOrder = await order.save()

		res.status(201).json(createdOrder)
	}
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id).populate(
		"user",
		"name email"
	)

	if (order) {
		res.json(order)
	} else {
		res.status(404)
		throw new Error("Order not found")
	}
})

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id)
	const user = await User.findById(order.user)

	if (order) {
		order.isPaid = true
		order.paidAt = Date.now()
		order.paymentResult = {
			id: req.body.id,
			status: req.body.status,
			update_time: req.body.update_time,
			email_address: req.body.payer.email_address,
		}

		const updatedOrder = await order.save()

		mg.messages
			.create("sandbox3bd394c722664dd0b3787a326287bc73.mailgun.org", {
				from: "Dead West <mailgun@sandbox3bd394c722664dd0b3787a326287bc73.mailgun.org>",
				to: ["evspeciale@gmail.com"],
				subject: `New Order Created: #${order._id}`,
				text: `Name: ${user.name}\nEmail: ${user.email}\nAddress: ${
					order.shippingAddress.address
				}\n${order.shippingAddress.city}, ${order.shippingAddress.state} ${
					order.shippingAddress.postalCode
				}\n ${
					order.shippingAddress.country
				}\nOrder Items:\n ${order.orderItems.map(
					(item, index) =>
						item.name +
						": " +
						item.qty +
						" x $" +
						item.price +
						" = $" +
						item.qty +
						" * " +
						item.price +
						"\n"
				)}Order Total: $ ${
					order.totalPrice - order.taxPrice - order.shippingPrice
				}\nShipping Price: $ ${order.shippingPrice}\nTax: $ ${
					order.taxPrice
				}\nTotal: $ ${order.totalPrice}`,
			})
			.then((msg) => console.log(msg))
			.catch((err) => console.log(err))

		res.json(updatedOrder)
	} else {
		res.status(404)
		throw new Error("Order not found")
	}
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.user._id })

	res.json(orders)
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({}).populate("user", "id name")

	res.json(orders)
})

// @desc    Update order to shipped
// @route   PUT /api/orders/:id/ship
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id)

	if (order) {
		order.isDelivered = true
		order.deliveredAt = Date.now()

		const updatedOrder = await order.save()

		res.json(updatedOrder)
	} else {
		res.status(404)
		throw new Error("Order not found")
	}
})

export {
	addOrderItems,
	getOrderById,
	updateOrderToPaid,
	updateOrderToDelivered,
	getMyOrders,
	getOrders,
}
