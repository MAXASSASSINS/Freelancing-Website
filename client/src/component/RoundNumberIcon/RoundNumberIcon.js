import React from "react";
import "./roundNumberIcon.css";

export const RoundNumberIcon = ({ number, bcgColor }) => {
  return (
    <div
      className="round-number-icon-main"
      style={{ backgroundColor: bcgColor }}
    >
      <div className="round-number">{number}</div>
    </div>
  );
};
