import React, { useEffect, useContext } from "react";
import "./home.css";
import "../../component/common.css";
import { GigCard } from "../GigCard/GigCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllGig } from "../../actions/gigAction";

import { Sidebar } from "../Sidebar/Sidebar";
import { Header } from "../Header/Header";
import { Navigate } from "react-router-dom";
import { io } from "socket.io-client";
// import { socket } from '../../App'
import { SocketContext } from "../../context/socket/socket";
import { updateAllGigs } from "../../actions/gigAction";
import { SearchTagsBar } from "../SearchTagsBar";

export const Home = () => {
  const dispatch = useDispatch();

  const socket = useContext(SocketContext);

  let { gigLoading, userError, gigs, gigsCount } = useSelector(
    (state) => state.gigs
  );

  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllGig());
  }, [dispatch]);

  // SHOW ONLINE STATUS OF THE USER
  // useEffect(() => {
  //   socket.emit("online", isAuthenticated ? user._id.toString() : null);
  //   const interval = setInterval(() => {
  //     socket.emit("online", isAuthenticated ? user._id.toString() : null);
  //   }, [10000]);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [user, isAuthenticated]);

  // Tracking the online status of the gigs listed in the home page
  useEffect(() => {
    socket.on("online_from_server", async (userId) => {
      if (gigs) {
        const temp = gigs.map((gig) => {
          if (gig.user._id.toString() === userId.toString()) {
            return { ...gig, user: { ...gig.user, online: true } };
          }
          return gig;
        });
        dispatch(updateAllGigs(temp));
      }
    });

    socket.on("offline_from_server", async (userId) => {
      // console.log("offline from server with " + userId.toString());
      if (gigs) {
        const temp = gigs.map((gig) => {
          if (gig.user._id.toString() === userId.toString()) {
            return { ...gig, user: { ...gig.user, online: false } };
          }
          return gig;
        });
        dispatch(updateAllGigs(temp));
      }
    });

    return () => {
      socket.off("online_from_server");
      socket.off("offline_from_server");
    };
  }, [socket, gigs, dispatch]);

  useEffect(() => {
    console.log("gigs is changed");
  }, [gigs]);

  // LAZY LOADING THE IMAGES AND VIDEOS
  useEffect(() => {
    const images = document.querySelectorAll("img[data-src]");
    const videoImages = document.querySelectorAll("video[data-poster]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target.attributes.getNamedItem("poster")) {
            entry.target.attributes.getNamedItem("poster").value =
              entry.target.attributes.getNamedItem("data-poster").value;
          } else {
            entry.target.attributes.getNamedItem("src").value =
              entry.target.attributes.getNamedItem("data-src").value;
          }
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "300px",
      }
    );

    images.forEach((image) => {
      observer.observe(image);
    });

    videoImages.forEach((image) => {
      observer.observe(image);
    });
  }, [gigs]);

  return (
    <div className="min-h-[calc(100vh-146.5px)] sm:min-h-[calc(100vh-81px)] mb-8">
      <SearchTagsBar />
      {gigs?.length > 0 ? (
        <div className="all-gigs-container">
          {gigs &&
            gigs.map((gig) => (
              <GigCard lazyLoad={true} gig={gig} key={gig._id} />
            ))}
        </div>
      ) : (
        <div className="h-[calc(100vh-146.5px)] sm:h-[calc(100vh-81px)] mx-6 text-dark_grey flex flex-col items-center justify-center">
          <img
            className="max-w-sm sm:max-w-lg object-contain"
            src="/images/confused-man-with-question-mark-concept-flat-illustration-free-vector.jpg"
          ></img>
          <h1 className="text-center text-xl sm:text-3xl capitalize font-semibold">
            No Services Found For Your Search
          </h1>
          <p className="max-w-[40ch] text-center mt-2 leading-5 sm:leading-normal sm:text-lg text-light_heading">
            Try a new search or select from the categories above for better
            results.
          </p>
        </div>
      )}
    </div>
  );
};
