const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  items: [
    {
      pizzaId: String,
      name: String,
      basePrice: { type: Number, required: true },
      qty: { type: Number, default: 1 }
    }
  ],
  total: { type: Number, default: 0 }
});

module.exports = mongoose.model('Cart', CartSchema);
