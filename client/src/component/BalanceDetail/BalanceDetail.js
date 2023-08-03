import React, { useState, useEffect, useRef } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../../actions/userAction";
import { Link, redirect, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/axiosInstance";
import { numberToCurrency } from "../../utility/util";

export const BalanceDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, userLoading, error } = useSelector(
    (state) => state.user
  );

  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      getOrderList();
    }
  }, [user]);

  const getOrderList = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/orders/me");
      console.log(data);
      setOrderList(data.orders);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const earnings = orderList.reduce((acc, order) => {
    if (order.status === "Completed" && order.seller._id === user._id) {
      return acc + order.amount;
    }
    return acc;
  }, 0);

  const expenses = orderList.reduce((acc, order) => {
    if (order.status === "Completed" && order.buyer._id === user._id) {
      return acc + order.amount;
    }
    return acc;
  }, 0);

  const handleWithdrawl = async () => {
    try {
      const { data } = await axiosInstance.get("/withdrawl");
      console.log(data);
      if(data.redirectUrl) window.location.href = data.redirectUrl;
    } catch (err) {
      console.log(err.response.data.message);
    }
  };


  return (
    isAuthenticated && (
      <div className="flex justify-center">
        <div className="w-full max-w-[1400px] p-8">
          <h1 className="text-3xl font-semibold mb-4">Balance</h1>
          <div className="flex flex-col sm:grid sm:grid-cols-2 sm:grid-rows-1  gap-6">
            <section>
              <h2 className="text-lg font-semibold mb-1">Available Funds</h2>
              <div className="border p-6">
                <div className="flex gap-2 text-sm items-center mb-4">
                  <p className="text-light_heading font-semibold">
                    Balance available for withdrawal
                  </p>
                  <p
                    data-tooltip-content="Minimum balance for withdrawl is ₹2000"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-place="top"
                  >
                    <AiFillQuestionCircle className="text-no_focus" />
                  </p>
                </div>
                <h3 className="text-4xl font-bold mb-24">
                  ₹{numberToCurrency(user.balance)}
                </h3>
                <button onClick={handleWithdrawl} className="px-4 py-3 bg-dark_grey hover:bg-light_grey hover:cursor-pointer text-white rounded">
                  Withdraw balance
                </button>
              </div>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-1">
                Earnings & expenses
              </h2>
              <div className="border p-6">
                <div className="border-b-2 pb-4">
                  <div className="flex gap-2 text-sm mb-4">
                    <p className="text-light_heading font-semibold">
                      Earnings to date
                    </p>
                    <p
                      data-tooltip-content="Minimum balance to withdraw is ₹2000"
                      data-tooltip-id="my-tooltip"
                      data-tooltip-place="top"
                    >
                      {/* <AiFillQuestionCircle className="text-no_focus" /> */}
                    </p>
                  </div>
                  <h3 className="text-2xl font-bold">
                    ₹{numberToCurrency(earnings)}
                  </h3>
                  <p className="text-sm mt-1 text-light_heading">
                    Your earnings since joining
                  </p>
                </div>
                <div className="pt-4">
                  <div className="flex gap-2 text-sm mb-4">
                    <p className="text-light_heading font-semibold">
                      Expenses to date
                    </p>
                    <p
                      data-tooltip-content="Minimum balance to withdraw is ₹2000"
                      data-tooltip-id="my-tooltip"
                      data-tooltip-place="top"
                    >
                      {/* <AiFillQuestionCircle className="text-no_focus" /> */}
                    </p>
                  </div>
                  <h3 className="text-2xl font-bold">
                    ₹{numberToCurrency(expenses)}
                  </h3>
                  <p className="text-sm mt-1 text-light_heading">
                    Your expenses since joining
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="border border-b-0 text-sm rounded mt-8">
            <header>
              <ul className="border-b bg-separator p-4 grid gap-4 grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 font-semibold">
                <div className="md:col-span-2 md:grid md:grid-cols-2 md:gap-4">
                  <li>Date</li>
                  <li className="hidden md:inline">Activity</li>
                </div>
                <li className="hidden sm:inline">From / To</li>
                <li className="hidden min-[480px]:inline">Order</li>
                <li className="text-right">Amount</li>
              </ul>
            </header>
            <main>
              <ul>
                {orderList.map((order, index) => (
                  order.status === "Completed" &&
                  <div
                    key={index}
                    className="border-b p-4 py-8 grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4"
                  >
                    <div className="flex flex-col-reverse gap-1 md:col-span-2 md:grid md:grid-cols-2 md:gap-4">
                      <li className="text-xs font-light md:font-normal md:text-sm">
                        {new Date(order.completedAt).toLocaleDateString()}
                      </li>
                      <li className="capitalize">
                        {order.seller._id === user._id ? "Earning" : "Buying"}
                      </li>
                    </div>
                    <li className="hidden sm:inline">
                      {
                        order.seller._id === user._id
                          ? order.buyer.name
                          : order.seller.name 
                      }
                    </li>
                    <li className="hidden min-[480px]:inline uppercase underline hover:cursor-pointer">
                      <Link to={`/orders/${order._id}`} >{order.orderId}</Link>
                    </li>
                    <li
                      className={`text-right font-semibold ${
                        order.seller._id === user._id
                          ? "text-primary"
                          : "text-warning"
                      }`}
                    >
                      ₹{numberToCurrency(order.amount)}
                    </li>
                  </div>
                ))}
              </ul>
            </main>
          </div>
        </div>
      </div>
    )
  );
};
