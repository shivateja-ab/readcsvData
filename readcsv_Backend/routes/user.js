const express=require("express");
const User=require('../model/user');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

const router = express.Router();
router.post('/login',async function(req,res){
    try{
        const {email,password}=req.body;
        const user = await User.findOne({email});
        if (!user){
            return res.json({
                status:'failed',
                message:'user not registered'
            })
        }
        const match=await bcrypt.compare(password,user.password);
        if(!match){
            return res.json({
                status:'failed',
                message:'Invalid Password'
            })

        }
        const token=jwt.sign({
            exp:Math.floor(Date.now()/1000)+(60*60),
            data:user._id,
        },'Data-Secret-Signature')
        res.json({
            status:'success',
            data:{
                token
            }
        })    
    }catch(e){
        return res.json({
            status:'failed',
            message:'Internal error'
        })
    }
})

router.post('/register',async function(req,res){
    try{
        const {name,email,password}=req.body;
        const hash=await bcrypt.hash(password,10);
        await User.create({name,email,password:hash});
        res.json({
            status:"success",
            message:"Signed Up"
        })

    }catch(e){
        res.json({
            status:"failed",
        message:e.message
        })
    }
})


module.exports=router;