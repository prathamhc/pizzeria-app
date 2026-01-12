const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express();

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://localhost:27017/pizzeria")
.then(() =>{
    console.log("Connected to mongodb database")
}).catch(err=>{
    console.error(err)
});


app.use('/pizzas', require("./routes/pizza.routes"));
app.use('/ingredients', require("./routes/ingredient.routes"));
app.use('/cart', require('./routes/cart.routes'));
app.use('/orders', require("./routes/order.routes"));

app.get('/',(req,res)=>{
    res.send("<h1> This is Pizzeria Server </h1>")
    res.end();
})

app.listen(5000, ()=>{
    console.log('Server is running on port 5000');
})