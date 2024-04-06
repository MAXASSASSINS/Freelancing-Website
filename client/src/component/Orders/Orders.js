import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../utility/axiosInstance";
import { DataSendingLoading } from "../DataSendingLoading/DataSendingLoading";
import { Avatar } from "../Avatar/Avatar";

import { BiShoppingBag } from "react-icons/bi";
import {
  useGlobalLoading,
  useUpdateGlobalLoading,
} from "../../context/globalLoadingContext";

export const Orders = () => {
  const navigate = useNavigate();
  const globalLoading = useGlobalLoading();
  const updateGlobalLoading = useUpdateGlobalLoading();

  const [orders, setOrders] = useState([]);

  const { user, isAuthenticated, userLoading, userError } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (isAuthenticated) {
      getOrderList();
    } else {
      navigate("/login", { replace: true });
    }
  }, [user]);

  const getOrderList = async () => {
    try {
      updateGlobalLoading(true);
      const { data } = await axiosInstance.post("/orders/me");
      
      setOrders(data.orders);
    } catch (err) {
      console.log(err);
    } finally {
      updateGlobalLoading(false);
    }
  };

  const handleViewClick = (order) => {
    if (order.status === "Pending") {
      navigate(`/gig/place/order/submit/requirements/${order._id}`);
    } else {
      navigate(`/orders/${order._id}`);
    }
  };

  return (
    !globalLoading && isAuthenticated && (
      <div className="bg-separator">
        <div className="relative min-h-[calc(100vh-176px)] sm:min-h-[calc(100vh-81px)] p-6 py-8 sm:p-8 md:p-12 lg:p-20 max-w-[1350px] mx-auto">
          <h1 className="text-xl mb-1 font-semibold md:text-2xl lg:text-3xl">
            Welcome, {user.name}
          </h1>
          <p className="text-sm mb-6 md:text-base">See all your orders here</p>

          {orders.length > 0 ? (
            <div className="">
              <ul className="gap-4 grid min-[524px]:grid-cols-2 md:grid-cols-1">
                {orders.map((order) => {
                  return (
                    <li
                      key={order._id}
                      className="flex flex-col gap-4 p-4 border border-dark_separator rounded-[4px] mb-6 bg-white shadow-sm md:flex-row md:items-center lg:gap-8"
                    >
                      <img
                        src={order.gig.images[0].url}
                        alt="gig"
                        className="h-40 md:h-12 md:w-20"
                      />
                      <div className="relative flex gap-4 flex-col md:flex-row md:flex-grow md:justify-between md:items-center">
                        <div className="grid grid-cols-[2rem_auto] gap-3 border-b-2 pb-1 border-b-dark_separator md:border-none md:w-60 lg:w-80">
                          <Avatar
                            avatarUrl={
                              user._id === order.seller._id
                                ? order.buyer.avatar.url
                                : order.seller.avatar.url
                            }
                            userName={
                              user._id === order.seller._id
                                ? order.buyer.name
                                : order.seller.name
                            }
                            width="2rem"
                            fontSize="1rem"
                          />
                          <div className="pb-2 md:p-0">
                            {user._id === order.seller._id ? (
                              <div>
                                <p className="text-dark_grey mt-2">
                                  {order.buyer.name}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-xs mb-0.5 text-light_heading">
                                  {order.seller.name}
                                </p>
                                <p className="text-dark_grey leading-5 md:text-sm lg:text-base">
                                  {order.gigTitle}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center text-light_heading text-sm md:flex-col md:items-start md:gap-2">
                          <p className="flex-grow flex-shrink text-icons md:flex-grow-0 md:flex-shrink-0">
                            Price
                          </p>
                          <p>₹{order.amount}</p>
                        </div>

                        <div className="flex items-center text-sm md:flex-col md:items-start md:gap-2">
                          <p className="flex-grow flex-shrink text-icons md:flex-grow-0 md:flex-shrink-0">
                            Status
                          </p>
                          <p className=" bg-icons text-white px-2 py-1 text-[10px] border rounded-full uppercase">
                            {order.status}
                          </p>
                        </div>

                        <div
                          className="border border-primary p-2 text-center rounded text-primary hover:cursor-pointer md:border-none md:mr-4"
                          onClick={() => handleViewClick(order)}
                        >
                          View
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="flex items-center flex-col gap-2 py-[18vh] min-[600px]:py-[22vh] bg-white rounded">
              <p className="text-7xl">
                <BiShoppingBag />
              </p>
              <p className="capitalize">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    )
  );
};
