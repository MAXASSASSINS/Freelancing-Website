import "bootstrap/dist/css/bootstrap.css";
import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
// @ts-ignore
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadUser } from "./actions/userAction";
import "./app.css";
import { CreateGig } from "./Pages/CreateGig/CreateGig";
import { Footer } from "./component/Footer/Footer";
import { GigDetail } from "./Pages/GigDetail/GigDetail";
import { Header } from "./component/Header/Header";
import { Home } from "./Pages/Home";
import { Inbox } from "./component/Inbox/Inbox2";
import { Login } from "./Pages/Login";
import { NotFoundPage } from "./component/NotFoundPage/NotFoundPage";
import { PlaceOrder } from "./Pages/PlaceOrder";
import { Sidebar } from "./component/Sidebar/Sidebar";
import { SubmitRequirements } from "./Pages/SubmitRequirements";
import { Test } from "./component/Test/Test";
import { UserDetail } from "./Pages/UserDetail/UserDetail";
import { AppDispatch, RootState } from "./store";
import "../src/component/common.css";

import { SocketContext, socket } from "./context/socket/socket";
// @ts-ignore
import { CloudinaryContext } from "cloudinary-react";
import { Tooltip } from "./component/Tooltip/Tooltip";
import "./utility/color";

import "react-tooltip/dist/react-tooltip.css";
import { BalanceDetail } from "./Pages/BalanceDetail";
import { BuyerFeedback } from "./Pages/BuyerFeedback";
import { OrderDetail } from "./Pages/OrderDetail";
import { Orders } from "./Pages/Orders";
import { SignUp } from "./Pages/SignUp";

import { useDispatch } from "react-redux";
import { BankAccountForm } from "./Pages/BankAccountForm";
import { DataSendingLoading } from "./component/DataSendingLoading/DataSendingLoading";
import { FavouriteGigs } from "./Pages/FavouriteGigs";
import ProtectedRoute from "./component/ProtectedRoute";
import { ResetPassword } from "./component/ResetPassword";
import ScrollToTop from "./component/ScrollToTop";
import { UpdateUserProfile } from "./Pages/UpdateUserProfile";
import {
  useGlobalLoading,
  useGlobalLoadingText,
} from "./context/globalLoadingContext";

export const windowContext = createContext({ windowWidth: 0 });

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, userLoading } = useSelector(
    (state: RootState) => state.user
  );

  const globalLoading = useGlobalLoading();
  const globalLoadingText = useGlobalLoadingText();

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(loadUser());
    };
    fetchUser();
  }, []);

  useEffect(() => {
    let resizeWindow = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeWindow);
    resizeWindow();
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  useEffect(() => {
    const handleNewUser = () => {
      if (isAuthenticated && user?._id) {
        console.log("new user");
        socket.emit("new_user", user._id.toString());
      }
    };

    // Emit on connect
    socket.on("connect", handleNewUser);
    if (socket.connected) handleNewUser();

    // Clean up
    return () => {
      socket.off("connect", handleNewUser);
    };
  }, [isAuthenticated, user, userLoading]);

  // SHOW ONLINE STATUS OF THE USER
  useEffect(() => {
    socket.emit("online", isAuthenticated ? user?._id.toString() : null);
    const interval = setInterval(() => {
      socket.emit("online", isAuthenticated ? user?._id.toString() : null);
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [user, isAuthenticated]);

  return (
    <>
      <ScrollToTop>
        <windowContext.Provider value={{ windowWidth }}>
          <CloudinaryContext cloudName="dyod45bn8" uploadPreset="syxrot1t">
            <SocketContext.Provider value={socket}>
              <DataSendingLoading
                show={globalLoading}
                loadingText={globalLoadingText}
              />
              <Tooltip place="bottom" />
              {windowWidth < 900 && <Sidebar></Sidebar>}
              <Header></Header>
              <ToastContainer />
              <Routes>
                <Route
                  path="/reset/password/:token"
                  element={<ResetPassword />}
                ></Route>
                <Route
                  path="/get/all/messages/for/current/user"
                  element={
                    <ProtectedRoute>
                      <Inbox />
                    </ProtectedRoute>
                  }
                ></Route>

                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signUp" element={<SignUp />} />

                <Route path="/user/:id" element={<UserDetail />} />
                <Route path="/gig/details/:id" element={<GigDetail />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route
                  path="/gig/create/new/gig/:id"
                  element={
                    <ProtectedRoute>
                      <CreateGig />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/gig/place/order/:id/:packageNumber"
                  element={
                    <ProtectedRoute>
                      <PlaceOrder />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route path="/test" element={<Test />}></Route>
                <Route
                  path="/gig/place/order/submit/requirements/:orderId"
                  element={
                    <ProtectedRoute>
                      <SubmitRequirements />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id/feedback"
                  element={
                    <ProtectedRoute>
                      <BuyerFeedback />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/balance/detail"
                  element={
                    <ProtectedRoute>
                      <BalanceDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my/favourite/gigs"
                  element={
                    <ProtectedRoute>
                      <FavouriteGigs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/update/profile"
                  element={
                    <ProtectedRoute>
                      <UpdateUserProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bank_account"
                  element={
                    <ProtectedRoute>
                      <BankAccountForm />
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <Footer />
            </SocketContext.Provider>
          </CloudinaryContext>
        </windowContext.Provider>
      </ScrollToTop>
    </>
  );
};

export default App;
