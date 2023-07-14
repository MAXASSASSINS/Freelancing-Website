import React, { useContext } from "react";
import { OrderMessageInput } from "./OrderMessageInput";
import { IoClose } from "react-icons/io5";
import { uploadToCloudinaryV2 } from "../../utility/cloudinary";
import axios from "axios";
import { useSelector } from "react-redux";
import { SocketContext } from "../../context/socket/socket";

export const ChatBox = ({ setFileLoading }) => {
  const { user, isAuthenticated, userLoading, userError } = useSelector(
    (state) => state.user
  );

  const { orderDetail } = useSelector((state) => state.orderDetail);

  const socket = useContext(SocketContext);

  const sendChat = async (message, selectedFiles) => {
    setFileLoading(true);
    let files = [];
    try {
      // upload files to cloudinary
      files = await sendFileClientCloudinary(selectedFiles);
      // console.log(files);

      // add message to database
      const res = await addMessageToDatabase(message, files);
      console.log(res);

      // send message to socket
      await handleSendMessageSocket(res.newMessage, files);
    } catch (error) {
      console.log(error);
    } finally {
      setFileLoading(false);
    }
  };

  // client side uploading to cloudinary
  const sendFileClientCloudinary = async (files) => {
    console.log(files);

    try {
      const res = await uploadToCloudinaryV2(files, 5 * 1024 * 1024 * 1024);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // add message to database
  const addMessageToDatabase = async (message, files = []) => {
    try {
      const messageData = {
        message,
        from: user._id,
        to:
          user._id === orderDetail.buyer._id
            ? orderDetail.seller._id
            : orderDetail.buyer._id,
        files,
        orderId: orderDetail._id,
      };

      const { data } = await axios.post("/add/message", messageData);
      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleSendMessageSocket = async (message, files) => {
    const rec =
      user._id === orderDetail.buyer._id
        ? orderDetail.seller
        : orderDetail.buyer;
    console.log(rec);
    const sender = {
      avatar: user.avatar,
      name: user.name,
      _id: user._id,
    };
    const receiver = {
      avatar: rec.avatar,
      name: rec.name,
      _id: rec._id,
    };

    if (receiver._id !== rec._id) return;

    const messageData = {
      ...message,
      sender,
      receiver,
    };

    await socket.emit("send_message", messageData);
  };

  return (
    <div>
      <OrderMessageInput handleSubmissionOfForm={sendChat} />
    </div>
  );
};
