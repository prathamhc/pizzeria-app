const router = require('express').Router();
const Ingredient = require('../models/Ingredient');

router.get('/', async (req, res, next) => {
    try {
        const ingredients = await Ingredient.find().sort({ tname: 1 });
        res.json({
            success: true,
            count: ingredients.length,
            data: ingredients
        });
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const ingredient = await Ingredient.findOne({ id: parseInt(req.params.id) });

        if (!ingredient) {
            return res.status(404).json({
                success: false,
                error: 'Ingredient not found'
            });
        }

        res.json({
            success: true,
            data: ingredient
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;