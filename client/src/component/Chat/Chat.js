import React, { useEffect, useState, useRef, useContext } from "react";
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
import { SocketContext } from "../../context/socket/socket";
import { DataSendingLoading } from "../DataSendingLoading/DataSendingLoading";
import { uploadToCloudinaryV2 } from "../../utility/cloudinary";
import { LazyImage } from "../LazyImage/LazyImage";
import { LazyVideo } from "../LazyVideo.js/LazyVideo";
import { windowContext } from "../../App";
import { HiDownload } from "react-icons/hi";
import { getFileSize } from "../../utility/util";
import { IoDocumentOutline } from "react-icons/io5";
import { downloadFile } from "../../utility/util";

export const Chat = ({ gigDetail, showChatBox, setShowChatBox }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const socket = useContext(SocketContext);
  const { windowWidth, windowHeight } = useContext(windowContext);

  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  new Picker({ data });
  // All States
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [allMessages, setAllMessages] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [online, setOnline] = useState(false);
  const [typing, setTyping] = useState(false);

  // All References
  const chatTextAreaRef = useRef(null);
  const suggestionRef1 = useRef(null);
  const suggestionRef2 = useRef(null);
  const suggestionRef3 = useRef(null);
  const scrollToBottomDivRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      socket.emit("new_user", user._id.toString());
      socket.emit("is_online", gigDetail.user._id.toString());
      console.log("new user emitted");
    }
  }, [user]);

  useEffect(() => {
    user && getAllMessagesBetweenTwoUser();
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

  // MESSAGE SCROLL DOWN TO BOTTOM EFFECT
  useEffect(() => {
    scrollToBottomDivRef.current?.scrollIntoView();
    const timeout = setTimeout(() => {
      scrollToBottomDivRef.current?.scrollIntoView();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [allMessages?.length]);

  // LAZY LOADING THE IMAGES AND VIDEOS
  useEffect(() => {
    const images = document.querySelectorAll("img[data-src]");
    const videoImages = document.querySelectorAll("video[data-poster]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target.attributes.getNamedItem("poster")) {
            entry.target.attributes.getNamedItem("poster").value =
              entry.target.attributes.getNamedItem("data-poster").value;
          } else {
            entry.target.attributes.getNamedItem("src").value =
              entry.target.attributes.getNamedItem("data-src").value;
          }
          observer.unobserve(entry.target);
        });
      },
      {
        root: document.getElementById("inbox-message-ul-id"),
        rootMargin: "300px",
      }
    );

    images.forEach((image) => {
      observer.observe(image);
    });

    videoImages.forEach((image) => {
      observer.observe(image);
    });
  }, [fileLoading, allMessages]);

  // CHECKING FOR ONLINE STATUS OF GIG SELLER
  useEffect(() => {
    socket.on("is_online_from_server", (data) => {
      const onlineClientId = data.id.toString();

      if (onlineClientId === gigDetail.user._id.toString()) {
        setOnline(data.online);
      }
    });

    return () => {
      socket.off("is_online_from_server");
      // setCurrentSelectedClientOnline(false);
    };
  }, [socket, online]);

  useEffect(() => {
    socket.on("online_from_server", async (userId) => {
      if (userId === gigDetail.user._id.toString()) {
        setOnline(true);
      }
    });
    socket.on("offline_from_server", async (userId) => {
      if (userId === gigDetail.user._id.toString()) {
        setOnline(false);
      }
    });
    return () => {
      socket.off("online_from_server");
      socket.off("offline_from_server");
    };
  }, [socket]);

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

  const sendChat = async (e) => {
    e.preventDefault();
    setFileLoading(true);

    let files = [];
    try {
      // upload files to cloudinary
      files = await sendFileClientCloudinary(selectedFiles);
      console.log(files);

      // add message to database
      const res = await addMessageToDatabase(message, files);
      console.log(res);

      // send message to socket
      await handleSendMessageSocket(message, files);
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
        to: gigDetail.user._id,
        files,
      };

      const { data } = await axios.post("/add/message", messageData);
      // console.log(data);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setMessage("");
    }
  };

  const handleSendMessageSocket = async (message, files) => {
    const sender = {
      avatar: user.avatar,
      name: user.name,
      _id: user._id,
    };
    const receiver = {
      avatar: gigDetail.user.avatar,
      name: gigDetail.user.name,
      _id: gigDetail.user._id,
    };

    if (receiver._id !== gigDetail.user._id) return;

    const messageData = {
      message: {
        text: message,
      },
      sender,
      receiver,
      createdAt: new Date().getTime(),
      files,
    };
    const clientId = gigDetail.user._id.toString();
    await socket.emit("send_message", messageData);
  };

  // CHECKING FOR RECEIVING MESSAGES
  useEffect(() => {
    socket.on("receive_message", async (data) => {
      console.log("receive message is running");
      const messageData = data;
      setAllMessages((prev) => [...prev, messageData]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket, allMessages, fileLoading]);

  // CHECKING FOR RECEIVING MESSAGES SELF
  useEffect(() => {
    socket.on("receive_message_self", async (data) => {
      console.log("receive message is running");
      const messageData = data;
      setAllMessages((prev) => [...prev, messageData]);
    });

    return () => {
      socket.off("receive_message_self");
    };
  }, [socket, allMessages, fileLoading]);

  // SHOW TYPING STATUS
  useEffect(() => {
    const data = {
      senderId: isAuthenticated ? user._id.toString() : null,
      receiverId: gigDetail.user._id.toString(),
    };
    socket.emit("typing_started", data);
    const timeout = setTimeout(() => {
      // console.log("typing_stopped");
      socket.emit("typing_stopped", data);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [message]);

  useEffect(() => {
    socket.on("typing_started_from_server", (data) => {
      if (gigDetail.user._id.toString() === data.senderId.toString()) {
        setTyping(true);
      }
    });
    socket.on("typing_stopped_from_server", (data) => {
      setTyping(false);
    });

    return () => {
      socket.off("typing_started_from_server");
      socket.off("typing_stopped_from_server");
    };
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

  useEffect(() => {
    if(allMessages?.length === 0 && message?.length === 0){
      suggestionRef1.current.style.display = "";
      suggestionRef2.current.style.display = "";
      suggestionRef3.current.style.display = "";
    }
  },[message]);

  // console.log(selectedFiles);
  // console.log(allMessages);

  const handleEmojiClick = (emoji) => {
    setShowEmojiPicker(false);
    setMessage(message + emoji.native);
  };

  console.log(allMessages);

  return (
    <div
      className="chat-background"
      style={{ display: showChatBox ? "block" : "none" }}
    >
      <div className="chat-content">
        <DataSendingLoading
          show={fileLoading}
          finishedLoading={!fileLoading}
          loadingText={"Sending message..."}
        />
        <header>
          <img src={gigDetail.user.avatar.url}></img>
          <div>
            <div className="chat-seller-name">
              Message {gigDetail.user.name}
            </div>
            <div
              className="chat-seller-online-status"
              style={{ color: online ? "#1dbf73" : "" }}
            >
              {typing ? "typing..." : online ? "online" : "away"}
            </div>
          </div>
          <span onClick={() => setShowChatBox(false)}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        </header>
        <main>
          {!allMessages?.length || checkUserOpenItsOwnGig() ? (
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
                        <div className="chat-messages-list-sender-files">
                          {message.files?.map((file, index) => (
                            <div
                              key={index}
                              className="chat-messages-list-sender-file"
                            >
                              <p>
                                {file.type.includes("video") ? (
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener"
                                  >
                                    <LazyVideo
                                      file={file}
                                      maxWidth={windowWidth > 1024 ? 240 : 160}
                                    />
                                  </a>
                                ) : file.type.includes("image") ? (
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener"
                                  >
                                    <LazyImage
                                      file={file}
                                      maxWidth={windowWidth > 1024 ? 240 : 160}
                                    />
                                  </a>
                                ) : file.type.includes("audio") ? (
                                  <audio
                                    className="chat-messages-list-sender-file-audio"
                                    preload="none"
                                    controls
                                    src={file.url}
                                  />
                                ) : (
                                  <div className="chat-messages-list-sender-file-document">
                                    <div>
                                      <IoDocumentOutline />
                                    </div>
                                  </div>
                                )}
                              </p>
                              <div
                                onClick={() =>
                                  downloadFile(file.url, file.name)
                                }
                                className="chat-messages-list-sender-file-info"
                              >
                                <div
                                  data-tooltip-id="my-tooltip"
                                  data-tooltip-content={file.name}
                                  data-tooltip-place="bottom"
                                >
                                  <HiDownload />
                                  <div className="chat-messages-list-sender-file-name">
                                    {file.name}
                                  </div>
                                </div>
                                <p>
                                  ({getFileSize(file.size ? file.size : 0)})
                                </p>
                              </div>
                            </div>
                          ))}
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
