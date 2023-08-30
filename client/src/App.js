import React, {
  Fragment,
  useEffect,
  createContext,
  useContext,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import "./app.css";
import { Footer } from "./component/Footer/Footer";
import { Header } from "./component/Header/Header";
import { Sidebar } from "./component/Sidebar/Sidebar";
import { Home } from "./component/Home/Home";
import {
  Routes,
  Route,
  useParams,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { UserDetail } from "./component/UserDetail/UserDetail";
import { GigDetail } from "./component/GigDetail.js/GigDetail";
import { io } from "socket.io-client";
import { Login } from "./component/Login/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Inbox } from "./component/Inbox/Inbox";
import { Test } from "./component/Test/Test";
import { CurrentlySelectedClientChat } from "./component/CurrentlySelectedClientChat/CurrentlySelectedClientChat";
import { loadUser } from "./actions/userAction";
import store from "./store";
import { NotFoundPage } from "./component/NotFoundPage/NotFoundPage";
import { CreateGig } from "./component/CreateGig/CreateGig";
import { PlaceOrder } from "./component/PlaceOrder/PlaceOrder";
import { SubmitRequirements } from "./component/SubmitRequirements/SubmitRequirements";

import { SocketContext, socket } from "./context/socket/socket";

import "./utility/color.js";
import { CloudinaryContext, Image } from "cloudinary-react";
import { Tooltip } from "./component/Tooltip/Tooltip";

import "react-tooltip/dist/react-tooltip.css";
import { Orders } from "./component/Orders/Orders";
import { OrderDetail } from "./component/OrderDetail/OrderDetail";
import { BuyerFeedback } from "./component/Feedback/BuyerFeedback";
import { BalanceDetail } from "./component/BalanceDetail/BalanceDetail";
import { SignUp } from "./component/SignUp";

import { loadStripe } from "@stripe/stripe-js";

import {
  useGlobalLoading,
  useUpdateGlobalLoading,
} from "./context/globalLoadingContext";
import { GoLaw } from "react-icons/go";
import { DataSendingLoading } from "./component/DataSendingLoading/DataSendingLoading";
import { GlobalLoadingProvider } from "./context/globalLoadingContext";
import { FavouriteGigs } from "./component/FavouriteGigs";
import { UpdateUserProfile } from "./component/UpdateUserProfile";

export const windowContext = createContext();

const App = () => {
  let { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, userLoading } = useSelector(
    (state) => state.user
  );

  const globalLoading = useGlobalLoading();

  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  const dimBackground = useSelector((state) => state.dimBackground);
  let height = document.documentElement.offsetHeight;
  let width = document.documentElement.offsetWidth;
  const pageheight = window.innerHeight;
  height = Math.max(pageheight, height);

  useEffect(() => {
    // i have put .then to resolve the promise and lead us to the page where we come from this is working now
    store.dispatch(loadUser()).then(() => {
      //
      navigate();
    });
  }, []);

  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    //
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, [resizeWindow]);

  useEffect(() => {
    if (isAuthenticated) {
      //
      socket.emit("new_user", user._id.toString());
    }
  }, [isAuthenticated, user]);

  // SHOW ONLINE STATUS OF THE USER
  useEffect(() => {
    socket.emit("online", isAuthenticated ? user._id.toString() : null);
    const interval = setInterval(() => {
      socket.emit("online", isAuthenticated ? user._id.toString() : null);
    }, [10000]);
    return () => {
      clearInterval(interval);
    };
  }, [user, isAuthenticated]);

  // List of paths where footer will be hidden
  const pathsWithoutFooter = [
    "/get/all/messages/for/current/user",
    "/gig/create/new/gig",
    "/login",
    "/signUp",
    "/orders/",
    "/update/profile",
  ]; // Add any other paths here

  // Checking if the current location matches any path in pathsWithoutFooter
  const hideFooter = pathsWithoutFooter.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <windowContext.Provider value={{ windowWidth, windowHeight }}>
        <CloudinaryContext cloudName="dyod45bn8" uploadPreset="syxrot1t">
          <SocketContext.Provider value={socket}>
            <DataSendingLoading show={globalLoading} />
            <Tooltip id="my-tooltip" place="bottom" />
            {windowWidth < 900 && <Sidebar></Sidebar>}
            <Header></Header>
            <ToastContainer />
            <Routes>
              <Route
                exact
                path="/get/client/seller/chat:id"
                element={<CurrentlySelectedClientChat />}
              ></Route>
              <Route
                exact
                path="/get/all/messages/for/current/user"
                element={<Inbox />}
              ></Route>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/search" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signUp" element={<SignUp />} />
              {/* {
					gigs && gigs.map(gig => (
						<Sidebar gig={gig} key={gig._id} />
					))
				} */}
              {/* <div style={{ height: height - (width > 600 ? 81 : 143) }} className={'search-bar-dim-background ' + (dimBackground ? "visible" : null)}></div> */}

              <Route exact path="/user/:id" element={<UserDetail />} />
              <Route exact path="/gig/details/:id" element={<GigDetail />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route
                exact
                path="/gig/create/new/gig"
                element={<CreateGig />}
              ></Route>
              <Route
                exact
                path="/gig/place/order/:id/:packageNumber"
                element={<PlaceOrder />}
              ></Route>
              <Route exact path="/test" element={<Test />}></Route>
              <Route
                exact
                path="/gig/place/order/submit/requirements/:orderId"
                element={<SubmitRequirements />}
              ></Route>
              <Route exact path="/orders" element={<Orders />} />
              <Route exact path="/orders/:id" element={<OrderDetail />} />
              <Route
                exact
                path="/orders/:id/feedback"
                element={<BuyerFeedback />}
              />
              <Route exact path="/balance/detail" element={<BalanceDetail />} />
              <Route
                exact
                path="/my/favourite/gigs"
                element={<FavouriteGigs />}
              />
              <Route
                exact
                path="/update/profile"
                element={<UpdateUserProfile />}
              />
            </Routes>
            <div
              style={{ height: height - (width > 600 ? 81 : 143) }}
              className={
                "search-bar-dim-background " +
                (dimBackground ? "visible" : null)
              }
            ></div>
            {!hideFooter && <Footer />}
          </SocketContext.Provider>
        </CloudinaryContext>
      </windowContext.Provider>
    </>
  );
};

export default App;
