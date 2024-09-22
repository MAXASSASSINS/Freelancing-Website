import "bootstrap/dist/css/bootstrap.css";
import {
  createContext,
  useEffect,
  useState
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadUser } from "./actions/userAction";
import "./app.css";
import { CreateGig } from "./component/CreateGig/CreateGig";
import { CurrentlySelectedClientChat } from "./component/CurrentlySelectedClientChat/CurrentlySelectedClientChat";
import { Footer } from "./component/Footer/Footer";
import { GigDetail } from "./component/GigDetail.js/GigDetail";
import { Header } from "./component/Header/Header";
import { Home } from "./component/Home/Home";
import { Inbox } from "./component/Inbox/Inbox2";
import { Login } from "./component/Login/Login";
import { NotFoundPage } from "./component/NotFoundPage/NotFoundPage";
import { PlaceOrder } from "./component/PlaceOrder/PlaceOrder";
import { Sidebar } from "./component/Sidebar/Sidebar";
import { SubmitRequirements } from "./component/SubmitRequirements/SubmitRequirements";
import { Test } from "./component/Test/Test";
import { UserDetail } from "./component/UserDetail/UserDetail";
import store from "./store";

import { SocketContext, socket } from "./context/socket/socket";

import { CloudinaryContext } from "cloudinary-react";
import { Tooltip } from "./component/Tooltip/Tooltip";
import "./utility/color";

import "react-tooltip/dist/react-tooltip.css";
import { BalanceDetail } from "./component/BalanceDetail/BalanceDetail";
import { BuyerFeedback } from "./component/Feedback/BuyerFeedback";
import { OrderDetail } from "./component/OrderDetail/OrderDetail";
import { Orders } from "./component/Orders/Orders";
import { SignUp } from "./component/SignUp";


import { BankAccountForm } from "./component/BankAccountForm";
import { DataSendingLoading } from "./component/DataSendingLoading/DataSendingLoading";
import { FavouriteGigs } from "./component/FavouriteGigs";
import ProtectedRoute from "./component/ProtectedRoute";
import { ResetPassword } from "./component/ResetPassword";
import { UpdateUserProfile } from "./component/UpdateUserProfile";
import {
  useGlobalLoading,
  useGlobalLoadingText
} from "./context/globalLoadingContext";

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
  const globalLoadingText = useGlobalLoadingText();

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
    localStorage.setItem("redirectUrl", "/");
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

  // useEffect(() => {
  //   if (isAuthenticated && user?._id) {
  //     socket.emit("new_user", user._id.toString());
  //   }
  // }, [isAuthenticated, user]);

  useEffect(() => {
    const handleNewUser = () => {
      console.log("handle new user is called");
      if (isAuthenticated && user?._id) {
        socket.emit("new_user", user._id.toString());
      }
    };
    
    // Emit on connect
    socket.on("connect", handleNewUser);

    if (isAuthenticated && user?._id) {
      socket.emit("new_user", user._id.toString());
    }
    
    // Clean up
    return () => {
      socket.off("connect", handleNewUser);
    };
  }, [isAuthenticated, user, userLoading]);

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
    "/reset/password/"
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
            <DataSendingLoading
              show={globalLoading}
              loadingText={globalLoadingText}
            />
            <Tooltip id="my-tooltip" place="bottom" />
            {windowWidth < 900 && <Sidebar></Sidebar>}
            <Header></Header>
            <ToastContainer />
            <Routes>
              <Route
                exact
                path="/get/client/seller/chat:id"
                element={
                  <ProtectedRoute>
                    <CurrentlySelectedClientChat />
                  </ProtectedRoute>
                }
              ></Route>

              <Route
                exact
                path="/reset/password/:token"
                element={<ResetPassword />}
              ></Route>
              <Route
                exact
                path="/get/all/messages/for/current/user"
                element={
                  <ProtectedRoute>
                    <Inbox />
                  </ProtectedRoute>
                }
              ></Route>

              <Route exact path="/" element={<Home />} />
              <Route exact path="/search" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signUp" element={<SignUp />} />

              <Route exact path="/user/:id" element={<UserDetail />} />
              <Route exact path="/gig/details/:id" element={<GigDetail />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route
                exact
                path="/gig/create/new/gig"
                element={
                  <ProtectedRoute>
                    <CreateGig />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                exact
                path="/gig/place/order/:id/:packageNumber"
                element={
                  <ProtectedRoute>
                    <PlaceOrder />
                  </ProtectedRoute>
                }
              ></Route>
              <Route exact path="/test" element={<Test />}></Route>
              <Route
                exact
                path="/gig/place/order/submit/requirements/:orderId"
                element={
                  <ProtectedRoute>
                    <SubmitRequirements />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                exact
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                exact
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                exact
                path="/orders/:id/feedback"
                element={
                  <ProtectedRoute>
                    <BuyerFeedback />
                  </ProtectedRoute>
                }
              />
              <Route
                exact
                path="/balance/detail"
                element={
                  <ProtectedRoute>
                    <BalanceDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                exact
                path="/my/favourite/gigs"
                element={
                  <ProtectedRoute>
                    <FavouriteGigs />
                  </ProtectedRoute>
                }
              />
              <Route
                exact
                path="/update/profile"
                element={
                  <ProtectedRoute>
                    <UpdateUserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                exact
                path="/bank_account"
                element={
                  <ProtectedRoute>
                    <BankAccountForm />
                  </ProtectedRoute>
                }
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
