const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    items: Array,
    total: Number,
})

module.exports = mongoose.model("Order", OrderSchema)

