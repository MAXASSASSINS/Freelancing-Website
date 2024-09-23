import React from "react";
import "./roundNumberIcon.css";

type RoundNumberIconProps = {
  number: number;
  bcgColor: string;
};

export const RoundNumberIcon = ({ number, bcgColor }: RoundNumberIconProps) => {
  return (
    <div
      className="round-number-icon-main"
      style={{ backgroundColor: bcgColor }}
    >
      <div className="round-number">{number}</div>
    </div>
  );
};