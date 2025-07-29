require('dotenv').config();
const express=require('express');
const app=express();
const path=require('path');

const http=require('http');
const socketIO=require('socket.io');
const server=http.createServer(app);
const io=socketIO(server);


const PORT=process.env.PORT || 3000;
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extendedt:true}));
app.use(express.static(path.join(__dirname,'public')));

const dbConnect=require('./config/db');
const indexRouter=require('./routes');
dbConnect();


let waitingusers=[];
let rooms={};



io.on('connection',(socket)=>{
  socket.on("joinroom",()=>{
    if(waitingusers.length>0){
    let partner=waitingusers.shift();
    const roomname=`${socket.id} - ${partner.id}`;
    socket.join(roomname);
    partner.join(roomname);

    io.to(roomname).emit('joined',roomname);
    }
    else{
      waitingusers.push(socket);
    }
  });
 
  socket.on('signalingMessage',(data)=>{
  socket.broadcast.to(data.room).emit('signalingMessage',data.message);

  })

  socket.on('startVideoCall',({room})=>{
  socket.broadcast.to(room).emit('incomingCall');
  })
  
  socket.on('rejectCall',({room})=>{
  socket.broadcast.to(room).emit('callRejected');
  })

  socket.on("message",(data)=>{
  socket.broadcast.to(data.room).emit("message" ,data.message);
  });
  
  socket.on('acceptCall',({room})=>{
    socket.broadcast.to(room).emit('callAccepted');
  })

  socket.on('disconnect',(socket)=>{
    let index=waitingusers.findIndex(waitingUser => waitingUser.id===socket.id);
    waitingusers.splice(index,1);
  });

});



app.use('/',indexRouter);



server.listen(PORT,()=>{
  console.log(`Server is running on PORT: http://localhost:${PORT}`);
});

