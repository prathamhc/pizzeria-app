const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema(
    {
        ingredientID: Number,
        name: String,
        price: Number,
        image: String
    }
);

module.exports = mongoose.model("Ingredients",IngredientSchema );