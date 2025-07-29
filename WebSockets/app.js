require('dotenv').config();

const express=require('express');
const path = require('path');
const app=express();
const socketIO=require('socket.io');
const http=require('http');

// Create HTTP server (wrap Express)
const server=http.createServer(app);


// Initialize Socket.IO with the server
const io=socketIO(server);


// socket represents a unique real-time connection between the server and one client.
// Every time a user (client) connects to your server using Socket.IO, a new socket object is created.
// That socket has a unique socket.id, which helps you identify which client is sending/receiving data.

// Triggers the io.on('connection', ...) on the Node.js server.


// io.on('connection',function(socket){

//   // console.log(`Io connected with id : ${socket.id}`);


//   // socket.on('disconnect',function(){
//   //   console.log('socket disconnect...');
//   // })


//   // socket.on('abcd',function(data){
//   //   // console.log('Received msg from fronted to backend:', data);
//   //   //  io.emit('reply', `Received your message: ${data}`); //for all users  // ✅ For all connected users:  ← Broadcast to all
//   // })


//   // socket.on('defg',function(data){
//   //   // socket.emit(); khud ko bhejo event   // Send response only to the sender
//   //    socket.emit('reply', `Received your message: ${data}`);
//   // })


// //   socket.on('typing',function(data){
// //     // ✅ For all users except sender:
// //     // socket.broadcast.emit('event', 'msg to others'); ← Exclude self

// //     socket.broadcast.emit('yes', `Received your message: ${data}`);
// //   })



// //socket.join('roomname') lets a client join a named room (like a group or channel), so the server can target messages to only those in that room.
// // A room is a virtual group on the server.

// // socket.join('roomname');

// })


// io.on('connection',function(socket){
// console.log('Connected');
// socket.on('connect akash',function(data){
//   socket.emit('event',`${data}`);
// })

// socket.on('disconnect',function(){
//  console.log('Disconnect From Server');
// })

// })


io.on('connection',function(socket){

socket.on('somemessage',function(data){
  console.log('Receive some message..', `${data}`);

  // io.emit('message',data); // for all user
  
  socket.emit('message',`${data}`); // for one user who send the data 

})

socket.on('typing',function(){
  socket.broadcast.emit('hello');
})

})





// socketIO();

const PORT=process.env.PORT || 3000;

const dbConnect=require('./config/db');

// Middleware and configs
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

dbConnect();


app.get('/',function(req,res){
  // res.send('Hello dosto yh mai hu aur ye mera dost chiku...');
  res.render('index');
})


// ✅ 5. Start the server (must use server.listen, not app.listen with Socket.IO):
// same server pr listen 
server.listen(PORT,()=>{
  console.log(`Server is running on Port: http://localhost:${PORT}`);
})


