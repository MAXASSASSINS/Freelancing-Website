import React, { useState, useEffect, useRef, useContext } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { BsEmojiSmile } from "react-icons/bs";
import { TextArea } from "../TextArea/TextArea";
import { useSelector } from "react-redux";
import axios from "axios";
import { SocketContext } from "../../context/socket/socket";

export const OrderMessageInput = ({ orderDetail, fileLoading, setFileLoading }) => {
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.user
  );

  const socket = useContext(SocketContext);

  const inboxChatFormRef = useRef(null);
  const chatTextAreaRef = useRef(null);

  const emojiPickerOpenerIconRef = useRef(null);

  const scrollToBottomDivRefInbox = useRef(null);
  const [message, setMessage] = useState("");
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);
  // const [fileLoading, setFileLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

 

  const handleEmojiClick = (emoji) => {
    console.log(emoji);
    setShowEmojiPicker(false);
    setMessage(message + emoji.native);
  };

  const handleEmojiPickerHideOrShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleSelectionOfFiles = (event) => {
    const files = event.target.files;
    let arr = [];
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        arr.push(selectedFiles[i]);
      }
    }
    for (let i = 0; i < files.length; i++) {
      let index = 0;
      if (selectedFiles != null) {
        index = selectedFiles.length + i;
      } else {
        index = i;
      }
      const file = {
        selectedFile: files[i],
        id: index,
      };
      arr.push(file);
    }
    document.getElementById("file-input").value = "";
    if (arr.length === 0) {
      setSelectedFiles(null);
      setIsFilePicked(false);

      return;
    }
    setIsFilePicked(true);
    setSelectedFiles(arr);
    scrollToBottomDivRefInbox.current?.scrollIntoView();
  };

  const handleSubmissionOfInboxForms = async () => {
    await sendChat();
  };

  const sendChat = async () => {
    setFileLoading(true);
    // setIsFilePicked(false);

    let files = [];
    try {
      // upload files to cloudinary
      files = await sendFileClientCloudinary(selectedFiles);
      // console.log(files);
      // return;
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

    if (isFilePicked) {
      const arr = files.map((file) => {
        return file.selectedFile;
      });

      try {
        const res = await uploadToCloudinaryV2(arr, 5 * 1024 * 1024 * 1024);
        return res;
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setIsFilePicked(false);
        setSelectedFiles(null);
      }
    }
    return [];
  };

  // add message to database
  const addMessageToDatabase = async (messageData, files = []) => {
    try {
      const messageData = {
        message,
        from: user._id,
        to: user._id === orderDetail.buyer._id ? orderDetail.seller._id : orderDetail.buyer._id,
        files,
        orderId: orderDetail._id,
      };

      const { data } = await axios.post("/add/message", messageData);
      console.log(data);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setMessage("");
    }
  };

  const handleFileClickedRemoval = (id) => () => {
    let arr = selectedFiles;
    arr = arr.filter((file) => {
      return file.id !== id;
    });
    if (arr.length === 0) {
      setIsFilePicked(false);
      setSelectedFiles(null);
      document.getElementById("file-input").value = "";
      return;
    }
    setSelectedFiles(arr);
  };

  // console.log(orderDetail);
  const handleSendMessageSocket = async (message, files) => {
    const rec = user._id === orderDetail.buyer._id ? orderDetail.seller : orderDetail.buyer;
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

    console.log('messageData', messageData);
    await socket.emit("send_message", messageData);
    // console.log(allClientUserLastMessage);
  };

  window.onclick = (event) => {
    if (
      event.target !== document.querySelector("em-emoji-picker") &&
      !emojiPickerOpenerIconRef.current.contains(event.target)
    ) {
      setShowEmojiPicker(false);
    }
  };

  return (
    <div>
      <form
        ref={inboxChatFormRef}
        id="inbox-chat-form"
        onSubmit={(e) => e.preventDefault()}
      >
        {isFilePicked && (
          <div className="max-h-[124px] p-4 text-light_heading mb-4 overflow-y-scroll border border-no_focus rounded-[4px]">
            <div className="text-[10px] font-semibold">
              ATTACHED FILES (
              {selectedFiles &&
                selectedFiles.length !== 0 &&
                selectedFiles.length}
              )
            </div>
            <ul>
              {selectedFiles &&
                selectedFiles.length > 0 &&
                selectedFiles.map((file, index) => (
                  <li
                    className="mt-2 mr-2 list-none py-0.5 px-3 rounded border border-dark_separator bg-separator inline-flex items-center max-w-[200px] text-sm"
                    key={index}
                  >
                    <div className="text-ellipsis whitespace-nowrap overflow-hidden text-right">
                      {file.selectedFile.name}
                    </div>
                    <button
                      className="ml-2 border-none"
                      type="button"
                      onClick={handleFileClickedRemoval(file.id)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        )}
        <textarea
          className="p-2 text-sm overflow-y-scroll border border-no_focus rounded-[3px] block w-full max-h-40 leading-6 resize-none focus:outline-none focus:border-dark_grey"
          ref={chatTextAreaRef}
          rows={6}
          maxLength={2500}
          onChange={(e) => {
            setMessage(e.target.value), (e.target.style.height = "auto");
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          value={message}
          placeholder="Type your message here..."
          spellCheck={false}
          onBlur={(e) => (e.target.parentElement.style.borderColor = "#a6a5a5")}
        />

        <div className="relative w-full flex items-center justify-between mt-4">
          <div className="flex">
            <div
              onClick={handleEmojiPickerHideOrShow}
              ref={emojiPickerOpenerIconRef}
              className="text-2xl text-light_heading mr-4 rounded-full p-2 hover:bg-off_white hover:text-primary hover:cursor-pointer inbox"
            >
              <div>
                <BsEmojiSmile />
              </div>
            </div>
            <div className="absolute bottom-16 left-2">
              {showEmojiPicker && (
                <Picker
                  onEmojiSelect={handleEmojiClick}
                  perLine={8}
                  skinTonePosition="none"
                  previewPosition="none"
                  maxFrequentRows={2}
                />
              )}
            </div>
            <div
              className="text-2xl text-light_heading mr-4 rounded-full hover:bg-off_white hover:text-primary hover:cursor-pointer [&>*]:hover:cursor-pointer"
              data-tooltip-content="Max 5GB"
              data-tooltip-place="top"
              data-tooltip-id="my-tooltip"
            >
              <label className="p-2" htmlFor="file-input">
                <i className="fa-solid fa-paperclip"></i>
              </label>
              <input
                onChange={handleSelectionOfFiles}
                id="file-input"
                multiple={true}
                type="file"
                // accept="image/*,video/*"
                hidden={true}
              ></input>
            </div>
          </div>
          <button
            className="bg-primary text-white rounded-[0.25rem] p-2 px-4"
            disabled={message.length <= 0 && !isFilePicked}
            onClick={handleSubmissionOfInboxForms}
            style={{
              opacity: message.length > 0 || isFilePicked ? "1" : "0.4",
            }}
          >
            <i className="fa-regular fa-paper-plane"></i>
            &nbsp; Send
          </button>
        </div>
      </form>
    </div>
  );
};
