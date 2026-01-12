const router = require('express').Router();
const Cart = require('../models/Cart');

router.get('/', async (req, res, next) => {
  try {
    console.log('GET /cart - Fetching cart');
    let cart = await Cart.findOne();

    if (!cart) {
      console.log('No cart found, creating new cart');
      cart = await Cart.create({ items: [], total: 0 });
    }

    console.log('Cart fetched:', cart);
    res.json({
      success: true,
      data: cart
    });
  } catch (err) {
    console.error('GET /cart error:', err);
    next(err);
  }
});

const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    const toppingTotal = item.selectedToppings
      ? item.selectedToppings.reduce((sum, t) => sum + (t.price || 0), 0)
      : 0;
    const itemTotal = (item.basePrice + toppingTotal) * item.qty;
    return total + itemTotal;
  }, 0);
};

router.post('/add', async (req, res, next) => {
  try {
    console.log('POST /cart/add - Request body:', req.body);
    const { pizzaId, name, basePrice, selectedToppings = [] } = req.body;

    if (!pizzaId || !name || basePrice === undefined) {
      console.error('Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: pizzaId, name, basePrice'
      });
    }

    let cart = await Cart.findOne();
    if (!cart) {
      console.log('No cart exists, creating new one');
      cart = new Cart({ items: [], total: 0 });
    }

    console.log('Current cart before adding:', cart);

    const existingItemIndex = cart.items.findIndex(item => item.pizzaId === pizzaId);

    if (existingItemIndex !== -1) {
      console.log('Item already exists, incrementing quantity');
      cart.items[existingItemIndex].qty += 1;
    } else {
      console.log('Adding new item to cart');
      cart.items.push({
        pizzaId,
        name,
        basePrice: Number(basePrice),
        qty: 1,
        selectedToppings
      });
    }

    cart.total = calculateTotal(cart.items);
    console.log('Cart after adding, before save:', cart);

    await cart.save();
    console.log('Cart saved successfully:', cart);

    res.json({
      success: true,
      data: cart
    });
  } catch (err) {
    console.error('POST /cart/add error:', err);
    next(err);
  }
});

router.put('/update', async (req, res, next) => {
  try {
    console.log('PUT /cart/update - Request body:', req.body);
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

    const itemIndex = cart.items.findIndex(item => item.pizzaId === pizzaId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }

    if (qty <= 0) {
      console.log('Quantity <= 0, removing item');
      cart.items.splice(itemIndex, 1);
    } else {
      console.log('Updating quantity to:', qty);
      cart.items[itemIndex].qty = qty;
    }

    cart.total = calculateTotal(cart.items);
    await cart.save();

    console.log('Cart updated:', cart);

    res.json({
      success: true,
      data: cart
    });
  } catch (err) {
    console.error('PUT /cart/update error:', err);
    next(err);
  }
});

router.delete('/remove/:pizzaId', async (req, res, next) => {
  try {
    console.log('DELETE /cart/remove - pizzaId:', req.params.pizzaId);
    const { pizzaId } = req.params;

    let cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(item => item.pizzaId === pizzaId);

    if (itemIndex !== -1) {
      console.log('Removing item from cart');
      cart.items.splice(itemIndex, 1);
    }

    cart.total = calculateTotal(cart.items);
    await cart.save();

    console.log('Cart after removal:', cart);

    res.json({
      success: true,
      data: cart
    });
  } catch (err) {
    console.error('DELETE /cart/remove error:', err);
    next(err);
  }
});

router.delete('/clear', async (req, res, next) => {
  try {
    console.log('DELETE /cart/clear - Clearing cart');

    let cart = await Cart.findOne();

    if (!cart) {
      cart = new Cart({ items: [], total: 0 });
    } else {
      cart.items = [];
      cart.total = 0;
    }

    await cart.save();
    console.log('Cart cleared:', cart);

    res.json({
      success: true,
      data: cart
    });
  } catch (err) {
    console.error('DELETE /cart/clear error:', err);
    next(err);
  }
});

module.exports = router;