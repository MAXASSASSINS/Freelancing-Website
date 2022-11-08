
import { Socket, Server } from 'socket.io'
import Message from "../models/messageModel.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/userModel.js"

export const runSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
        }
    })

    let onlineUserList = new Map();
    let currentUserId = "";




    io.on('connection', (socket) => {
        // console.log(onlineUserList);

        socket.on("new_user", (userId) => {
            // console.log("new user connected with id: " + userId);
            addNewUser(userId, socket.id);
            updateUserOnlineStatus(userId, socket);
            currentUserId = userId;
        })

        // console.log(socket.id);
        // console.log(io.engine.clientsCount);

        socket.on("join_room", (data) => {
            socket.join(data);
            // console.log(`user with id ${socket.id} joined room ${data}`);
        })

        socket.on("send_message", async (data) => {
            // console.log(data);
            const { message, sender, receiver, messageType } = data;

            if (sender._id.toString() === receiver._id.toString()) {
                return;
            }

            await Message.create({
                message,
                users: [sender._id, receiver._id],
                sender,
                receiver,
                messageType,
            });

            const receiverSocketId = onlineUserList.get(receiver._id.toString());
            io.to(receiverSocketId).emit("receive_message", (data));

            console.log("i am backend send_message");
        })

        socket.on("typing_started", (data) => {
            socket.to(onlineUserList.get(data.receiverId)).emit("typing_started_from_server", data);
        })
        socket.on("typing_stopped", (data) => {
            socket.to(onlineUserList.get(data.receiverId)).emit("typing_stopped_from_server", data);
        })

        socket.on("is_online", (clientId) => {
            // console.log(clientId);
            const online = onlineUserList.has(clientId);
            // console.log(online);
            const newData = {
                id: clientId,
                online,
            }
            socket.emit("is_online_from_server", newData);
        })


        socket.on("online", async (userId) => {
            if (userId) {
                updateUserOnlineStatus(userId, socket);
            }
        })

        socket.on('disconnect', () => {
            // console.log(currentUserId);
            console.log(socket.id);
            // const userId = getUserBySocketId(socket.id);
            const userId = currentUserId;
            // console.log("user disconnected " + userId);
            if (userId) {
                updateUserLastSeenAndOnlineStatus(userId, socket)
            }


        })
    })

    const addNewUser = (userId, socketId) => {
        if (!onlineUserList.has[userId]) {
            onlineUserList.set(userId, socketId);
        }
    }

    const removeUser = async (socketId) => {
        const userId = getUserBySocketId(socketId);
        onlineUserList.delete(userId);
    }

    const getUserBySocketId = (socketId) => {
        // console.log(onlineUserList)
        // console.log(socketId + " outstide");
        for (let [key, value] of onlineUserList.entries()) {
            if (value === socketId)
                return key;
        }
    }


    const updateUserLastSeenAndOnlineStatus = catchAsyncErrors(async (userId, socket, next) => {

        let user = await User.findById(userId);
        // console.log(user.online);
        if (!user) {
            return next(new ErrorHandler(`user does not exist with id: ${userId}`))
        }
        await User.findByIdAndUpdate(userId, { lastSeen: Date.now(), online: false }, {
            new: true,
            runValidators: true,
            useFindandModify: false
        }).then((res) => {
            console.log(res.online);
            // console.log("offline from server backend");
            socket.broadcast.emit("offline_from_server", userId);
            removeUser(socket.id);
        })
    })

    const updateUserOnlineStatus = catchAsyncErrors(async (userId, socket, next) => {
        let user = await User.findById(userId);

        if (!user) {
            return next(new ErrorHandler(`user does not exist with id: ${userId}`))
        }

        if (user.online === true) return;

        await User.findByIdAndUpdate(userId, { online: true }, {
            new: true,
            runValidators: true,
            useFindandModify: false
        }).then(() => {
            socket.broadcast.emit("online_from_server", userId);
        })
    })


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

}


