import React from "react";
import "./footer.css";
import "../../component/common.css";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import { FaGooglePlay } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="global-footer">
      <div className="socials">
        <BsFacebook />
        <BsInstagram />
        <FaGooglePlay />
      </div>
      <div>Created by Mohd. Shadab</div>
    </footer>
  );
};
