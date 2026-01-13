const router = require('express').Router();
const Pizza = require('../models/Pizza');

router.get('/', async (req, res, next) => {
    try {
        const pizzas = await Pizza.find();
        res.json({
            success: true,
            count: pizzas.length,
            data: pizzas
        });
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const pizza = await Pizza.findOne({ pizzaId: req.params.id });

        if (!pizza) {
            return res.status(404).json({
                success: false,
                error: 'Pizza not found'
            });
        }

        res.json({
            success: true,
            data: pizza
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;