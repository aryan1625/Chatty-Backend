const express = require('express')
const cors = require("cors")
const connectDB=require('./db/connect');
const userRoutes = require("./routes/userRoutes")
const messagesRoutes = require("./routes/messagesRoutes")
const app  = express()
const socket = require("socket.io")
require ('dotenv').config()

//middleware
app.use(cors())
app.use(express.json())
app.use("/api/auth",userRoutes)
app.use("/api/messages",messagesRoutes)

port = process.env.PORT||3000
// const server = app.listen(port,()=>{
//     console.log(`listening on port ${port}...`)
// })
const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        const server = app.listen(port,()=>{
            console.log(`listening on port ${port}...`)
        })
        const io =  socket(server,{
            cors:{
                origin: "http://localhost:5173",
                credentials: true,
            }
        })
        global.onlineUsers = new Map();
        io.on("connection",(socket)=>{
            global.chatSocket = socket;
            socket.on("add-user",(userId)=>{
                onlineUsers.set(userId,socket.id)
            })

            socket.on("send-msg",(data)=>{
                const sendUserSocket = onlineUsers.get(data.to);
                if(sendUserSocket){
                    socket.to(sendUserSocket).emit('msg-recieve',data.message)
                }
            })
    })


    } catch (error) {
        console.log(error)
    }
}   
start()