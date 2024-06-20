import React, { useState, useEffect } from "react";
import "./DataSendingLoading.css";
import { BsCheckCircle } from "react-icons/bs";

export const DataSendingLoading = ({ finishedLoading, show, loadingText = '', pos = 'fixed' }) => {
  // const [finishedLoading, setFinishedLoading] = useState(false)
  // 
  return (
    <div
      className="data-sending-loading-overlay"
      style={{ display: show ? "" : "none", position: pos}}
    >
      {!finishedLoading ? (
        <div>
          <p className="saving-your-gig">{loadingText}</p>
          <span className="data-sending-loader"></span>
        </div>
      ) : (
        <div className="finished-loading-wrapper">
          <p>Changes saved!</p>
          <span>
            <BsCheckCircle />
          </span>
        </div>
      )}
    </div>
  );
};
