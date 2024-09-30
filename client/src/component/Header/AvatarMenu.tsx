import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../actions/userAction";

const AvatarMenu = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {user, userError} = useSelector((state: RootState) => state.user);

  const handleLogOut = async () => {
    dispatch(logoutUser());
    if (!userError) navigate("/");
  };

  return (
    <div className="absolute z-50 text-light_heading min-w-max right-0 top-10 px-4 py-3 rounded bg-separator shadow-lg leading-5">
      <ul className="hover:[&>*]:underline flex flex-col gap-4">
        <Link to={"/user/" + user?._id}>Profile</Link>

        <Link to={"/my/favourite/gigs"}>Favourite Gigs</Link>

        <Link to={"/get/all/messages/for/current/user"}>Inbox</Link>

        <Link to={"/orders"}>Orders</Link>
        <li onClick={handleLogOut} className="hover:cursor-pointer">
          Logout
        </li>
      </ul>
    </div>
  );
};

export default AvatarMenu;
