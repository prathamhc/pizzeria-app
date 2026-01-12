const router = require('express').Router();
const Order = require('../models/Order');

router.get('/', async (req, res, next) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { items, total } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Cart is empty'
            });
        }

        const order = await Order.create({
            items,
            total,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (err) {
        next(err);
    }
});

router.patch('/:id/status', async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                error: 'Status is required'
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;