import React, {
  useState,
  useRef,
  useReducer,
  Component,
  useContext,
} from "react";
import { io, Socket } from "socket.io-client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate, Link } from "react-router-dom";
import axios from "axios";
import Moment from "react-moment";
import moment from "moment";
import "moment-timezone";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { ToastContainer, toast } from "react-toastify";
import "./inbox.css";
// import '../Chat/chat.css'
import PermMediaIcon from "@mui/icons-material/PermMedia";

import { inboxReducer } from "./inboxReducer";
import { INBOX_DETAILS_INITIAL_STATE } from "./inboxReducer";
import {
  FETCH_ALL_CLIENTS_DETAILS,
  FETCH_ALL_CLIENTS_LAST_MESSAGE,
  FETCH_ALL_CLIENTS_LIST,
  UPDATE_ALL_CLIENTS_LIST,
  UPDATE_CLIENT_DETAILS,
  UPDATE_CLIENT_LAST_MESSAGE,
  FETCH_ALL_CHATS_WITH_CLIENT,
  UPDATE_ALL_CHATS_WITH_CLIENT,
  FETCH_ONLINE_STATUS_OF_CLIENTS,
  UPDATE_ONLINE_STATUS_OF_CLIENTS,
} from "./inboxConstant";
import { Loader } from "../Loader/Loader";
import { windowContext } from "../../App";

import { SocketContext } from "../../context/socket/socket";
import { uploadToCloudinaryV2 } from "../../utility/cloudinary";
import { HiDownload } from "react-icons/hi";
import { downloadFile, getFileSize } from "../../utility/util";

import { LazyImage } from "../LazyImage/LazyImage";
import { LazyVideo } from "../LazyVideo.js/LazyVideo";
import { BsEmojiSmile } from "react-icons/bs";
import { DataSendingLoading } from "../DataSendingLoading/DataSendingLoading";
import { Avatar } from "../Avatar/Avatar";
import Cookies from "js-cookie";
import { IoDocumentOutline } from "react-icons/io5";

export const Inbox = () => {
  const { windowWidth, windowHeight } = useContext(windowContext);

  const token = Cookies.get("token");

  const socket = useContext(SocketContext);
  // console.log(socket);

  const navigate = useNavigate();

  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.user
  );

  const [inboxDetails, dispatch] = useReducer(
    inboxReducer,
    INBOX_DETAILS_INITIAL_STATE
  );

  const {
    listOfAllClients,
    inboxMessages,
    allClientUserLastMessage,
    allClientsDetails,
    onlineStatusOfClients,
  } = inboxDetails;

  const [inboxMessagesLoading, setInboxMessagesLoading] = useState(false);

  new Picker({ data });

  const [typing, setTyping] = useState(false);

  const [hideMessageListOnSmallDevices, setHideMessageListOnSmallDevices] =
    useState(true);
  const [showMessageListOnDevices, setShowMessageListOnDevices] =
    useState(true);

  const [currentSelectedClient, setCurrentSelectedClient] = useState(null);
  const [currentSelectedClientOnline, setCurrentSelectedClientOnline] =
    useState(false);

  const [message, setMessage] = useState("");
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);

  const scrollToBottomDivRefInbox = useRef(null);
  const chatTextAreaRef = useRef(null);

  const inboxChatFormRef = useRef(null);
  const inboxFilesFormRef = useRef(null);

  const [room, setRoom] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerOpenerIconRef = useRef(null);

  const [fileLoading, setFileLoading] = useState(false);

  const [uploadPercentage, setUploadPercentage] = useState(null);

  const handleEmojiClick = (emoji) => {
    setShowEmojiPicker(false);
    setMessage(message + emoji.native);
  };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     socket.emit("online", user._id.toString());
  //     const interval = setInterval(() => {
  //       console.log("online");
  //       socket.emit("online", user._id.toString());
  //     }, [100000]);
  //     return () => {
  //       clearInterval(interval);
  //     };
  //   }
  // }, []);

  // GET LOGGED IN USER AND FETCH LIST OF ALL CLIENTS IF LOGGED IN
  useEffect(() => {
    if (isAuthenticated) {
      socket.emit("new_user", user._id.toString());
      getListOfAllInboxClients().then((res) => {
        dispatch({ type: FETCH_ALL_CLIENTS_LIST, payload: res });
      });
    } else {
      navigate("/login");
    }
  }, [user]);

  const getListOfAllInboxClients = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.get(
      "/list/of/all/inbox/clients/for/current/user",
      config
    );
    return data.list;
  };

  const handleAllClientDetails = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const temp1 = [];
    // const temp2 = [];
    for (let i = 0; i < listOfAllClients.length; i++) {
      const userId = listOfAllClients[i].toString();

      const { data } = await axios.get(`/user/${userId}`, config);
      temp1.push(data);
      // temp2.push(false);
    }
    // console.log(temp2);
    // dispatch({ type: FETCH_ONLINE_STATUS_OF_CLIENTS, payload: temp2 });
    return temp1;
  };

  const handleAllClientUserLastMessage = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const temp2 = [];
    for (let i = 0; i < listOfAllClients.length; i++) {
      const userId = listOfAllClients[i].toString();

      const { data } = await axios.post(
        `/get/last/message/between/two/user`,
        {
          from: userId,
          to: user._id,
        },
        config
      );
      temp2.push(data);
    }
    return temp2;
  };

  // GET CLIENT DETAILS ALONG WITH LAST CHAT
  useEffect(() => {
    const tempFunc = async () => {
      await handleAllClientDetails().then((res) => {
        // console.log(res);
        dispatch({ type: FETCH_ALL_CLIENTS_DETAILS, payload: res });
        // console.log(inboxDetails);
      });

      await handleAllClientUserLastMessage().then((res) => {
        // console.log(res);
        dispatch({ type: FETCH_ALL_CLIENTS_LAST_MESSAGE, payload: res });
      });
    };
    // console.log("list of all clients useEffect is running")
    if (listOfAllClients !== null) {
      tempFunc();
    }
  }, [listOfAllClients]);

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
  }, [fileLoading, inboxMessages]);

  const getAllMessagesBetweenTwoUser = async (clientId) => {
    const postData = {
      from: user._id,
      to: clientId,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    setInboxMessagesLoading(true);
    const { data } = await axios.post(
      "/get/all/messages/between/two/users",
      postData,
      config
    );
    const messages = data.messages;
    dispatch({ type: FETCH_ALL_CHATS_WITH_CLIENT, payload: messages });
    setInboxMessagesLoading(false);
    scrollToBottomDivRefInbox.current?.scrollIntoView();
  };

  const handleEmojiPickerHideOrShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
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
      console.log(files);
      // return;
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

  // console.log(inboxMessages);

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
        to: currentSelectedClient._id,
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
      avatar: currentSelectedClient.avatar,
      name: currentSelectedClient.name,
      _id: currentSelectedClient._id,
    };

    if (receiver._id !== currentSelectedClient._id) return;

    const messageData = {
      message: {
        text: message,
      },
      sender,
      receiver,
      createdAt: new Date().getTime(),
      // messageType: "text",
      files,
    };

    const clientId = currentSelectedClient._id.toString();

    const index = listOfAllClients.findIndex((id) => {
      return id === clientId;
    });

    // let temp = [];
    // temp = inboxDetails.allClientUserLastMessage.map((mesgs, i) => {
    //   if (i == index) {
    //     // console.log({ ...mesgs, messages: [messageData] });
    //     return { ...mesgs, messages: [messageData] };
    //   }
    //   return mesgs;
    // });
    // console.log(temp);
    // dispatch({ type: UPDATE_CLIENT_LAST_MESSAGE, payload: temp });

    // let temp2 = inboxDetails.inboxMessages;
    // console.log(temp2);
    // temp2.push(messageData);
    // dispatch({ type: UPDATE_ALL_CHATS_WITH_CLIENT, payload: temp2 });

    await socket.emit("send_message", messageData);
    // console.log(allClientUserLastMessage);
  };

  // MESSAGE SCROLL DOWN TO BOTTOM EFFECT
  useEffect(() => {
    scrollToBottomDivRefInbox.current?.scrollIntoView();
    const timeout = setTimeout(() => {
      scrollToBottomDivRefInbox.current?.scrollIntoView();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [inboxMessages?.length, fileLoading]);

  // SHOW TYPING STATUS
  useEffect(() => {
    const data = {
      // senderId: user?._id.toString(),
      senderId: isAuthenticated ? user._id.toString() : null,
      receiverId: currentSelectedClient?._id.toString(),
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
      if (
        currentSelectedClient &&
        currentSelectedClient._id.toString() === data.senderId.toString()
      ) {
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
  }, [socket, currentSelectedClient]);

  // SHOW ONLINE STATUS OF ALL CLIENTS + CURRENTLY SELECTED CLIENT
  useEffect(() => {
    if (isAuthenticated) {
      socket.emit("online", user._id.toString());
    }
  }, [user]);

  useEffect(() => {
    socket.emit("get_online_status_of_all_clients", listOfAllClients || []);
  }, [listOfAllClients]);

  useEffect(() => {
    socket.on("online_status_of_all_clients_from_server", (data) => {
      const temp = listOfAllClients?.map((id) => {
        const index = data.findIndex((d) => {
          return d.id.toString() === id.toString();
        });
        return data[index].online;
      });
      // console.log("online client list srever", temp);
      dispatch({ type: UPDATE_ONLINE_STATUS_OF_CLIENTS, payload: temp });
    });

    return () => {
      socket.off("online_status_of_all_clients_from_server");
    };
  }, [socket, listOfAllClients]);

  // console.log(onlineStatusOfClients);

  useEffect(() => {
    socket.on("online_from_server", async (userId) => {
      // console.log("online from server with " + userId.toString());
      const index = listOfAllClients?.findIndex((id) => {
        return id === userId;
      });
      // console.log(index);
      if (index !== -1) {
        // await handleAllClientDetails();
        let temp = onlineStatusOfClients?.map((status, idx) => {
          if (idx === index) {
            return true;
          }
          return status;
        });
        // console.log(temp);
        if (
          currentSelectedClient &&
          currentSelectedClient._id.toString() === userId
        ) {
          setCurrentSelectedClientOnline(true);
        }
        dispatch({ type: UPDATE_ONLINE_STATUS_OF_CLIENTS, payload: temp });
      }
    });

    // console.log(onlineStatusOfClients);

    socket.on("offline_from_server", async (userId) => {
      console.log("offline from server with " + userId.toString());
      const index = listOfAllClients?.findIndex((id) => {
        return id === userId;
      });

      console.log(index);
      if (index !== -1) {
        // await handleAllClientDetails();
        let temp = onlineStatusOfClients?.map((status, idx) => {
          if (idx === index) {
            return false;
          }
          return status;
        });
        console.log(temp);
        if (
          currentSelectedClient &&
          currentSelectedClient._id.toString() === userId.toString()
        ) {
          setCurrentSelectedClientOnline(false);
          setCurrentSelectedClient((prev) => {
            // console.log("hey i have update the last seen");
            if (prev) return { ...prev, lastSeen: Date.now() };
          });
        }
        dispatch({ type: UPDATE_ONLINE_STATUS_OF_CLIENTS, payload: temp });
      }
    });
    return () => {
      socket.off("online_from_server");
      socket.off("offline_from_server");
    };
  }, [
    socket,
    onlineStatusOfClients,
    currentSelectedClient,
    currentSelectedClientOnline,
  ]);

  useEffect(() => {
    if (currentSelectedClient) {
      socket.emit("is_online", currentSelectedClient._id.toString());
      socket.emit("online", isAuthenticated ? user._id.toString() : null);
      // console.log("is online emit from client")
    }
  }, [currentSelectedClient]);

  useEffect(() => {
    socket.on("is_online_from_server", (data) => {
      const onlineClientId = data.id.toString();
      if (onlineClientId === currentSelectedClient._id.toString()) {
        // console.log("is online received " + data.online);
        setCurrentSelectedClientOnline(data.online);
        // console.log(listOfAllClients);
      }
      const temp = listOfAllClients?.map((id, idx) => {
        if (id === onlineClientId) {
          return data.online;
        }
        return onlineStatusOfClients[idx];
      });
      // console.log("is online from server", temp, data.online);
      dispatch({ type: UPDATE_ONLINE_STATUS_OF_CLIENTS, payload: temp });
    });

    return () => {
      socket.off("is_online_from_server");
      // setCurrentSelectedClientOnline(false);
    };
  }, [currentSelectedClient, socket, currentSelectedClientOnline]);

  // CHECKING FOR RECEIVING MESSAGES
  useEffect(() => {
    socket.on("receive_message", async (data) => {
      console.log("receive message is running");
      const messageData = data;
      const { message, sender, receiver } = data;
      const senderId = sender._id.toString();
      const clientId = senderId;

      // console.log(user);
      // console.log(inboxDetails);

      const clientIndex = listOfAllClients?.findIndex((id) => {
        return id === clientId;
      });

      let temp = [];
      temp = allClientUserLastMessage?.map((mesgs, i) => {
        if (i == clientIndex) {
          // console.log({ ...mesgs, messages: [messageData] });
          return { ...mesgs, messages: [messageData] };
        }
        return mesgs;
      });
      dispatch({ type: UPDATE_CLIENT_LAST_MESSAGE, payload: temp });

      if (currentSelectedClient?._id === senderId) {
        const temp2 = [...inboxMessages, messageData];
        dispatch({ type: UPDATE_ALL_CHATS_WITH_CLIENT, payload: temp2 });
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket, inboxDetails, currentSelectedClientOnline]);

  // CHECKING FOR RECEIVING MESSAGES SELF
  useEffect(() => {
    // console.log("receive message self is running");
    socket.on("receive_message_self", async (data) => {
      // console.log("receive message is running");
      const messageData = data;
      const { message, sender, receiver } = data;
      const receiverId = receiver._id.toString();
      const clientId = receiverId;

      // console.log(user);
      // console.log(inboxDetails);

      const clientIndex = listOfAllClients?.findIndex((id) => {
        return id === clientId;
      });

      let temp = [];
      temp = allClientUserLastMessage?.map((mesgs, i) => {
        if (i == clientIndex) {
          // console.log({ ...mesgs, messages: [messageData] });
          return { ...mesgs, messages: [messageData] };
        }
        return mesgs;
      });
      dispatch({ type: UPDATE_CLIENT_LAST_MESSAGE, payload: temp });

      if (currentSelectedClient?._id === receiverId) {
        const temp2 = [...inboxMessages, messageData];
        dispatch({ type: UPDATE_ALL_CHATS_WITH_CLIENT, payload: temp2 });
      }
    });

    return () => {
      socket.off("receive_message_self");
    };
  }, [socket, inboxDetails, currentSelectedClientOnline]);

  const joinRoom = (senderId, receiverId) => {
    const r = createRoom(senderId, receiverId);
    setRoom(r);
    socket.emit("join_room", r);
  };

  const createRoom = (senderId, receiverId) => {
    if (senderId.toString() > receiverId.toString()) {
      return senderId.toString() + "|" + receiverId.toString();
    } else {
      return receiverId.toString() + "|" + senderId.toString();
    }
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
    document.getElementById("chat-inbox-input-file").value = "";
    if (arr.length === 0) {
      setSelectedFiles(null);
      setIsFilePicked(false);

      return;
    }
    setIsFilePicked(true);
    setSelectedFiles(arr);
    scrollToBottomDivRefInbox.current?.scrollIntoView();
  };

  const handleFileClickedRemoval = (id) => () => {
    let arr = selectedFiles;
    arr = arr.filter((file) => {
      return file.id !== id;
    });
    if (arr.length === 0) {
      setIsFilePicked(false);
      setSelectedFiles(null);
      document.getElementById("chat-inbox-input-file").value = "";
      return;
    }
    setSelectedFiles(arr);
  };

  const handleDateFormat = (date) => {
    const dateFormatString = "";
    const A = moment(date);
    const B = moment.now();
    if (A.diff(B, "years") < 0) {
      return moment(date).format("DD MMM YYYY, HH:mm");
    } else {
      return moment(date).format("DD MMM, HH:mm");
    }
  };

  useEffect(() => {
    if (windowWidth < 600) setShowMessageListOnDevices(false);
    else setShowMessageListOnDevices(true);
  }, [windowContext]);

  const handleClientSelectionClick = async (detail) => {
    setCurrentSelectedClient(detail.user);
    setHideMessageListOnSmallDevices(false);
    if (currentSelectedClient?._id.toString() !== detail.user._id.toString()) {
      setIsFilePicked(false);
      setSelectedFiles(null);
      setShowEmojiPicker(false);
      await getAllMessagesBetweenTwoUser(detail.user._id);
    }
  };

  const getFileName = (file) => {
    const name = file.name;
    const type = file.type.split("/")[1];
    const len = name.length;
    if (len > 25) {
      return (
        name.slice(0, 10) + "..." + name.slice(len - 13, len - 1) + "." + type
      );
    }
    return name;
  };

  // closing emoji picker when clicked outside
  window.onclick = (event) => {
    if (
      event.target !== document.querySelector("em-emoji-picker") &&
      !emojiPickerOpenerIconRef.current.contains(event.target)
    ) {
      setShowEmojiPicker(false);
    }
  };

  return (
    <div className="inbox-main">
      <div
        className="inbox-clients-list"
        style={{
          display:
            windowWidth < 600 && !hideMessageListOnSmallDevices
              ? "none"
              : "block",
        }}
      >
        <div className="inbox-search">
          <input
            type="text"
            spellCheck={false}
            placeholder="Search for a username"
          ></input>
          <i className="fas fa-search"></i>
        </div>
        <ul className="client-list-ul">
          {onlineStatusOfClients &&
            listOfAllClients &&
            allClientsDetails &&
            allClientUserLastMessage &&
            allClientsDetails.map((detail, index) => (
              <li
                onClick={() => handleClientSelectionClick(detail)}
                className="inbox-user-client"
                key={detail.user._id}
              >
                <div className="client-list-client-profile-image">
                  <Avatar
                    userName={detail.user.name}
                    onlineStatus={onlineStatusOfClients[index]}
                    avatarUrl={detail.user.avatar.url}
                    width="2.75rem"
                    onlineStatusWidth="1rem"
                  />
                </div>
                <div className="client-list-detail-plus-last-message">
                  <div className="client-list-client-name">
                    {detail.user.name}
                  </div>
                  <div className="client-list-last-message">
                    {allClientUserLastMessage[index].messages[0].files?.length >
                    0 ? (
                      <PermMediaIcon
                        fontSize="small"
                        style={{ color: "#74767e" }}
                      />
                    ) : (
                      <p>
                        {
                          allClientUserLastMessage[index].messages[0].message
                            .text
                        }
                      </p>
                    )}
                  </div>
                  {/* <div>{onlineStatusOfClients[index] ? "online" : "xxxxxx"}</div> */}
                </div>
                <div className="client-list-last-message-time">
                  <Moment fromNow ago>
                    {allClientUserLastMessage[index].messages[0].createdAt}
                  </Moment>
                </div>
              </li>
            ))}
        </ul>
      </div>
      <div
        style={{
          display:
            windowWidth < 600 && hideMessageListOnSmallDevices
              ? "none"
              : "block",
        }}
        className="current-user-message-list"
      >
        {inboxMessages === null ? (
          <div className="inbox-message-list-default">
            <div className="inbox-message-list-default-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="108"
                height="88"
                viewBox="0 0 108 88"
              >
                <g transform="translate(4 4)">
                  <ellipse
                    fillRule="evenodd"
                    clipRule="evenodd"
                    fill="#FFF"
                    cx="54"
                    cy="32.5"
                    rx="17"
                    ry="17.5"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    fill="#1DBF73"
                    d="M57 23c0-1.2-.8-2-2.1-2H17.1c-1.3 0-2.1.8-2.1 2s.9 2 2.1 2h37.8c1.3 0 2.1-.8 2.1-2m-22 8H17c-1.2 0-2 .8-2 2s.8 2 2 2h18c1.2 0 2-.8 2-2s-1-2-2-2"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    fill="#555"
                    d="M43.7 53.4c-.4 0-1 .2-1.5.4L24.5 69.4V54.8c0-1-.6-1.9-1.7-2.1-10.7-2-18.6-12.2-18.6-24 0-13.5 10-24.5 22.4-24.5h24.9c12.3 0 22.4 11 22.4 24.5s-10 24.5-22.4 24.5l-7.8.2zM51.4 0H26.6C11.9 0 0 12.9 0 28.7 0 42 8.4 53.4 20.3 56.5v17.4c0 .8.4 1.5 1.3 1.9.2.2.6.2.8.2.4 0 1-.2 1.5-.4l20.7-18.1h7.1C66.1 57.5 78 44.6 78 28.7 78 12.9 66.1 0 51.4 0z"
                  />
                  <path
                    fill="none"
                    stroke="#FFF"
                    strokeWidth="4"
                    d="M43.7 51.4l7.8-.2c11.2 0 20.4-10.1 20.4-22.5S62.6 6.2 51.4 6.2H26.6c-11.2 0-20.4 10-20.4 22.5 0 10.9 7.3 20.2 17 22.1 2 .4 3.3 2 3.3 4v10.1l14.7-12.8.2-.1c.7-.4 1.5-.6 2.3-.6h0zm1.6 8.1L25 77.3l-.2.1c-.8.3-1.7.6-2.4.6-.2 0-.5 0-.7-.1-.4-.1-.8-.2-1.2-.5-1.4-.8-2.1-2-2.1-3.5V58C6.3 54.1-2 42.3-2 28.7-2 11.8 10.8-2 26.6-2h24.9C67.2-2 80 11.8 80 28.7c0 17-12.7 30.9-28.3 30.9h-6.4v-.1z"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    fill="#555"
                    d="M83.6 30.2c-1.2 0-2.1.8-2.1 2.1 0 1.2.8 2.1 2.1 2.1 8.3 0 15.2 7.5 15.2 16.8 0 9.1-6.4 16.6-14.7 16.8-1 0-2.1 1-2.1 2.1v6.6l-7.7-8.1c-.4-.4-1-.6-1.5-.6h-6.6c-4.8 0-9.1-2.5-12-6.6-.6-1-1.9-1.2-2.9-.6s-1.2 1.9-.6 2.9c3.5 5.4 9.6 8.5 15.6 8.5H72l10.8 11.2c.4.4 1 .6 1.5.6.2 0 .6 0 .8-.2.8-.4 1.2-1 1.2-1.9V72c9.6-1.5 16.8-10.2 16.8-20.8.1-11.4-8.7-21-19.5-21"
                  />
                </g>
              </svg>
              <div className="inbox-message-list-default-message-title">
                Select a Conversation
              </div>
              <p className="inbox-message-list-default-message-body">
                Try selecting a conversation or searching for someone specific.
              </p>
            </div>
          </div>
        ) : (
          <div className="inbox-message-list">
            {inboxMessagesLoading ? (
              <Loader />
            ) : (
              <>
                <div className="inbox-message-list-section-1">
                  <header>
                    <div
                      style={{
                        display: windowWidth < 600 ? "block" : "none",
                      }}
                      className="inbox-message-list-header-icon"
                      onClick={() => setHideMessageListOnSmallDevices(true)}
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </div>
                    <h2>
                      <div className="inbox-client-name">
                        <span
                          className="currently-selected-client-online-status"
                          style={{
                            backgroundColor: currentSelectedClientOnline
                              ? "#1dbf73"
                              : "#a6a5a5",
                          }}
                        ></span>
                        <Link to={`/user/${currentSelectedClient._id}`}>
                          {currentSelectedClient.name}
                        </Link>
                      </div>
                      <div className="client-status">
                        {typing && (
                          <div className="client-typing-status">
                            {"typing..."}
                          </div>
                        )}
                        {!typing && currentSelectedClientOnline && (
                          <div className="client-online-status">online</div>
                        )}
                        {!typing && !currentSelectedClientOnline && (
                          <div className="client-last-seen-status">
                            Last seen:{" "}
                            <Moment fromNow>
                              {currentSelectedClient.lastSeen}
                            </Moment>
                          </div>
                        )}
                      </div>
                    </h2>
                    <div className="inbox-message-list-header-icon">
                      <i className="fa-solid fa-ellipsis"></i>
                    </div>
                  </header>
                </div>
                <DataSendingLoading
                  show={fileLoading}
                  finishedLoading={!fileLoading}
                  loadingText={"Sending message..."}
                />
                <div className="inbox-message-list-section-2">
                  <ul id="inbox-message-ul-id">
                    {inboxMessages.map((item, index) => (
                      <li
                        className="inbox-message-list-info"
                        key={index + item.message}
                      >
                        {item.sender.avatar.url ? (
                          <img
                            className="inbox-message-list-user-profile-image"
                            src={item.sender.avatar.url}
                          ></img>
                        ) : (
                          <div>
                            <i
                              className={
                                "fa-solid fa-" +
                                item.sender.name[0].toLowerCase()
                              }
                            ></i>
                          </div>
                        )}
                        <div className="inbox-messages-list-sender-info">
                          <div className="inbox-messages-list-sender-details">
                            <div className="inbox-messages-list-sender-name">
                              {item.sender.name === user.name
                                ? "Me"
                                : item.sender.name}
                            </div>
                            <p className="inbox-messages-list-sender-date">
                              <Moment format="DD MMM YYYY, HH:mm">
                                {item.createdAt}
                              </Moment>
                            </p>
                          </div>
                          <p className="inbox-messages-list-sender-text">
                            {item.message.text}
                          </p>
                          <div className="inbox-messages-list-sender-files">
                            {item.files?.map((file, index) => (
                              <div
                                key={index}
                                className="inbox-messages-list-sender-file"
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
                                        maxWidth={
                                          windowWidth > 1024 ? 240 : 160
                                        }
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
                                        maxWidth={
                                          windowWidth > 1024 ? 240 : 160
                                        }
                                      />
                                    </a>
                                  ) : file.type.includes("audio") ? (
                                    <audio
                                      className="inbox-messages-list-sender-file-audio"
                                      preload="none"
                                      controls
                                      src={file.url}
                                    />
                                  ) : (
                                    <div className="inbox-messages-list-sender-file-document">
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
                                  className="inbox-messages-list-sender-file-info"
                                >
                                  <div
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content={file.name}
                                    data-tooltip-place="bottom"
                                  >
                                    <HiDownload />
                                    <div className="inbox-messages-list-sender-file-name">
                                      {file.name}
                                    </div>
                                  </div>
                                  <p className="inbox-messages-list-sender-file-size">
                                    ({getFileSize(file.size ? file.size : 0)})
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </li>
                    ))}
                    {fileLoading && (
                      <div className="inbox-message-list-info">
                        {user.avatar.url ? (
                          <img
                            className="inbox-message-list-user-profile-image"
                            src={user.avatar.url}
                          ></img>
                        ) : (
                          <div className="inbox-lazy-loading-user-icon">
                            <i
                              className={
                                "fa-solid fa-" + user.name[0].toLowerCase()
                              }
                            ></i>
                          </div>
                        )}
                        <div className="inbox-messages-list-sender-info">
                          <div className="inbox-messages-list-sender-details">
                            <div className="inbox-messages-list-sender-name">
                              Me
                            </div>
                            <p className="inbox-messages-list-sender-date">
                              <Moment format="DD MMM YYYY, HH:mm">
                                {Date.now()}
                              </Moment>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={scrollToBottomDivRefInbox}></div>
                  </ul>
                  <form
                    ref={inboxChatFormRef}
                    id="inbox-chat-form"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    {isFilePicked && (
                      <div className="inbox-attached-files-div">
                        <div className="inbox-attached-files-heading">
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
                </div>
                <div className="inbox-message-list-section-3">
                  <footer>
                    <div>
                      <div
                        ref={emojiPickerOpenerIconRef}
                        onClick={handleEmojiPickerHideOrShow}
                        className="inbox-emoji inbox-emoji-picker"
                      >
                        <div>
                          <BsEmojiSmile />
                        </div>
                      </div>
                      <div className="inbox-emoji-picker-wrapper">
                        {showEmojiPicker && (
                          <Picker
                            onEmojiSelect={handleEmojiClick}
                            perLine={windowWidth > 768 ? 8 : 7}
                            skinTonePosition="none"
                            previewPosition="none"
                            maxFrequentRows={2}
                          />
                        )}
                      </div>
                      <div
                        className="inbox-attachment"
                        data-tooltip-content="Max 5GB"
                        data-tooltip-place="top"
                        data-tooltip-id="my-tooltip"
                      >
                        <label htmlFor="chat-inbox-input-file">
                          <i className="fa-solid fa-paperclip"></i>
                        </label>
                        <input
                          onChange={handleSelectionOfFiles}
                          id="chat-inbox-input-file"
                          multiple={true}
                          type="file"
                          // accept="image/*,video/*"
                          hidden={true}
                        ></input>
                      </div>
                    </div>
                    <button
                      disabled={message.length <= 0 && !isFilePicked}
                      onClick={handleSubmissionOfInboxForms}
                      style={{
                        opacity:
                          message.length > 0 || isFilePicked ? "1" : "0.4",
                      }}
                    >
                      <i className="fa-regular fa-paper-plane"></i>
                      &nbsp; Send Message
                    </button>
                  </footer>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
