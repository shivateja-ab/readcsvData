const fs = require('fs');
const multer = require('multer');
const csv = require('fast-csv');
const express = require('express');
const router = new express.Router();
const Player = require('../model/player');
const aqp = require('api-query-params');
const csvFilter = (req, file, cb) => {
    if (file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb("Please upload only csv file.", false);
    }
  };
var upload = multer({ dest: 'files/csv/' , fileFilter: csvFilter });
router.post('/upload', upload.single('file'), function (req, res) {
    const fileRows = [];
  
    csv.parseFile(req.file.path)
      .on("data", function (data) {
        fileRows.push(data); // push each row
      })
      .on("end",  function () {
        fileRows.slice(1,-1).map(file=>{
            Player.create({id:file[0],name:file[1],dob:file[2],battinghand:file[3],bowlingskill:file[4],country:file[5]}, function (err, res) {
                if(res){
                    console.log(res)
                }
                console.log(err)
            })
        })
        fs.unlinkSync(req.file.path); 
      })
  });

  router.get('/',async function(req,res){
    try{
        const posts=await Player.find();
        return res.json({
            status:"success",
            data:{
                posts
            }
        })
    }catch(e){
        res.json({
            status:"failed",
            message:e.message
        })
    }
})

router.get('/find',async function(req,res){
    const { filter } = aqp(req.query);
    const data=await Player.find(filter).exec((err, data) => {
        if (err) {
          res.json({
              status:"failed"
          })
        }
        if (data.length){
          res.json({
            status:"success",
            data:{
                data
            }
          });
        }
        else{
          res.json({
            message:"data not found"
          });
        }
      });
  });
router.delete('/find',async function(req,res){
    const { filter } = aqp(req.query);
    const data= await Player.find(filter).exec((err, data) => {
        if (err) {
          res.json({
              status:"failed"
          })
        }
        if (data.length){
          data.map(async info=>{
            console.log(info.id,info.name)
             await Player.deleteOne({id:info.id})
          })
          res.json({
              status:"success"
            })
        }
        else{
          res.json({
            message:'data not found'
          })
        }
        
  
      });
  });
  
module.exports=router;