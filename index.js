require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require("http");

const { PORT, MONGO_URI } = process.env;

const app = express();
const port = 3000;

app.use(express.json());
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
const io = SocketIo(server, {path: '/socket.io'});

io.on("connection", (socket)=> {
    console.log(`enter`)
    socket.on('enter', (data)=> {
        const userData = JSON.parse(data)
        const roomNum = userData.currentRoom

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
        io.to(`${data.room}`).emit(`someoneDead`, JSON.stringify(data))
    })

    socket.on(`ready`, (data)=> {
        const userData = JSON.parse(data)
        const roomNum = userData.currentRoom
        io.to(`${data.room}`).emit(`someoneReady`, JSON.stringify(data))
    })

    socket.on("newMessage", (chat) => {
        
        io.to(`${data.room}`).emit(`getMessage`, JSON.stringify(data))
      });
});


