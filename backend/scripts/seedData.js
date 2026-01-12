require('dotenv').config();
const mongoose = require('mongoose');
const Pizza = require('../models/Pizza');
const Ingredient = require('../models/Ingredient');

const pizzaData = require('../db/pizza.json');
const ingredientData = require('../db/ingredients.json');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('Clearing existing data...');
        await Pizza.deleteMany({});
        await Ingredient.deleteMany({});

        const transformedPizzas = pizzaData.map(pizza => ({
            pizzaId: pizza.id,
            name: pizza.name,
            type: pizza.type,
            price: pizza.price,
            image: pizza.image,
            description: pizza.description,
            ingredients: pizza.ingredients,
            topping: pizza.topping
        }));

        console.log('Seeding pizzas...');
        const pizzas = await Pizza.insertMany(transformedPizzas);
        console.log(`Added ${pizzas.length} pizzas`);

        console.log('Seeding ingredients...');
        const ingredients = await Ingredient.insertMany(ingredientData);
        console.log(`Added ${ingredients.length} ingredients`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedDatabase();