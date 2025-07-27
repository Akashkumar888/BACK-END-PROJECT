
const mongoose=require('mongoose');

const dbConnect=async ()=>{
try{
 mongoose.connect(process.env.MONGO_URI);
 console.log('Database connected Successfully...');
}
catch(err){
 console.log('Database connection failed...');
 process.exit(1);
}
};

module.exports=dbConnect;

