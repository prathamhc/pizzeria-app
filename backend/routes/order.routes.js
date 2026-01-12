const router = require("express").Router();
const Order = require("../models/Order")

router.get("/", async(req, res)=>{
res.json(await Order.find());
})

module.exports = router;