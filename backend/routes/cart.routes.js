const router = require('express').Router();
const Cart = require('../models/Cart');

// Get cart (create if doesn't exist)
router.get('/', async (req, res, next) => {
  try {
    let cart = await Cart.findOne();

    if (!cart) {
      cart = await Cart.create({ items: [], total: 0 });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
});

// Calculate cart total
const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    const toppingTotal = item.selectedToppings
      ? item.selectedToppings.reduce((sum, t) => sum + (t.price || 0), 0)
      : 0;
    return total + (item.basePrice + toppingTotal) * item.qty;
  }, 0);
};

// Add item to cart
router.post('/add', async (req, res, next) => {
  try {
    const { pizzaId, name, basePrice, selectedToppings = [] } = req.body;

    if (!pizzaId || !name || basePrice === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: pizzaId, name, basePrice'
      });
    }

    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ items: [], total: 0 });
    }

    const existingItem = cart.items.find(item => item.pizzaId === pizzaId);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.items.push({
        pizzaId,
        name,
        basePrice: Number(basePrice),
        qty: 1,
        selectedToppings
      });
    }

    cart.total = calculateTotal(cart.items);
    await cart.save();

    res.json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
});

// Update item quantity
router.put('/update', async (req, res, next) => {
  try {
    const { pizzaId, qty } = req.body;

    if (!pizzaId || qty === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: pizzaId, qty'
      });
    }

    let cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    const item = cart.items.find(item => item.pizzaId === pizzaId);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }

    if (qty <= 0) {
      cart.items = cart.items.filter(item => item.pizzaId !== pizzaId);
    } else {
      item.qty = qty;
    }

    cart.total = calculateTotal(cart.items);
    await cart.save();

    res.json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
});

// Remove item from cart
router.delete('/remove/:pizzaId', async (req, res, next) => {
  try {
    const { pizzaId } = req.params;

    let cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => item.pizzaId !== pizzaId);
    cart.total = calculateTotal(cart.items);
    await cart.save();

    res.json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
});

// Clear cart
router.delete('/clear', async (req, res, next) => {
  try {
    let cart = await Cart.findOne();

    if (!cart) {
      cart = new Cart({ items: [], total: 0 });
    } else {
      cart.items = [];
      cart.total = 0;
    }

    await cart.save();

    res.json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;