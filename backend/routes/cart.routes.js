const router = require('express').Router();
const Cart = require('../models/Cart');

router.get('/', async (req, res) => {
  const cart = await Cart.findOne();
  res.json(cart || { items: [], total: 0 });
});

router.post('/add', async (req, res) => {
  let cart = await Cart.findOne();
  if (!cart) cart = await Cart.create({ items: [], total: 0 });

  const item = req.body;

  const basePrice = Number(item.basePrice);
  const pizzaId = item.pizzaId;

  if (isNaN(basePrice)) {
    return res.status(400).json({ message: 'Invalid price' });
  }

  const existing = cart.items.find(i => i.pizzaId === pizzaId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.items.push({
      pizzaId: pizzaId,
      name: item.name,
      basePrice: basePrice,
      qty: 1
    });
  }

  cart.total = cart.items.reduce(
    (sum, i) => sum + Number(i.basePrice) * Number(i.qty),
    0
  );

  await cart.save();
  res.json(cart);
});


router.put('/update', async (req, res) => {
  const { pizzaId, qty } = req.body;

  const cart = await Cart.findOne();
  if (!cart) return res.status(400).json({ message: 'Cart not found' });

  const item = cart.items.find(i => i.pizzaId === pizzaId);
  if (item) {
    item.qty = Number(qty);
  }

  cart.items = cart.items.filter(i => i.qty > 0);

  cart.total = cart.items.reduce(
    (sum, i) => sum + Number(i.basePrice) * Number(i.qty),
    0
  );

  await cart.save();
  res.json(cart);
});


router.delete('/clear', async (req, res) => {
  await Cart.deleteMany();
  res.json({ message: 'Cart cleared' });
});

module.exports = router;
