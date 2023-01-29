import React from 'react'
import { GrImage } from 'react-icons/gr'
import { AiOutlineVideoCamera } from 'react-icons/ai'
import { HiOutlinePhotograph } from 'react-icons/hi'
import { VscFilePdf } from 'react-icons/vsc'
import './fileDropIcon.css'

import { BsCardImage } from 'react-icons/bs'
import { RiImage2Line } from 'react-icons/ri'

export const FileDropIcon = ({ type, fileAcceptType }) => {
  return (
    <div className='file-drop'>
      {
        type === "image" ?
          <>
            <RiImage2Line className='file-drop-icons' />
            <div>
              Drag & drop a Photo or
            </div>
          </>
          :
          type === "video" ?
            <>
              <AiOutlineVideoCamera className='file-drop-icons' />
              <div>
                Drag & drop a Video or
              </div>
            </>
            :
            <>
              <VscFilePdf className='file-drop-icons' />
              <div>
                Drag & drop a Pdf or
              </div>
            </>
      }
      <div>
        <input accept={fileAcceptType} type="file" id="inputFileDropIcon"></input>
        <label htmlFor='inputFileDropIcon' >Browse</label>
      </div>
    </div>
  )
}
