import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import "./chat.css";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../actions/userAction";
import Moment from "react-moment";
import "moment-timezone";

import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export const Chat = ({ gigDetail, showChatBox, setShowChatBox }) => {
  const socket = io.connect("http://localhost:4000");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  new Picker({ data });
  // All States
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [allMessages, setAllMessages] = useState(null);

  // All References
  const chatTextAreaRef = useRef(null);
  const suggestionRef1 = useRef(null);
  const suggestionRef2 = useRef(null);
  const suggestionRef3 = useRef(null);
  const scrollToBottomDivRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    let isCancelled = false;
    // if(!isCancelled && !checkUserOpenItsOwnGig()){
    //   user && getAllMessagesBetweenTwoUser();
    // }
    // if (!isCancelled) {
    user && getAllMessagesBetweenTwoUser();
    // }

    // return (() => {
    //   isCancelled = true;
    // })
  }, [user]);

  useEffect(() => {
    chatTextAreaRef.current.style.height = "32px";
    const scrollHeight = chatTextAreaRef.current.scrollHeight;
    chatTextAreaRef.current.style.height = scrollHeight + "px";
    if (user && !allMessages && message.length === 0) {
      suggestionRef1.current.style.display = "inline-flex";
      suggestionRef2.current.style.display = "inline-flex";
      suggestionRef3.current.style.display = "inline-flex";
    }
  }, [message]);

  const handleEmojiPickerHideOrShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleSelectionOfFiles = (event) => {
    console.log(selectedFiles);
    const files = event.target.files;
    let arr = [];
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        arr.push(selectedFiles[i]);
      }
    }
    // console.log(arr);
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
      // console.log(file);
      // console.log(index);
      arr.push(file);
    }
    document.getElementById("chat-input-file").value = "";
    if (arr.length === 0) {
      setSelectedFiles(null);
      setIsFilePicked(false);

      return;
    }
    // console.log(arr.length);
    setIsFilePicked(true);
    setSelectedFiles(arr);
    console.log(selectedFiles);
    scrollToBottomDivRef.current?.scrollIntoView();
  };

  const handleFileClickedRemoval = (id) => () => {
    let arr = selectedFiles;
    arr = arr.filter((file) => {
      return file.id !== id;
    });
    if (arr.length === 0) {
      setIsFilePicked(false);
      setSelectedFiles(null);
      document.getElementById("chat-input-file").value = "";
      return;
    }
    setSelectedFiles(arr);
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (message.length > 0) {
      handleSendMessage(message);
      setMessage("");
    }
    if (isFilePicked) {
      setIsFilePicked(false);
      setSelectedFiles(null);
    }
  };

  const handleSendMessage = async (message) => {
    const dataToPost = {
      from: user._id,
      to: gigDetail.user._id,
      message,
    };
    const url = "/add/message";
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(url, dataToPost, config);
    // console.log(data);
    await getAllMessagesBetweenTwoUser();
    handleSendMessageSocket(message);
  };

  const handleSendMessageSocket = async (message) => {
    const messageData = {
      room: "12345",
      author: user.name,
      message: message,
    };

    await socket.emit("send_message", messageData);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      alert(data.message);
    });
  }, [socket]);

  const getAllMessagesBetweenTwoUser = async () => {
    const postData = {
      from: user._id,
      to: gigDetail.user._id,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/get/all/messages/between/two/users",
      postData,
      config
    );
    const messages = data.messages;
    setAllMessages(messages);
    scrollToBottomDivRef.current?.scrollIntoView();
  };

  const getAllMessagesForSingleUser = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.get(
      "/get/all/messages/for/current/user",
      config
    );
    console.log(data);
  };

  const handleChatSuggestion = (e) => {
    // console.log(message.length);
    const suggestion = e.target.textContent;
    e.target.style.display = "none";
    let newMsg = message.length !== 0 ? message + "\n" : message;
    newMsg += suggestion.substr(0, suggestion.length - 3) + " ";
    chatTextAreaRef.current.focus();
    setMessage(newMsg);
  };

  const checkUserOpenItsOwnGig = () => {
    if (user && gigDetail) {
      if (user._id === gigDetail.user._id) {
        return true;
      }
      return false;
    }
    return false;
  };

  useEffect(() => {
    checkUserOpenItsOwnGig();
  }, [user]);

  // console.log(selectedFiles);
  // console.log(allMessages);

  const handleEmojiClick = (emoji) => {
    setShowEmojiPicker(false);
    setMessage(message + emoji.native);
  };

  return (
    <div
      className="chat-background"
      style={{ display: showChatBox ? "block" : "none" }}
    >
      <div className="chat-content">
        <header>
          <img src={gigDetail.user.avatar.url}></img>
          <div>
            <div className="chat-seller-name">
              Message {gigDetail.user.name}
            </div>
            <div className="chat-seller-online-status">Away</div>
          </div>
          <span onClick={() => setShowChatBox(false)}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        </header>
        <main>
          {!allMessages || checkUserOpenItsOwnGig() ? (
            <div className="chat-suggestion-div">
              <ul>
                <li
                  ref={suggestionRef1}
                  onClick={(e) => handleChatSuggestion(e)}
                >
                  &#128075; Hey! {gigDetail.user.name}, can you help me with...
                </li>
                <li
                  ref={suggestionRef2}
                  onClick={(e) => handleChatSuggestion(e)}
                >
                  Do you have any experience with...
                </li>
                <li
                  ref={suggestionRef3}
                  onClick={(e) => handleChatSuggestion(e)}
                >
                  Do you think you can deliver your order by...
                </li>
              </ul>
            </div>
          ) : (
            <div className="chat-show-div">
              <ul id="chat-list-id" className="chat-box">
                {allMessages &&
                  allMessages.map((message) => (
                    <li key={message._id}>
                      {message.sender.avatar.url ? (
                        <img src={message.sender.avatar.url}></img>
                      ) : (
                        <i
                          className={
                            "fa-solid fa-" +
                            message.sender.name[0].toLowerCase()
                          }
                        ></i>
                      )}
                      <div>
                        <div className="chat-message-owner-time-div">
                          <span className="chat-message-owner">
                            {message.sender._id === user._id
                              ? "Me"
                              : message.sender.name}
                          </span>
                          &nbsp;
                          <span className="chat-message-time">
                            <Moment format="D MMM,  H:mm">
                              {message.updatedAt}
                            </Moment>
                          </span>
                        </div>
                        <div className="chat-message-text">
                          {message.message.text}
                        </div>
                      </div>
                    </li>
                  ))}
                <div ref={scrollToBottomDivRef}></div>
              </ul>
            </div>
          )}
          <form id="chat-form" onSubmit={(e) => sendChat(e)}>
            {selectedFiles && isFilePicked && (
              <div className="chat-attached-files-div">
                <div className="chat-attached-files-heading">
                  ATTACHED FILES ({selectedFiles.length})
                </div>
                <ul>
                  {selectedFiles &&
                    selectedFiles.length > 0 &&
                    selectedFiles.map((file, index) => (
                      <li key={index}>
                        <div>{file.selectedFile.name}</div>
                        <button
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
              ref={chatTextAreaRef}
              rows={1}
              onFocus={(e) =>
                (e.target.parentElement.style.borderColor = "#222831")
              }
              maxLength={2500}
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder="Type your message here..."
              spellCheck={false}
              onBlur={(e) =>
                (e.target.parentElement.style.borderColor = "#a6a5a5")
              }
            />
          </form>
        </main>
        <footer>
          <div>
            <div className="chat-emoji contact-seller-emoji-picker">
              <div onClick={handleEmojiPickerHideOrShow}>
                <i className="fa-regular fa-face-smile"></i>
              </div>
              {showEmojiPicker && (
                <Picker
                  onClickOutside={() => setShowEmojiPicker(false)}
                  onEmojiSelect={handleEmojiClick}
                  perLine={8}
                  skinTonePosition="none"
                  previewPosition="none"
                  maxFrequentRows={2}
                />
              )}
            </div>
            <div className="chat-attachment">
              <label htmlFor="chat-input-file">
                <i className="fa-solid fa-paperclip"></i>
              </label>
              <input
                onChange={handleSelectionOfFiles}
                id="chat-input-file"
                multiple={true}
                type="file"
                hidden={true}
              ></input>
            </div>
          </div>
          <button
            type="submit"
            form="chat-form"
            style={{
              opacity: message.length > 0 || isFilePicked ? "1" : "0.4",
            }}
          >
            <i className="fa-regular fa-paper-plane"></i>
            &nbsp; Send Message
          </button>
        </footer>
      </div>
    </div>
  );
};
