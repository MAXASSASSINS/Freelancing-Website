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

export const Home = () => {
  const dispatch = useDispatch();

  const socket = useContext(SocketContext);

  let { loading, error, gigs, gigsCount } = useSelector((state) => state.gigs);

  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllGig());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      // console.log("app.js socket is running");
      socket.emit("new_user", user._id.toString());
    }
  }, [isAuthenticated, user]);

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
    <>
      <div className="all-gigs-container">
        {gigs && gigs.map((gig) => <GigCard lazyLoad={true} gig={gig} key={gig._id} />)}
      </div>
    </>
  );
};
