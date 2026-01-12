const router = require("express").Router();
const Pizza = require("../models/Pizza")

router.get("/", async(req, res)=>{
res.json(await Pizza.find());
})

module.exports = router;