import { Socket, Server } from "socket.io";
import Message from "../models/messageModel.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";

export const runSocket = (server) => {
  const io = new Server(server, {
    // pingTimeout: 60000,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let onlineUserList = new Map();
  let currentUserId = "";

  io.on("connection", (socket) => {
    // console.log(socket.id);

    socket.on("new_user", (userId) => {
      addNewUser(userId, socket.id);
    });

    socket.on("join_room", (data) => {
      socket.join(data);
    });

    socket.on("send_message", async (data) => {
      const { message, sender, receiver, messageType } = data;
      const receiverSocketIds = onlineUserList.get(receiver._id.toString());
      const senderSocketIds = onlineUserList.get(sender._id.toString());

      receiverSocketIds?.forEach((receiverSocketId) => {
        io.to(receiverSocketId).emit("receive_message", data);
      });

      senderSocketIds?.forEach((senderSocketId) => {
        io.to(senderSocketId).emit("receive_message_self", data);
      });
    });

    socket.on("typing_started", (data) => {
      const receiverSocketIds = onlineUserList.get(data.receiverId);

      receiverSocketIds?.forEach((receiverSocketId) => {
        socket.to(receiverSocketId).emit("typing_started_from_server", data);
      });
    });
    socket.on("typing_stopped", (data) => {
      const receiverSocketIds = onlineUserList.get(data.receiverId);

      receiverSocketIds?.forEach((receiverSocketId) => {
        socket.to(receiverSocketId).emit("typing_stopped_from_server", data);
      });
    });

    socket.on("is_online", (clientId) => {
      const online = onlineUserList.has(clientId);
      const newData = {
        id: clientId,
        online,
      };
      socket.emit("is_online_from_server", newData);
    });

    socket.on("online", async (userId) => {
      if (userId) {
        io.emit("online_from_server", userId);
      }
    });

    socket.on("get_online_status_of_all_clients", async (list) => {
      if (list.length == 0) return;
      const onlineStatusList = [];
      for (let clientId of list) {
        const online = onlineUserList.has(clientId.toString());
        onlineStatusList.push({
          id: clientId,
          online,
        });
      }

      // console.log(onlineStatusList);
      socket.emit("online_status_of_all_clients_from_server", onlineStatusList);
    });

    socket.on("disconnect", () => {
      console.log("disconnect", socket.id);
      const userId = getUserBySocketId(socket.id);
      removeUser(socket.id, userId);

      if (!onlineUserList.has(userId)) {
        Promise.resolve(updateUserLastSeen(userId, socket)).then(() => {
          io.emit("offline_from_server", userId);
        });
      }
    });
  });

  const addNewUser = (userId, socketId) => {
    if (!onlineUserList.has(userId)) {
      const set = new Set();
      set.add(socketId);
      onlineUserList.set(userId, set);
    } else {
      const set = onlineUserList.get(userId);
      set.add(socketId);
      onlineUserList.set(userId, set);
    }
  };

  const removeUser = async (socketId, userId) => {
    const set = onlineUserList.get(userId);
    console.log(set);
    if (!set) return;
    set.delete(socketId);
    if (set.size === 0) {
      onlineUserList.delete(userId);
    } else {
      onlineUserList.set(userId, set);
    }
  };

  const getUserBySocketId = (socketId) => {
    // console.log(onlineUserList)
    // console.log(socketId + " outstide");
    for (let [key, value] of onlineUserList.entries()) {
      if (value.has(socketId)) {
        return key;
      }
    }
  };

  const updateUserLastSeen = async (userId, socket, next) => {
    try {
      let user = await User.findById(userId);
      // console.log(user.online);
      if (!user) {
        return new ErrorHandler("User not found", 404);
      }
      await User.findByIdAndUpdate(
        userId,
        { lastSeen: Date.now() },
        {
          new: true,
          runValidators: true,
          useFindandModify: false,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const joinRoom = async (senderId, receiverId) => {
    const r = await createRoom(senderId, receiverId);
    socket.join(r);
  };

  const createRoom = async (senderId, receiverId) => {
    if (senderId.toString() > receiverId.toString()) {
      return senderId.toString() + "|" + receiverId.toString();
    } else {
      return receiverId.toString() + "|" + senderId.toString();
    }
  };
};
