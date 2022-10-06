
import { Socket, Server } from 'socket.io'
import Message from "../models/messageModel.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";


export const runSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
        }
    })

    let onlineUserList = new Map();

    const addNewUser = (userId, socketId) => {
        if (!onlineUserList.has[userId]) {
            onlineUserList.set(userId, socketId);
        }
    }

    const removeUser = (socketId) => {
        const userId = getUserBySocketId(socketId);
        onlineUserList.delete(userId);
    }

    const getUserBySocketId = (socketId) => {
        for (let [key, value] of onlineUserList.entries()) {
            if (value === socketId)
                return key;
        }
    }

    const joinRoom = async (senderId, receiverId) => {
        const r = await createRoom(senderId, receiverId);
        socket.join(r);
    }

    const createRoom = async (senderId, receiverId) => {
        if (senderId.toString() > receiverId.toString()) {
            return senderId.toString() + "|" + receiverId.toString();
        }
        else {
            return receiverId.toString() + "|" + senderId.toString();
        }
    }



    io.on('connection', (socket) => {

        socket.on("new_user", userId => {
            console.log("new user connected with id: " + userId);
            addNewUser(userId, socket.id);
        })

        console.log(socket.id);
        console.log(io.engine.clientsCount);

        socket.on("join_room", (data) => {
            socket.join(data);
            // console.log(`user with id ${socket.id} joined room ${data}`);
        })

        socket.on("send_message", async (data) => {
            // console.log(data);
            const { messageData, room } = data;
            const { message, sender, receiver } = messageData;


            if (sender._id.toString() === receiver._id.toString()) {
                return;
            }

            // await joinRoom(sender._id, receiver._id);

            await Message.create({
                message,
                users: [sender._id, receiver._id],
                sender,
                receiver,
            });
            // socket.to(room).emit("receive_message", (data));
            // socket.broadcast.emit("receive_message", data);

            const receiverSocketId = onlineUserList.get(receiver._id.toString()); 
            io.to(receiverSocketId).emit("receive_message", (data));

            console.log("i am backend send_message");
        })

        socket.on('disconnect', () => {
            removeUser(socket.id);
            console.log("user disconnected", socket.id);
        })

        


    })




}


