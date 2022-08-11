import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import './chat.css'
const socket = io.connect("http://localhost:4000");

export const Chat = ({ gigDetail, showChatBox, setShowChatBox }) => {
  new Picker({ data });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [isFilePicked, setIsFilePicked] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [chatTextAreaHeight, setChatTextAreaHeight] = useState(400);

  const handleChatTextAreaHeight = () => {
    if (window.innerWidth < 600 && isFilePicked) {
      setChatTextAreaHeight(window.innerHeight - 83.2 - 113 - 16 - 124);
    }
    else if (window.innerWidth < 600) {
      setChatTextAreaHeight(window.innerHeight - 83.2 - 113 - 16)
    }
    else if (window.innerWidth > 600 && isFilePicked) {
      setChatTextAreaHeight(400 - 124)
    }
    else {
      setChatTextAreaHeight(400);
    }
  }

  useEffect(() => {
    handleChatTextAreaHeight();
  }, [isFilePicked, window.innerWidth])

  const handleEmojiPickerHideOrShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  }

  const handleEmojiClick = (emoji) => {
    setShowEmojiPicker(false);
    setMessage(message + emoji.native);
  }

  const handleSelectionOfFiles = (event) => {
    setIsFilePicked(true);
    const files = event.target.files;
    let arr = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      arr.push(selectedFiles[i]);
    }
    for (let i = 0; i < files.length; i++) {
      arr.push(files[i]);
    }
    // console.log(arr);
    setSelectedFiles(arr);
    // console.log(selectedFiles);
    // console.log(selectedFiles.length);
  };

  const handleFileClickedRemoval = (filename) => () => {
    // console.log(filename);
    let arr = selectedFiles;
    arr = arr.filter(file => {
      return file.name != filename;
    })
    // console.log(arr);
    if (arr.length === 0) {
      setIsFilePicked(false);
    }
    setSelectedFiles(arr);
    // if(selectedFiles.length === 0){
    // setIsFilePicked(false);
    // }
  }


  const sendChat = (e) => {
    e.preventDefault();
    if(message.length > 0){
      handleSendMessage(message);
      setMessage("");
    }
  }

  const handleSendMessage = (message) => {
    
  }



  return (
    <div className='chat-background' style={{ "display": showChatBox ? "block" : "none" }}>
      <div className='chat-content'>
        <header>
          <img src={gigDetail.user.avatar.url}></img>
          <div>
            <div className='chat-seller-name'>Message {gigDetail.user.name}</div>
            <div className='chat-seller-online-status'>Away</div>
          </div>
          <span onClick={() => setShowChatBox(false)}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        </header>
        <main>
          <form id='chat-form' onSubmit={(e) => sendChat(e)}>
            <textarea
              style={{ height: chatTextAreaHeight }}
              onFocus={(e) => e.target.parentElement.style.borderColor = "#222831"}
              maxLength={2500}
              onChange={e => setMessage(e.target.value)}
              value={message}
              placeholder='Type your message here...'
              spellCheck={false}
              onBlur={(e) => e.target.parentElement.style.borderColor = "#a6a5a5"}
            />
            {
              isFilePicked &&
              <div className='chat-attached-files-div'>
                <div className='chat-attached-files-heading'>ATTACHED FILES ({selectedFiles && selectedFiles.length})</div>
                <ul>
                  {
                    selectedFiles.length > 0 && selectedFiles.map((file, index) => (
                      <li key={index}>
                        <div>{file.name}</div>
                        <button onClick={handleFileClickedRemoval(file.name)}>
                          <i className="fa-solid fa-xmark"  ></i>
                        </button>
                      </li>
                    ))
                  }
                </ul>
              </div>
            }
          </form>
        </main>
        <footer>
          <div>
            <div className='chat-emoji' >
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
              <label htmlFor="chat-input-file">
                <i className="fa-solid fa-paperclip"></i>
              </label>
              <input onChange={handleSelectionOfFiles} id='chat-input-file' multiple={true} type="file" hidden={true}></input>
            </div>
          </div>
          <button type='submit' form='chat-form' style={{ "opacity": message.length > 0 ? "1" : "0.4" }}>
            <i class="fa-regular fa-paper-plane"></i>
            &nbsp;
            Send Message
          </button>
        </footer>
      </div>
    </div>
  )
}
