import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { VscFilePdf } from "react-icons/vsc";
import { RiImage2Line } from "react-icons/ri";
import { BsTrash } from "react-icons/bs";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import "./fileDropIcon.css";

export const FileDropIcon = forwardRef(
  (
    {
      type,
      fileAcceptType,
      getSelectedFile,
      index,
      maxFileSize,
      getError,
      maxDuration,
    },
    ref
  ) => {
    const [selectedFile, setSelectedFile] = useState("");
    const [previewUrl, setPreviewUrL] = useState("");

    const preveiwImageHandler = (file) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrL(reader.result);
      };
      reader.readAsDataURL(file);
    };

    useImperativeHandle(
      ref,
      () => ({
        setFileComingFromParent(file) {
          if (file) setSelectedFile(file);
          if (file?.url) {
            setPreviewUrL(file.url);
          }
          if (file?.videoUrl) {
            setPreviewUrL(file.videoUrl);
          }
        },
      }),
      [selectedFile]
    );

    const changeHandler = (event) => {
      getError("");
      if (event.target?.files[0].size > maxFileSize) {
        getError(
          `File size should be less than ${maxFileSize / (1024 * 1024)}MB`
        );
        return;
      } else if (type === "video") {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = function () {
          window.URL.revokeObjectURL(video.src);
          if (video.duration >= maxDuration) {
            getError(
              `Video duration should be less than ${maxDuration} seconds`
            );
            return;
          }
          setSelectedFile(event.target.files[0]);
          getSelectedFile(event.target.files[0], index);
        };
        video.src = URL.createObjectURL(event.target.files[0]);
      } else {
        setSelectedFile(event.target.files[0]);
        getSelectedFile(event.target.files[0], index);
        preveiwImageHandler(event.target.files[0]);
      }
    };

    const handleRemoveSelectedFile = () => {
      setSelectedFile("");
      getSelectedFile(null, index);
      setPreviewUrL("");
    };

    const getFileName = (fileName) => {
      if (fileName.length > 80) {
        return fileName.slice(0, 80) + "...";
      }
      return fileName;
    };

    return (
      <>
        {selectedFile ? (
          <div className="selected-file-wrapper file-drop">
            {type === "image" ? (
              <img src={previewUrl}></img>
            ) : (
              <div className="tick-mark-icon">
                <IoCheckmarkCircleOutline className="check-mark-icon" />
                <div className="selected-file-name">
                  {/* {getFileName(selectedFile.name)} */}
                  {selectedFile.videoName
                    ? selectedFile.videoName.toString() +
                      "." +
                      selectedFile.mimeType.toString()
                    : selectedFile.name}
                </div>
              </div>
            )}
            <div onClick={handleRemoveSelectedFile} className="trash-icon">
              <BsTrash />
            </div>
          </div>
        ) : (
          <div className="file-drop">
            {type === "image" ? (
              <>
                <RiImage2Line className="file-drop-icons" />
                <div>Drag & drop a Photo or</div>
              </>
            ) : type === "video" ? (
              <>
                <AiOutlineVideoCamera className="file-drop-icons" />
                <div>Drag & drop a Video or</div>
              </>
            ) : (
              <>
                <VscFilePdf className="file-drop-icons" />
                <div>Drag & drop a Pdf or</div>
              </>
            )}
            <div className="file-input-wrapper">
              <label>
                Browse
                <input
                  onChange={changeHandler}
                  accept={fileAcceptType}
                  type="file"
                />
              </label>
            </div>
          </div>
        )}
      </>
    );
  }
);
