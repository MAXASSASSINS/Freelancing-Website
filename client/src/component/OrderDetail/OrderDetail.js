import React, { useState, useEffect, useContext } from "react";
import { Requirements } from "./Requirements";
import { Details } from "./Details";
import { Activities } from "./Activities";
import { Delivery } from "./Delivery";
import { colors, green_color } from "../../utility/color";
import { windowContext } from "../../App";
import axios from "axios";
import { useParams } from "react-router-dom";

export const OrderDetail = () => {
  const { windowWidth, windowHeight } = useContext(windowContext);
  const params = useParams();

  const [orderDetail, setOrderDetail] = useState({});

  useEffect(() => {
    getOrderDetail();
    getOrderMessages();
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

  const getOrderMessages = async () => {
    try {
      const {data} = await axios.get(`/message/order/${params.id}`);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }


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
    <div className="bg-separator text-sm">
      <div className="p-6 sm:p-12 md:py-16">
        <header className="mb-8">
          <nav>
            <ul className="uppercase flex gap-6 border-b-2 border-b-dark_separator mb-4 text-no_focus tracking-wide sm:text-base sm:gap-8">
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
        <main className="bg-white shadow-md rounded">
          {activeTab === 0 && <Activities />}
          {activeTab === 1 && <Details />}
          {activeTab === 2 && <Requirements />}
          {activeTab === 3 && <Delivery />}
        </main>
      </div>
    </div>
  );
};
