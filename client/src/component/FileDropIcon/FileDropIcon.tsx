import React, { forwardRef, useImperativeHandle, useState } from "react";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { RiImage2Line } from "react-icons/ri";
import { VscFilePdf } from "react-icons/vsc";
import { IFile } from "../../types/file.types";
import "./fileDropIcon.css";

type FileDropIconProps = {
  type: "image" | "video";
  fileAcceptType: string;
  getSelectedFile: (file?: any, index?: number) => void;
  index?: number;
  maxFileSize: number;
  getError: (error: string) => void;
  maxDuration?: number;
};

export type FileDropIconRef = {
  setFileComingFromParent: (file: IFile) => void;
};

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
    }: FileDropIconProps,
    ref: React.Ref<FileDropIconRef>
  ) => {
    const [selectedFile, setSelectedFile] = useState<
      IFile | File | null
    >(null);
    const [previewUrl, setPreviewUrL] = useState<string>("");

    const preveiwImageHandler = (file: File | null) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrL(reader.result as string);
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
          if (file?.url) {
            setPreviewUrL(file.url);
          }
        },
      }),
      []
    );

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      getError("");
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > maxFileSize) {
        getError(
          `File size should be less than ${maxFileSize / (1024 * 1024)}MB`
        );
        return;
      } else if (type === "video") {
        const video = document.createElement("video");
        video.preload = "metadata";

        video.onloadedmetadata = function () {
          window.URL.revokeObjectURL(video.src);
          if (video.duration >= (maxDuration || 180)) {
            getError(
              `Video duration should be less than ${maxDuration} seconds`
            );
            return;
          }
          setSelectedFile(file);
          console.log(file);
          getSelectedFile(file, index);
        };
        video.src = URL.createObjectURL(file);
      } else {
        setSelectedFile(file);
        getSelectedFile(file, index);
        preveiwImageHandler(file);
      }
    };

    const handleRemoveSelectedFile = () => {
      setSelectedFile(null);
      getSelectedFile(null, index);
      setPreviewUrL("");
    };

    return (
      <>
        {selectedFile ? (
          <div className="selected-file-wrapper file-drop">
            {type === "image" ? (
              <img src={previewUrl} alt={previewUrl}></img>
            ) : (
              <div className="tick-mark-icon">
                <IoCheckmarkCircleOutline className="check-mark-icon" />
                <div className="selected-file-name">{(selectedFile as any).name}</div>
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
