require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require("http");
const cors = require('cors');
const { PORT, MONGO_URI } = process.env;

const app = express();
const port = 80;

app.use(express.json());
app.use(cors())
//const chatRouter = require('./src/routes/chat');
const userRouter = require('./src/routes/user');
const roomRouter = require('./src/routes/room');
/*
const whitelist = ['http://localhost:3000'];
const corsOptions = {
    origin: (origin, callback) => {
        console.log('[REQUEST-CORS] Request from origin: ', origin);
        if (!origin || whitelist.indexOf(origin) !== -1) callback(null, true)
        else callback(new Error('Not Allowed by CORS'));
    },
    credentials: true,
}

app.use(cors(corsOptions));*/

//app.use('/chat', chatRouter);
app.use('/user', userRouter);
app.use('/room', roomRouter);

//app.use('/static', express.static(path.join(__dirname,'public')));

//Connect to MongoDB
const OMongooseOption = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose
    .connect( MONGO_URI, OMongooseOption )
    .then(
        () => { console.log("[Mongoose] Connection Complete!") },
        (err) => { console.log(`[Mongoose] Connection Error: ${ err }`) }
    );



const server = app.listen(port, () => {
   console.log(`Example App Listening @ http://localhost:${ port }`);
});

const SocketIo = require("socket.io");
//const io = SocketIo(server, {path: '/socket.io'});
const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

io.on("connection", (socket)=> {
    console.log(`enter`)
    socket.on('enter', (data)=> {
        const userData = JSON.parse(data)
        const roomNum = userData.currentRoom
        console.log(userData.name)
        console.log(roomNum, "roomNum");
        socket.join(`${roomNum}`)
    })

    socket.on('left', (data) => {
        const userData = JSON.parse(data)
        const roomNum = userData.currentRoom
    
        socket.leave(`${roomNum}`)
    })
 
    socket.on(`dead`, (data)=> {
        const userData = JSON.parse(data)
        const roomNum = userData.currentRoom
        // io.to(`${data.room}`).emit(`someoneDead`, JSON.stringify(data))
        io.to(`${roomNum}`).emit(`someoneDead`, data)
    })

    socket.on(`ready`, (data)=> {
        const userData = JSON.parse(data)
        const roomNum = userData.currentRoom
        console.log(roomNum)
        // io.to(`${data.room}`).emit(`someoneReady`, JSON.stringify(data))
        io.to(`${roomNum}`).emit(`someoneReady`, data)
        
    })

    socket.on(`submit`, (data)=> {
        const userData = JSON.parse(data)
        const roomNum = userData.currentRoom
        // io.to(`${data.room}`).emit(`someoneReady`, JSON.stringify(data))
        io.to(`${roomNum}`).emit(`someoneSubmit`, data)
    })

    socket.on(`readyEnter`, (data) => {
        const userData = JSON.parse(data)
        const roomNum = userData.currentRoom
        console.log("ready")
        
        // io.to(`${data.room}`).emit(`someoneReady`, JSON.stringify(data))
        io.to(`${roomNum}`).emit(`someoneEnter`, data)
        console.log(data)
    })

    socket.on("newMessage", (data) => {
        const userData = JSON.parse(data)
        console.log("newmsg")
        const currentRoom = userData.room
        io.to(`${currentRoom}`).emit(`getMessage`, data)
      });
});


