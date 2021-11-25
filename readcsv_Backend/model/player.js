const mongoose = require('mongoose');
const PlayerSchema = mongoose.Schema({
    id:{type:String,required:true},
    name:{type:String,required:true},
    dob:{type:String},
    battinghand:{type:String},
    bowlingskill:{type:String},
    country:{type:String}
});
const Player = mongoose.model("Player", PlayerSchema);
module.exports = Player;