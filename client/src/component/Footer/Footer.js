import React from "react";
import "../../component/common.css";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import { FaGooglePlay } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="px-6 py-6 text-light_heading border-t w-full">
      <div className="flex items-center gap-12 justify-between">
        <div className="flex gap-2">
          <h4 className="font-[Pacifico,cursive] font-semibold text-2xl">
            FreelanceMe
          </h4>
        </div>
        <div className="text-xl  flex items-center gap-4">
          <Link className="p-2 hover:bg-dark_separator rounded-full">
            <BsFacebook className="" />
          </Link>
          <Link className="p-2 hover:bg-dark_separator rounded-full">
            <BsInstagram />
          </Link>
          <Link className="p-2 hover:bg-dark_separator rounded-full">
            <FaGooglePlay />
          </Link>
        </div>
      </div>
    </footer>
  );
};
