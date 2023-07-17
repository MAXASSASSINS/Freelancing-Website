import React, { useState, useEffect, useRef, useContext } from "react";
import Picker from "@emoji-mart/react";
import { BsEmojiSmile } from "react-icons/bs";
import { useSelector } from "react-redux";
import { SocketContext } from "../../context/socket/socket";
import { IoClose } from "react-icons/io5";
import { FaPaperclip, FaRegPaperPlane } from "react-icons/fa";

export const OrderMessageInput = ({ orderDetail, handleSubmissionOfForm }) => {
  

  const inputFileRef = useRef(null);
  const emojiPickerOpenerIconRef = useRef(null);
  const scrollToBottomDivRefInbox = useRef(null);

  const [message, setMessage] = useState("");
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emoji) => {
    // console.log(emoji);
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
    inputFileRef.current.value = "";
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
      inputFileRef.current.value = "";
      return;
    }
    setSelectedFiles(arr);
  };

  const handleTextAreaChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleSendClick = () => {
    let files = [];
    if (isFilePicked) {
      files = selectedFiles.map((file) => {
        return file.selectedFile;
      });
    }
    handleSubmissionOfForm(message, files);
    setMessage("");
    setIsFilePicked(false);
    setSelectedFiles(null);
  };

  window.onclick = (event) => {
    if (
      event.target !== document.querySelector("em-emoji-picker") &&
      !emojiPickerOpenerIconRef.current?.contains(event.target)
    ) {
      setShowEmojiPicker(false);
    }
  };

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
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
                      <IoClose />
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        )}
        <textarea
          className="p-2 text-sm overflow-y-scroll border border-no_focus rounded-[3px] block w-full max-h-40 leading-6 resize-none focus:outline-none focus:border-dark_grey"
          rows={6}
          maxLength={2500}
          onChange={handleTextAreaChange}
          value={message}
          placeholder="Type your message here..."
          spellCheck={false}
          onBlur={(e) => (e.target.parentElement.style.borderColor = "#a6a5a5")}
        />

        <div className="relative w-full flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <div
              onClick={handleEmojiPickerHideOrShow}
              ref={emojiPickerOpenerIconRef}
              className="text-2xl flex justify-center items-center w-10 h-10 text-light_heading  rounded-full hover:bg-off_white hover:text-primary hover:cursor-pointer"
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
              data-tooltip-content="Max 5GB"
              data-tooltip-place="top"
              data-tooltip-id="my-tooltip"
            >
              <label className="text-2xl flex justify-center items-center w-10 h-10 text-light_heading rounded-full hover:bg-off_white hover:text-primary hover:cursor-pointer [&>*]:hover:cursor-pointer">
                <FaPaperclip className="inline" />
                <input
                  onChange={handleSelectionOfFiles}
                  multiple={true}
                  ref={inputFileRef}
                  type="file"
                  // accept="image/*,video/*"
                  hidden={true}
                ></input>
              </label>
            </div>
          </div>
          <button
            className="bg-primary text-white rounded-[0.25rem] p-2 px-4"
            disabled={message.length <= 0 && !isFilePicked}
            onClick={handleSendClick}
            style={{
              opacity: message.length > 0 || isFilePicked ? "1" : "0.4",
            }}
          >
            <FaRegPaperPlane className="inline" />
            &nbsp; Send
          </button>
        </div>
      </form>
    </div>
  );
};
