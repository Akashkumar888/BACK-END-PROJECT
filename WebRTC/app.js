require('dotenv').config();

const express=require('express');
const app=express();
const path=require('path');
const http=require('http');
const PORT=process.env.PORT || 3000;
const socketIO=require('socket.io');
const dbConnect=require('./config/db');
const { Socket } = require('dgram');

const server=http.createServer(app);


const io=socketIO(server);

// middleware
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

dbConnect();



io.on('connection',(socket)=>{
  
socket.on('signalingMessage',function(message){
socket.broadcast.emit('signalingMessage',message);

})

})


app.get('/',function(req,res){
  // res.send('Hello dosto yh mai hu aur ye mera dost chiku...');
  res.render('index');
})

server.listen(PORT,()=>{
  console.log(`Server is running on PORT : http://localhost:${PORT}`);
});



