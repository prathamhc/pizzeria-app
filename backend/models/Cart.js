const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  pizzaId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  qty: {
    type: Number,
    default: 1,
    min: 1
  },
  selectedToppings: [{
    id: Number,
    tname: String,
    price: Number
  }],
  itemTotal: {
    type: Number,
    default: 0
  }
});

const CartSchema = new mongoose.Schema({
  items: [CartItemSchema],
  total: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

CartItemSchema.pre('save', function (next) {
  const toppingTotal = this.selectedToppings.reduce((sum, t) => sum + t.price, 0);
  this.itemTotal = (this.basePrice + toppingTotal) * this.qty;
  next();
});

module.exports = mongoose.model('Cart', CartSchema);