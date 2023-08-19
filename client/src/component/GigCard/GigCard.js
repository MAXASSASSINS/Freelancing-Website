import React, { useEffect, useRef, useState } from "react";
import "./gigCard.css";
import { MyCarousel } from "../Carousel/MyCarousel";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IoMdImages } from "react-icons/io";
import { Avatar } from "../Avatar/Avatar";
import { HiStar } from "react-icons/hi";
import { FaBars, FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utility/axiosInstance";
import { UPDATE_USER_SUCCESS } from "../../constants/userConstants";

export const GigCard = ({ gig, lazyLoad }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, userLoading, error } = useSelector(
    (state) => state.user
  );

  const [favourite, setFavourite] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user.favouriteGigs.includes(gig._id)) {
      setFavourite(true);
    }
  }, [user, isAuthenticated]);

  const handleUpdateFavourite = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const gigId = gig._id;
    try {
      const {data} = await axiosInstance.post(`/user/favourite/gig/${gigId}`);
      let newFavoriteGigs = [...user.favouriteGigs];
      if (data.isFavourite) {
        newFavoriteGigs.push(gigId);
      } else {
        newFavoriteGigs = newFavoriteGigs.filter((id) => id !== gigId);
      }
      dispatch({ type: UPDATE_USER_SUCCESS, payload: { ...user, favouriteGigs: newFavoriteGigs } });
      setFavourite(!favourite);
    } catch (err) {
      console.log(err.response.status);
      toast.error("We're sorry, something went wrong");
    }
  };

  return (
    <div className="gig-card">
      <div className="container-wrapper">
        <Link to={`/gig/details/${gig._id}`}>
          <MyCarousel lazyLoad={lazyLoad} gig={gig}></MyCarousel>
        </Link>
        <div className="user-details-container">
          <Avatar
            avatarUrl={gig.user.avatar.url}
            alt="user avatar"
            width="2rem"
            userName={gig.user.name}
          />
          <Link to={`/user/${gig.user._id}`}>
            <div className="gig-user-name">{gig.user.name}</div>
          </Link>
        </div>
        <Link to={`/gig/details/${gig._id}`}>
          <h2 className="gig-title">{gig.title}</h2>
        </Link>
        <div className="ratings-container">
          <HiStar />
          <span className="ratings">{gig.ratings.toFixed(1)}</span>
          <span className="no-of-reviews">({gig.numOfRatings})</span>
        </div>

        <div className="action-price-container">
          <div
            onClick={handleUpdateFavourite}
            className="add-to-list-container"
          >
            
            {favourite ? (
              <FaHeart style={{ display: "inline", color: "#f74040" }} />
            ) : (
              <FaRegHeart style={{ display: "inline" }} />
            )}
          </div>
          <Link to={`/gig/details/${gig._id}`}>
            <div className="price-container">
              <div className="starting-at">STARTING AT</div>
              <div>
                ₹
                {gig.pricing.length === 0
                  ? "100"
                  : gig.pricing[0].packagePrice.toLocaleString("en-IN")}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
