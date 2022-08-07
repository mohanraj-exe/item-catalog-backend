const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

// Imports
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

dotenv.config();

mongoose
.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWD}@cluster0.y4fzb.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then(() =>{
    console.log("...DB Connection Success")
})
.catch((err) =>{
    console.log(err)
})

app.use(express.json())

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);

const port = 4000 || process.env.PORT;
app.listen(port, ()=>{
    console.log('...BackEnd Server is running')
})