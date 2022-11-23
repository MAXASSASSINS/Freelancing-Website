import React from 'react'
import { GrImage } from 'react-icons/gr'
import { AiOutlineVideoCamera } from 'react-icons/ai'

import { VscFilePdf } from 'react-icons/vsc'
import './fileDropIcon.css'

export const FileDropIcon = ({ type }) => {
  return (
    <div className='file-drop'>
      {
        type === "image" ?
          <>
            <GrImage className='file-drop-icons' />
            Drag & drop a Photo or
          </>
          :
          type === "video" ?
            <>
              <AiOutlineVideoCamera className='file-drop-icons' />
              Drag & drop a Video or
            </>
            :
            <>
              <VscFilePdf className='file-drop-icons' />
              Drag & drop a Pdf or
            </>
      }
      <div>
        <input type="file" id="inputFileDropIcon"></input>
        <label htmlFor='inputFileDropIcon' >Browse</label>
      </div>
    </div>
  )
}
