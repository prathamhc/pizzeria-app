require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/pizzas', require('./routes/pizza.routes'));
app.use('/ingredients', require('./routes/ingredient.routes'));
app.use('/cart', require('./routes/cart.routes'));
app.use('/orders', require('./routes/order.routes'));

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Pizzeria Server is running',
        version: '2.0.0'
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;