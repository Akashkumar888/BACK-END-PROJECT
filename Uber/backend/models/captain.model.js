
import mongoose from "mongoose";

const captainSchema=new mongoose.Schema({

});

const captainModel=mongoose.models.Captain || mongoose.model("Captain",captainSchema);

export default captainModel;

