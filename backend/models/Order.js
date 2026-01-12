const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    items: [{
        pizzaId: String,
        name: String,
        basePrice: Number,
        qty: Number,
        selectedToppings: [{
            id: Number,
            tname: String,
            price: Number
        }],
        itemTotal: Number
    }],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
