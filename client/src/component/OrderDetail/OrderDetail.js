import React, { useState, useEffect, useContext } from "react";
import { Requirements } from "./Requirements";
import { Details } from "./Details";
import { Activities } from "./Activities";
import { Delivery } from "./Delivery";
import { colors, green_color } from "../../utility/color";
import { windowContext } from "../../App";
import { axiosInstance } from "../../utility/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { AiFillQuestionCircle } from "react-icons/ai";
import { OrderDetailSideModal } from "./OrderDetailSideModal";
import { useDispatch, useSelector } from "react-redux";
import { DeliveryTimer } from "./DeliveryTimer";
import { socket } from "../../context/socket/socket";
import { getOrderDetail } from "../../actions/orderAction";

export const OrderDetail = () => {
  const { windowWidth, windowHeight } = useContext(windowContext);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const [orderDetail, setOrderDetail] = useState({});

  const { user, isAuthenticated, userLoading, userError } = useSelector(
    (state) => state.user
  );

  const { orderDetail, orderLoading, orderError } = useSelector(
    (state) => state.orderDetail
  );

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      dispatch(getOrderDetail(params.id));
    }
  }, [user]);

  //

  if (orderError) {
    navigate("/404");
  }

  const handleActivityClick = () => {
    setActiveTab(0);
  };

  const handleDetailsClick = () => {
    setActiveTab(1);
  };

  const handleRequirementsClick = () => {
    setActiveTab(2);
  };

  const handleDeliveryClick = () => {
    setActiveTab(3);
  };

  const tabsList = [
    { name: "Activity", id: 0, handleClick: handleActivityClick },
    { name: "Details", id: 1, handleClick: handleDetailsClick },
    {
      name: windowWidth < 600 ? "Req's" : "Requirements",
      id: 2,
      handleClick: handleRequirementsClick,
    },
    { name: "Delivery", id: 3, handleClick: handleDeliveryClick },
  ];

  const styleActiveTab = {
    color: green_color,
    borderBottom: "2px solid" + green_color,
  };

  return (
    <div className="bg-separator  min-[1450px]:flex justify-center">
      <div className="p-6 sm:p-12 md:p-16 xl:p-20 min-[1450px]:max-w-[1400px]">
        <header className="mb-8">
          <nav>
            <ul className="text-sm uppercase flex gap-6 border-b-2 border-b-dark_separator mb-4 text-no_focus tracking-wide sm:text-base sm:gap-8">
              {tabsList.map((tab) => (
                <li
                  key={tab.id}
                  className="pb-2 -m-0.5 hover:cursor-pointer"
                  style={activeTab === tab.id ? styleActiveTab : null}
                  onClick={tab.handleClick}
                >
                  {tab.name}
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {orderDetail && Date.now() > new Date(orderDetail.deliveryDate) && (
          <div className="p-8 my-8 bg-red-100 rounded">
            <p>
              <span className="text-red-600">
                {user._id === orderDetail.seller._id
                  ? "This order is marked as late but you can still deliver it."
                  : "This order is marked as late."}
              </span>
            </p>
          </div>
        )}

        {orderDetail && (
          <main className="rounded flex flex-col-reverse min-[900px]:flex-row justify-between gap-8 lg:gap-16">
            <div className="flex-grow">
              <div style={{ display: activeTab === 0 ? "block" : "none" }}>
                <Activities orderDetail={orderDetail} />
              </div>
              <div style={{ display: activeTab === 1 ? "block" : "none" }}>
                <Details orderDetail={orderDetail} />
              </div>
              <div style={{ display: activeTab === 2 ? "block" : "none" }}>
                <Requirements orderDetail={orderDetail} />
              </div>
              <div style={{ display: activeTab === 3 ? "block" : "none" }}>
                <Delivery orderDetail={orderDetail} />
              </div>
            </div>

            <div className="flex flex-col gap-8">
              {orderDetail.seller._id === user._id &&
                (orderDetail.status === "In Progress" ||
                  orderDetail.status === "In Revision" ||
                  orderDetail.status === "Delivered") &&
                windowWidth > 900 && (
                  <DeliveryTimer orderDetail={orderDetail} />
                )}
              <OrderDetailSideModal orderDetail={orderDetail} />
            </div>
          </main>
        )}
      </div>
    </div>
  );
};
