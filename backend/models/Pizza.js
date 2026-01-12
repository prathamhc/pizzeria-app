const mongoose = require('mongoose');

const PizzaSchema = new mongoose.Schema({
    pizzaId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['veg', 'nonveg'],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: [{
        id: Number,
        iname: String
    }],
    topping: [{
        id: Number,
        tname: String,
        price: Number
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Pizza', PizzaSchema);