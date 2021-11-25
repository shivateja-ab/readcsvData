const express = require('express');
const bodyParser=require('body-parser');
const playerRoutes = require('./routes/addcsv');
const userRoutes=require('./routes/user');
const jwt=require('jsonwebtoken');
const app = express();
const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/playerdata");


app.set("view engine", "ejs");
app.get('/', function(req, res) {
    res.render('./uploadpage');
  });
app.use('/players',function(req,res,next){
    try{
        const token = req.headers.authorization?.split(" ")[1];
        if (!token){
            return res.status(401).json({
                status:"failed",
                message:"Not Authenticated"
            })
        }
        const decoded=jwt.verify(token,'Data-Secret-Signature');
        if(!decoded){
            return res.status(401).json({
                status:"failed",
                message:"Invalid token"
            })
        }
        console.log(decoded)
        req.user = decoded.data;
    }catch(e){
        res.json({
            status:'failed',
            message:e.message
        })
    }
    next();
})
app.use(bodyParser.json())

app.use("/",userRoutes);

app.use('/players', playerRoutes);

// Start server
app.listen('3000',console.log('Server listening to port 3000'));