import React, { useState, useEffect, useContext } from "react";
import { Requirements } from "./Requirements";
import { Details } from "./Details";
import { Activities } from "./Activities";
import { Delivery } from "./Delivery";
import { colors, green_color } from "../../utility/color";
import { windowContext } from "../../App";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { AiFillQuestionCircle } from "react-icons/ai";
import { OrderDetailSideModal } from "./OrderDetailSideModal";
import { useSelector } from "react-redux";
import { DeliveryTimer } from "./DeliveryTimer";
import { socket } from "../../context/socket/socket";

export const OrderDetail = () => {
  const { windowWidth, windowHeight } = useContext(windowContext);
  const params = useParams();
  const navigate = useNavigate();

  const [orderDetail, setOrderDetail] = useState({});

  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    getOrderDetail();
  }, []);

  const getOrderDetail = async () => {
    try {
      const { data } = await axios.get(`/order/details/${params.id}`);
      console.log(data);
      setOrderDetail(data.order);
    } catch (error) {
      console.log(error);
    }
  };

  const [activeTab, setActiveTab] = useState(0);

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

        {orderDetail._id && (
          <main className="rounded md:flex justify-between gap-8 lg:gap-16">
            <div className="flex-grow">
              {activeTab === 0 && <Activities orderDetail={orderDetail} />}
              {activeTab === 1 && <Details orderDetail={orderDetail} />}
              {activeTab === 2 && <Requirements orderDetail={orderDetail} />}
              {activeTab === 3 && <Delivery orderDetail={orderDetail} />}
            </div>

            <div className="flex flex-col gap-8">
              {{
                /* orderDetail.seller._id  && orderDetail.status === 'In Progress' && */
              } && <DeliveryTimer orderDetail={orderDetail} />}
              <OrderDetailSideModal orderDetail={orderDetail} />
            </div>
          </main>
        )}
      </div>
    </div>
  );
};
