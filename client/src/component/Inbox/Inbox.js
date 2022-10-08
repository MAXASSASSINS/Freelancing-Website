import React, { useState, useRef, useReducer, Component } from 'react'
import { io, Socket } from 'socket.io-client'
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { ToastContainer, toast } from 'react-toastify';
import './inbox.css'
import '../Chat/chat.css'
import { CurrentlySelectedClientChat } from '../CurrentlySelectedClientChat/CurrentlySelectedClientChat';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { solid, regular, brands } from '@fontawesome/fontawesome-svg-core/import.macro'


import { inboxReducer } from './inboxReducer';
import { INBOX_DETAILS_INITIAL_STATE } from './inboxReducer';
import { FETCH_ALL_CLIENTS_DETAILS, FETCH_ALL_CLIENTS_LAST_MESSAGE, FETCH_ALL_CLIENTS_LIST, UPDATE_ALL_CLIENTS_LIST, UPDATE_CLIENT_DETAILS, UPDATE_CLIENT_LAST_MESSAGE, FETCH_ALL_CHATS_WITH_CLIENT, UPDATE_ALL_CHATS_WITH_CLIENT } from "./inboxConstant";


const socket = io.connect("http://localhost:4000");
export const Inbox = () => {


  const navigate = useNavigate();

  const { user } = useSelector(state => state.loggedUser);


  const [inboxDetails, dispatch] = useReducer(inboxReducer, INBOX_DETAILS_INITIAL_STATE);

  const { listOfAllClients, inboxMessages, allClientUserLastMessage, allClientsDetails } = inboxDetails;

  new Picker({ data });


  const [hideMessageListOnSmallDevices, setHideMessageListOnSmallDevices] = useState(true);
  const [showMessageListOnDevices, setShowMessageListOnDevices] = useState(true);

  const [currentSelectedClient, setCurrentSelectedClient] = useState(null);

  const [message, setMessage] = useState("");
  const [isFilePicked, setIsFilePicked] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState(null);

  const scrollToBottomDivRefInbox = useRef(null);
  const chatTextAreaRef = useRef(null);

  const [room, setRoom] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);


  const handleEmojiClick = (emoji) => {
    setShowEmojiPicker(false);
    setMessage(message + emoji.native);
  }




  // Get logged in user or redirect to login
  // useEffect(() => {
  //   // console.log("no user useEffect is running")
  //   if (!user) {
  //     navigate('/login');
  //   }
  // }, [])


  // Get list of all inbox clients
  useEffect(() => {
    // console.log(user)
    if (user) {
      // console.log("USER useffect is running");
      socket.emit("new_user", user._id.toString());
      getListOfAllInboxClients().then(res => {
        // console.log(res);
        dispatch({ type: FETCH_ALL_CLIENTS_LIST, payload: res });
      });
    }
    else {
      // console.log("NO USER useffect is running");
      navigate('/login')
    }

  }, [user])



  const getListOfAllInboxClients = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
    }
    const { data } = await axios.get('/list/of/all/inbox/clients/for/current/user', config);
    return data.list;
  }


  const handleAllClientDetails = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
    }
    const temp1 = [];
    for (let i = 0; i < listOfAllClients.length; i++) {
      const userId = listOfAllClients[i].toString();

      const { data } = await axios.get(`/user/${userId}`, config);
      temp1.push(data)
    }
    return temp1;

  }

  const handleAllClientUserLastMessage = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
    }
    const temp2 = [];
    for (let i = 0; i < listOfAllClients.length; i++) {
      const userId = listOfAllClients[i].toString();

      const { data } = await axios.post(`/get/last/message/between/two/user`, {
        from: userId,
        to: user._id
      }, config);
      temp2.push(data);
    }
    return temp2;
  }



  // Get client details with last message between seller and client
  useEffect(() => {
    const tempFunc = async () => {
      await handleAllClientDetails().then(res => {
        // console.log(res);
        dispatch({ type: FETCH_ALL_CLIENTS_DETAILS, payload: res })
        // console.log(inboxDetails);
      });

      await handleAllClientUserLastMessage().then(res => {
        // console.log(res);
        dispatch({ type: FETCH_ALL_CLIENTS_LAST_MESSAGE, payload: res })
      });
      
      
    }
    console.log("list of all clients useEffect is running")
    if (listOfAllClients !== null) {
      tempFunc();
    }
  }, [listOfAllClients])

  const getAllMessagesBetweenTwoUser = async (clientId) => {
    const postData = {
      from: user._id,
      to: clientId,
    }
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const { data } = await axios.post("/get/all/messages/between/two/users", postData, config);
    const messages = data.messages;
    dispatch({ type: FETCH_ALL_CHATS_WITH_CLIENT, payload: messages });
    scrollToBottomDivRefInbox.current?.scrollIntoView();
  }

  const handleEmojiPickerHideOrShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  }

  const sendChat = async (e) => {
    e.preventDefault();
    if (message.length > 0) {
      await handleSendMessage(message);
      setMessage("");
    }
    if (isFilePicked) {
      // await handleSendFileSocket(selectedFiles);
      setIsFilePicked(false);
      setSelectedFiles(null)
    }
  }


  const handleSendFileSocket = async (files) => {
    const sender = {
      avatar: user.avatar,
      name: user.name,
      _id: user._id
    }
    const receiver = {
      avatar: currentSelectedClient.avatar,
      name: currentSelectedClient.name,
      _id: currentSelectedClient._id
    }
    const fileObj = {
      sender,
      receiver,
      createdAT: new Date().getTime(),
      files
    }



  }

  const handleSendMessage = async (message) => {
    await handleSendMessageSocket(message);
  }

  const handleSendMessageSocket = async (message) => {
    const sender = {
      avatar: user.avatar,
      name: user.name,
      _id: user._id
    }
    const receiver = {
      avatar: currentSelectedClient.avatar,
      name: currentSelectedClient.name,
      _id: currentSelectedClient._id
    }
    const messageData = {
      message: {
        text: message
      },
      sender,
      receiver,
      createdAt: new Date().getTime()
    }

    const clientId = currentSelectedClient._id.toString();

    const index = listOfAllClients.findIndex(id => {
      return id === clientId;
    });


    let temp = [];
    temp = inboxDetails.allClientUserLastMessage.map((mesgs, i) => {
      if (i == index) {
        // console.log({ ...mesgs, messages: [messageData] });
        return { ...mesgs, messages: [messageData] }
      }
      return mesgs;
    })
    // console.log(temp);
    dispatch({ type: UPDATE_CLIENT_LAST_MESSAGE, payload: temp });


    let temp2 = inboxDetails.inboxMessages;
    // console.log(temp2);
    temp2.push(messageData);
    dispatch({ type: UPDATE_ALL_CHATS_WITH_CLIENT, payload: temp2 });




    await socket.emit("send_message", { messageData, room });
    // console.log(allClientUserLastMessage);
  }

  /* everytime there is change in length of 
   inboxMessages array it will scroll down to bottom */
  useEffect(() => {
    scrollToBottomDivRefInbox.current?.scrollIntoView();
  }, [inboxDetails.inboxMessages?.length])


  // console.log("component rendered");

  // console.log(inboxDetails);

  
  // checking for receiving message 
  useEffect(() => {
    
    socket.on("receive_message", async (data) => {
      console.log("receive message is running");
      const { messageData, room } = data;
      const { message, sender, receiver } = messageData;
      const senderId = sender._id.toString();
      const clientId = senderId;


      console.log(user);

      console.log(inboxDetails);

      const clientIndex = listOfAllClients?.findIndex(id => {
        return id === clientId;
      });

      // console.log(clientIndex)

      let temp = [];
      temp = allClientUserLastMessage?.map((mesgs, i) => {
        if (i == clientIndex) {
          // console.log({ ...mesgs, messages: [messageData] });
          return { ...mesgs, messages: [messageData] }
        }
        return mesgs;
      })
      dispatch({ type: UPDATE_CLIENT_LAST_MESSAGE, payload: temp });
      
      if(currentSelectedClient?._id === senderId){
        const temp2 = [...inboxMessages, messageData];
        dispatch({ type: UPDATE_ALL_CHATS_WITH_CLIENT, payload: temp2 });
      }
    })
  },[socket])


  const joinRoom = (senderId, receiverId) => {
    const r = createRoom(senderId, receiverId);
    setRoom(r);
    socket.emit("join_room", r);
  }


  const createRoom = (senderId, receiverId) => {
    if (senderId.toString() > receiverId.toString()) {
      return senderId.toString() + "|" + receiverId.toString();
    }
    else {
      return receiverId.toString() + "|" + senderId.toString();
    }
  }

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
      }
      else {
        index = i;
      }
      const file = {
        selectedFile: files[i],
        id: index
      }
      // console.log(file);
      // console.log(index);
      arr.push(file);
    }
    document.getElementById('chat-inbox-input-file').value = "";
    if (arr.length === 0) {
      setSelectedFiles(null);
      setIsFilePicked(false);

      return;
    }
    // console.log(arr.length);
    setIsFilePicked(true);
    setSelectedFiles(arr);
    console.log(selectedFiles);
    scrollToBottomDivRefInbox.current?.scrollIntoView();
  };

  const handleFileClickedRemoval = (id) => () => {
    let arr = selectedFiles;
    arr = arr.filter(file => {
      return file.id !== id;
    })
    if (arr.length === 0) {
      setIsFilePicked(false);
      setSelectedFiles(null);
      document.getElementById('chat-inbox-input-file').value = "";
      return;
    }
    setSelectedFiles(arr);
  }


  const handleDateFormat = (date) => {
    const dateFormatString = "";
    const A = moment(date);
    const B = moment.now();
    if (A.diff(B, 'years') < 0) {
      return moment(date).format("DD MMM YYYY, HH:mm");
    }
    else {
      return moment(date).format("DD MMM, HH:mm");
    }
  }



  // Handle resizing of window -: width and height
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    // console.log(windowWidth);
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    if (windowWidth < 600)
      setShowMessageListOnDevices(false);
    else
      setShowMessageListOnDevices(true);

    return () => window.removeEventListener("resize", resizeWindow);
  }, [resizeWindow]);



  const handleClientSelectionClick = async (detail) => {
    setCurrentSelectedClient(detail.user);
    setHideMessageListOnSmallDevices(false);
    // joinRoom(user._id, detail.user._id);
    await getAllMessagesBetweenTwoUser(detail.user._id);
  }

  return (
    <div className='inbox-main'>
      <div className='inbox-clients-list' style={{ display: windowWidth < 600 && !hideMessageListOnSmallDevices ? "none" : "block" }}>
        <div className='inbox-search'>
          <input type='text' autoCorrect={false} spellCheck={false} placeholder="Search for a username"></input>
          <i className="fas fa-search"></i>
        </div>
        <ul className='client-list-ul'>
          {/* {
            listOfAllClients && allClientsDetails && allClientUserLastMessage && allClientsDetails.map((detail, index) => (
              <li onClick={() => handleClientSelectionClick(detail)}
                className='inbox-user-client'
                key={detail.user._id}
              >

                <div className='client-list-client-profile-image'>
                  {
                    detail.user.avatar.url ?
                      <img src={detail.user.avatar.url}></img>
                      :
                      <i className={"fa-solid fa-" + (detail.user.name[0].toLowerCase())}></i>
                  }
                </div>
                <div className='client-list-detail-plus-last-message'>
                  <div className='client-list-client-name'>{detail.user.name}</div>
                  <div className='client-list-last-message'>{allClientUserLastMessage[index].messages[0].message.text}</div>
                </div>
                <div className='client-list-last-message-time'>
                  <Moment fromNow ago>
                    {allClientUserLastMessage[index].messages[0].createdAt}
                  </Moment>
                </div>
              </li>
            ))
          } */}





          {
            inboxDetails.listOfAllClients && inboxDetails.allClientsDetails && inboxDetails.allClientUserLastMessage && inboxDetails.allClientsDetails.map((detail, index) => (
              <li onClick={() => handleClientSelectionClick(detail)}
                className='inbox-user-client'
                key={detail.user._id}
              >

                <div className='client-list-client-profile-image'>
                  {
                    detail.user.avatar.url ?
                      <img src={detail.user.avatar.url}></img>
                      :
                      <i className={"fa-solid fa-" + (detail.user.name[0].toLowerCase())}></i>
                  }
                </div>
                <div className='client-list-detail-plus-last-message'>
                  <div className='client-list-client-name'>{detail.user.name}</div>
                  <div className='client-list-last-message'>{inboxDetails.allClientUserLastMessage[index].messages[0].message.text}</div>
                </div>
                <div className='client-list-last-message-time'>
                  <Moment fromNow ago>
                    {inboxDetails.allClientUserLastMessage[index].messages[0].createdAt}
                  </Moment>
                </div>
              </li>
            ))
          }






        </ul>
      </div>
      <div style={{ display: windowWidth < 600 && hideMessageListOnSmallDevices ? "none" : "block" }} className='current-user-message-list'>
        {/* {
          inboxMessages == null ?
            (
              <div className='inbox-message-list-default'>
                <div className='inbox-message-list-default-wrapper'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="108" height="88" viewBox="0 0 108 88"><g transform="translate(4 4)"><ellipse fillRule="evenodd" clipRule="evenodd" fill="#FFF" cx="54" cy="32.5" rx="17" ry="17.5" /><path fillRule="evenodd" clipRule="evenodd" fill="#1DBF73" d="M57 23c0-1.2-.8-2-2.1-2H17.1c-1.3 0-2.1.8-2.1 2s.9 2 2.1 2h37.8c1.3 0 2.1-.8 2.1-2m-22 8H17c-1.2 0-2 .8-2 2s.8 2 2 2h18c1.2 0 2-.8 2-2s-1-2-2-2" /><path fillRule="evenodd" clipRule="evenodd" fill="#555" d="M43.7 53.4c-.4 0-1 .2-1.5.4L24.5 69.4V54.8c0-1-.6-1.9-1.7-2.1-10.7-2-18.6-12.2-18.6-24 0-13.5 10-24.5 22.4-24.5h24.9c12.3 0 22.4 11 22.4 24.5s-10 24.5-22.4 24.5l-7.8.2zM51.4 0H26.6C11.9 0 0 12.9 0 28.7 0 42 8.4 53.4 20.3 56.5v17.4c0 .8.4 1.5 1.3 1.9.2.2.6.2.8.2.4 0 1-.2 1.5-.4l20.7-18.1h7.1C66.1 57.5 78 44.6 78 28.7 78 12.9 66.1 0 51.4 0z" /><path fill="none" stroke="#FFF" strokeWidth="4" d="M43.7 51.4l7.8-.2c11.2 0 20.4-10.1 20.4-22.5S62.6 6.2 51.4 6.2H26.6c-11.2 0-20.4 10-20.4 22.5 0 10.9 7.3 20.2 17 22.1 2 .4 3.3 2 3.3 4v10.1l14.7-12.8.2-.1c.7-.4 1.5-.6 2.3-.6h0zm1.6 8.1L25 77.3l-.2.1c-.8.3-1.7.6-2.4.6-.2 0-.5 0-.7-.1-.4-.1-.8-.2-1.2-.5-1.4-.8-2.1-2-2.1-3.5V58C6.3 54.1-2 42.3-2 28.7-2 11.8 10.8-2 26.6-2h24.9C67.2-2 80 11.8 80 28.7c0 17-12.7 30.9-28.3 30.9h-6.4v-.1z" /><path fillRule="evenodd" clipRule="evenodd" fill="#555" d="M83.6 30.2c-1.2 0-2.1.8-2.1 2.1 0 1.2.8 2.1 2.1 2.1 8.3 0 15.2 7.5 15.2 16.8 0 9.1-6.4 16.6-14.7 16.8-1 0-2.1 1-2.1 2.1v6.6l-7.7-8.1c-.4-.4-1-.6-1.5-.6h-6.6c-4.8 0-9.1-2.5-12-6.6-.6-1-1.9-1.2-2.9-.6s-1.2 1.9-.6 2.9c3.5 5.4 9.6 8.5 15.6 8.5H72l10.8 11.2c.4.4 1 .6 1.5.6.2 0 .6 0 .8-.2.8-.4 1.2-1 1.2-1.9V72c9.6-1.5 16.8-10.2 16.8-20.8.1-11.4-8.7-21-19.5-21" /></g></svg>
                  <div className='inbox-message-list-default-message-title'>Select a Conversation</div>
                  <p className='inbox-message-list-default-message-body'>Try selecting a conversation or searching for someone specific.</p>
                </div>
              </div>
            )
            :
            (
              <div className='inbox-message-list'>
                <div className='inbox-message-list-section-1'>
                  <header>
                    <div style={{ "display": windowWidth < 600 ? "block" : "none" }} className='inbox-message-list-header-icon' onClick={() => setHideMessageListOnSmallDevices(true)}>
                      <i className="fa-solid fa-chevron-left"></i>
                    </div>
                    <h2><Link to={`/user/${currentSelectedClient._id}`}>{currentSelectedClient.name}</Link></h2>
                    <div className='inbox-message-list-header-icon'>
                      <i className="fa-solid fa-ellipsis"></i>
                    </div>
                  </header>
                </div>
                <div className='inbox-message-list-section-2'>
                  <ul>
                    {
                      inboxMessages.map((item, index) => (
                        <li key={index + item.message}>
                          {
                            item.sender.avatar.url ?
                              <img src={item.sender.avatar.url}></img>
                              :
                              <div>
                                <i className={"fa-solid fa-" + (item.sender.name[0].toLowerCase())}></i>
                              </div>
                          }
                          <div className='inbox-messages-list-sender-info'>
                            <div className='inbox-messages-list-sender-name'>{item.sender.name === user.name ? "Me" : item.sender.name}</div>
                            <p className='inbox-messages-list-sender-date'><Moment format='DD MMM YYYY, HH:mm'>{item.createdAt}</Moment></p>
                            <p className='inbox-messages-list-sender-text'>{item.message.text}</p>
                          </div>
                        </li>
                      ))
                    }
                    <div ref={scrollToBottomDivRefInbox}></div>
                  </ul>
                  <form id='inbox-chat-form' onSubmit={(e) => sendChat(e)}>
                    {
                      isFilePicked &&
                      <div className='chat-attached-files-div'>
                        <div className='chat-attached-files-heading'>ATTACHED FILES ({selectedFiles && selectedFiles.length !== 0 && selectedFiles.length})</div>
                        <ul>
                          {
                            selectedFiles && selectedFiles.length > 0 && selectedFiles.map((file, index) => (
                              <li key={index}>
                                <div>{file.selectedFile.name}</div>
                                <button type="button" onClick={handleFileClickedRemoval(file.id)}>
                                  <i className="fa-solid fa-xmark"></i>
                                </button>
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                    }
                    <textarea
                      ref={chatTextAreaRef}
                      rows={1}
                      onFocus={(e) => e.target.parentElement.style.borderColor = "#222831"}
                      maxLength={2500}
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                      placeholder='Type your message here...'
                      spellCheck={false}
                      onBlur={(e) => e.target.parentElement.style.borderColor = "#a6a5a5"}
                    />
                  </form>
                </div>
                <div className='inbox-message-list-section-3'>
                  <footer>
                    <div>
                      <div className='chat-emoji inbox-emoji-picker ' >
                        <div onClick={handleEmojiPickerHideOrShow}>
                          <i className="fa-regular fa-face-smile"></i>
                        </div>
                        {
                          showEmojiPicker &&
                          <Picker
                            onClickOutside={() => setShowEmojiPicker(false)}
                            onEmojiSelect={handleEmojiClick}
                            perLine={8}
                            skinTonePosition="none"
                            previewPosition="none"
                            maxFrequentRows={2}
                          />}
                      </div>
                      <div className='chat-attachment'>
                        <label htmlFor="chat-inbox-input-file">
                          <i className="fa-solid fa-paperclip"></i>
                        </label>
                        <input onChange={handleSelectionOfFiles} id='chat-inbox-input-file' multiple={true} type="file" hidden={true}></input>
                      </div>
                    </div>
                    <button type='submit' form='inbox-chat-form' style={{ "opacity": (message.length > 0 || isFilePicked) ? "1" : "0.4" }}>
                      <i className="fa-regular fa-paper-plane"></i>
                      &nbsp;
                      Send Message
                    </button>
                  </footer>
                </div>
              </div>
            )
        } */}




        {
          inboxDetails.inboxMessages === null ?
            (
              <div className='inbox-message-list-default'>
                <div className='inbox-message-list-default-wrapper'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="108" height="88" viewBox="0 0 108 88"><g transform="translate(4 4)"><ellipse fillRule="evenodd" clipRule="evenodd" fill="#FFF" cx="54" cy="32.5" rx="17" ry="17.5" /><path fillRule="evenodd" clipRule="evenodd" fill="#1DBF73" d="M57 23c0-1.2-.8-2-2.1-2H17.1c-1.3 0-2.1.8-2.1 2s.9 2 2.1 2h37.8c1.3 0 2.1-.8 2.1-2m-22 8H17c-1.2 0-2 .8-2 2s.8 2 2 2h18c1.2 0 2-.8 2-2s-1-2-2-2" /><path fillRule="evenodd" clipRule="evenodd" fill="#555" d="M43.7 53.4c-.4 0-1 .2-1.5.4L24.5 69.4V54.8c0-1-.6-1.9-1.7-2.1-10.7-2-18.6-12.2-18.6-24 0-13.5 10-24.5 22.4-24.5h24.9c12.3 0 22.4 11 22.4 24.5s-10 24.5-22.4 24.5l-7.8.2zM51.4 0H26.6C11.9 0 0 12.9 0 28.7 0 42 8.4 53.4 20.3 56.5v17.4c0 .8.4 1.5 1.3 1.9.2.2.6.2.8.2.4 0 1-.2 1.5-.4l20.7-18.1h7.1C66.1 57.5 78 44.6 78 28.7 78 12.9 66.1 0 51.4 0z" /><path fill="none" stroke="#FFF" strokeWidth="4" d="M43.7 51.4l7.8-.2c11.2 0 20.4-10.1 20.4-22.5S62.6 6.2 51.4 6.2H26.6c-11.2 0-20.4 10-20.4 22.5 0 10.9 7.3 20.2 17 22.1 2 .4 3.3 2 3.3 4v10.1l14.7-12.8.2-.1c.7-.4 1.5-.6 2.3-.6h0zm1.6 8.1L25 77.3l-.2.1c-.8.3-1.7.6-2.4.6-.2 0-.5 0-.7-.1-.4-.1-.8-.2-1.2-.5-1.4-.8-2.1-2-2.1-3.5V58C6.3 54.1-2 42.3-2 28.7-2 11.8 10.8-2 26.6-2h24.9C67.2-2 80 11.8 80 28.7c0 17-12.7 30.9-28.3 30.9h-6.4v-.1z" /><path fillRule="evenodd" clipRule="evenodd" fill="#555" d="M83.6 30.2c-1.2 0-2.1.8-2.1 2.1 0 1.2.8 2.1 2.1 2.1 8.3 0 15.2 7.5 15.2 16.8 0 9.1-6.4 16.6-14.7 16.8-1 0-2.1 1-2.1 2.1v6.6l-7.7-8.1c-.4-.4-1-.6-1.5-.6h-6.6c-4.8 0-9.1-2.5-12-6.6-.6-1-1.9-1.2-2.9-.6s-1.2 1.9-.6 2.9c3.5 5.4 9.6 8.5 15.6 8.5H72l10.8 11.2c.4.4 1 .6 1.5.6.2 0 .6 0 .8-.2.8-.4 1.2-1 1.2-1.9V72c9.6-1.5 16.8-10.2 16.8-20.8.1-11.4-8.7-21-19.5-21" /></g></svg>
                  <div className='inbox-message-list-default-message-title'>Select a Conversation</div>
                  <p className='inbox-message-list-default-message-body'>Try selecting a conversation or searching for someone specific.</p>
                </div>
              </div>
            )
            :
            (
              <div className='inbox-message-list'>
                <div className='inbox-message-list-section-1'>
                  <header>
                    <div style={{ "display": windowWidth < 600 ? "block" : "none" }} className='inbox-message-list-header-icon' onClick={() => setHideMessageListOnSmallDevices(true)}>
                      <i className="fa-solid fa-chevron-left"></i>
                    </div>
                    <h2><Link to={`/user/${currentSelectedClient._id}`}>{currentSelectedClient.name}</Link></h2>
                    <div className='inbox-message-list-header-icon'>
                      <i className="fa-solid fa-ellipsis"></i>
                    </div>
                  </header>
                </div>
                <div className='inbox-message-list-section-2'>
                  <ul>
                    {
                      inboxDetails.inboxMessages.map((item, index) => (
                        <li key={index + item.message}>
                          {
                            item.sender.avatar.url ?
                              <img src={item.sender.avatar.url}></img>
                              :
                              <div>
                                <i className={"fa-solid fa-" + (item.sender.name[0].toLowerCase())}></i>
                              </div>
                          }
                          <div className='inbox-messages-list-sender-info'>
                            <div className='inbox-messages-list-sender-name'>{item.sender.name === user.name ? "Me" : item.sender.name}</div>
                            <p className='inbox-messages-list-sender-date'><Moment format='DD MMM YYYY, HH:mm'>{item.createdAt}</Moment></p>
                            <p className='inbox-messages-list-sender-text'>{item.message.text}</p>
                          </div>
                        </li>
                      ))
                    }
                    <div ref={scrollToBottomDivRefInbox}></div>
                  </ul>
                  <form id='inbox-chat-form' onSubmit={(e) => sendChat(e)}>
                    {
                      isFilePicked &&
                      <div className='chat-attached-files-div'>
                        <div className='chat-attached-files-heading'>ATTACHED FILES ({selectedFiles && selectedFiles.length !== 0 && selectedFiles.length})</div>
                        <ul>
                          {
                            selectedFiles && selectedFiles.length > 0 && selectedFiles.map((file, index) => (
                              <li key={index}>
                                <div>{file.selectedFile.name}</div>
                                <button type="button" onClick={handleFileClickedRemoval(file.id)}>
                                  <i className="fa-solid fa-xmark"></i>
                                </button>
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                    }
                    <textarea
                      ref={chatTextAreaRef}
                      rows={1}
                      onFocus={(e) => e.target.parentElement.style.borderColor = "#222831"}
                      maxLength={2500}
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                      placeholder='Type your message here...'
                      spellCheck={false}
                      onBlur={(e) => e.target.parentElement.style.borderColor = "#a6a5a5"}
                    />
                  </form>
                </div>
                <div className='inbox-message-list-section-3'>
                  <footer>
                    <div>
                      <div className='chat-emoji inbox-emoji-picker ' >
                        <div onClick={handleEmojiPickerHideOrShow}>
                          <i className="fa-regular fa-face-smile"></i>
                        </div>
                        {
                          showEmojiPicker &&
                          <Picker
                            onClickOutside={() => setShowEmojiPicker(false)}
                            onEmojiSelect={handleEmojiClick}
                            perLine={8}
                            skinTonePosition="none"
                            previewPosition="none"
                            maxFrequentRows={2}
                          />}
                      </div>
                      <div className='chat-attachment'>
                        <label htmlFor="chat-inbox-input-file">
                          <i className="fa-solid fa-paperclip"></i>
                        </label>
                        <input onChange={handleSelectionOfFiles} id='chat-inbox-input-file' multiple={true} type="file" hidden={true}></input>
                      </div>
                    </div>
                    <button type='submit' form='inbox-chat-form' style={{ "opacity": (message.length > 0 || isFilePicked) ? "1" : "0.4" }}>
                      <i className="fa-regular fa-paper-plane"></i>
                      &nbsp;
                      Send Message
                    </button>
                  </footer>
                </div>
              </div>
            )
        }




      </div>
    </div>

  )
}


