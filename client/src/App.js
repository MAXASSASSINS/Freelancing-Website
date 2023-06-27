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

export const windowContext = createContext();

// export const socket = io.connect("http://localhost:4000");

const App = () => {
  let { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);

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
      // console.log("app navigate is running");
      navigate();
    });
  }, []);

  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    // console.log(windowWidth);
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, [resizeWindow]);

  return (
    <>
      <windowContext.Provider value={{ windowWidth, windowHeight }}>
        <CloudinaryContext cloudName="dyod45bn8" uploadPreset="syxrot1t">
          <SocketContext.Provider value={socket}>
            <Tooltip id="my-tooltip" place="bottom" />

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
              <Route exact path="/login" element={<Login />} />
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
            </Routes>
            {/* <Footer /> */}
          </SocketContext.Provider>
        </CloudinaryContext>
      </windowContext.Provider>
    </>
  );
};

export default App;
