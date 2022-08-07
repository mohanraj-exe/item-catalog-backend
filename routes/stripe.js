const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY)

router.post("/payment", (req,res) =>{
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "inr"
    },(stripeErr, stripeRes) =>{
        if(stripeErr){
            res.status(500).json(stripeErr)
        }else{
            res.status(200).json(stripeRes)
        }
    })
})


module.exports = router;