const mongoose = require("mongoose");

const PizzaSchema = new mongoose.Schema({
    pizzaId: String,
    name: String,
    type: {
        type: String,
        enum: ['veg', 'nonveg']
    },
    basePrice: Number,
    image: String,
    description: String,
    ingredients: [
        {
            ingredientID: Number,
            name: String
        }
    ],
    toppings: [
        {
            ingredientID: Number,
            name: String,
            price: Number
        }
    ],
})

module.exports = mongoose.model("Pizza", PizzaSchema);