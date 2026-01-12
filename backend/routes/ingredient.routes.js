const router = require("express").Router();
const Ingredients = require("../models/Ingredients");

router.get("/", async(req, res)=>{
res.json(await Ingredients.find());
})

module.exports = router;