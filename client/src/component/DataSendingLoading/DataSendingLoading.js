import React, { useState, useEffect } from 'react'
import './DataSendingLoading.css'
import { BsCheckCircle } from 'react-icons/bs'

export const DataSendingLoading = ({ finishedLoading, show }) => {

  // const [finishedLoading, setFinishedLoading] = useState(false)
  // console.log(finishedLoading);
  return (
    <div className='data-sending-loading-overlay' style={{ display: show ? "" : "none" }}>
      {
        !finishedLoading ?
          <div>
            <p className='saving-your-gig'>Saving your gig...</p>
            <span class="data-sending-loader"></span>
          </div>
          :
          <div className='finished-loading-wrapper'>
            <p>Changes saved!</p>
            <span><BsCheckCircle /></span>
          </div>
      }

    </div>
  )
}
