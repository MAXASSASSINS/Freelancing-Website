import React, { useState, useEffect, useRef } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { getUser, loadUser, updateUser } from "../../actions/userAction";
import { Link, redirect, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/axiosInstance";
import { numberToCurrency } from "../../utility/util";
import {
  useGlobalLoading,
  useUpdateGlobalLoading,
} from "../../context/globalLoadingContext";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import AnimatedCheck from "../AnimatedCheck/AnimatedCheck";

export const BalanceDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const globalLoading = useGlobalLoading();
  const updateGlobalLoading = useUpdateGlobalLoading();
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false);
  const [openConfirmWithdrawModal, setOpenConfirmWithdrawModal] =
    useState(false);
  const [widthdrawAmount, setWithdrawAmount] = useState(0);
  const [openWithdrawSuccessModal, setOpenWithdrawSuccessModal] =
    useState(false);

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
      updateGlobalLoading(true);

      const { data } = await axiosInstance.post("/orders/me", {
        status: "Completed",
      });
      console.log(data);
      setOrderList(data.orders);
    } catch (err) {
      console.log(err);
    } finally {
      updateGlobalLoading(false);
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
    setOpenConfirmWithdrawModal(false);
    setOpenWithdrawModal(false);
    updateGlobalLoading(true);
    try {
      const { data } = await axiosInstance.post("/withdrawl", {
        amount: widthdrawAmount,
      });
      console.log(data);
      setOpenWithdrawSuccessModal(true);
      dispatch(updateUser(data.user));
    } catch (err) {
      console.log(err.response.data.message);
      toast.error(err.response.data.message);
    } finally {
      updateGlobalLoading(false);
    }
  };

  return (
    isAuthenticated && (
      <>
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
                  {user.razorPayAccountDetails.status === "new" ? (
                    <button
                      onClick={() => navigate("/bank_account")}
                      className="px-4 py-3 bg-dark_grey hover:bg-light_grey hover:cursor-pointer text-white rounded"
                    >
                      Add bank account
                    </button>
                  ) : user.razorPayAccountDetails.status === "activated" ? (
                    <button
                      onClick={() => {
                        if (!user.withdrawEligibility) {
                          toast.error("Minimum balance for withdrawl is ₹2000");
                          return;
                        }
                        setOpenWithdrawModal(true);
                      }}
                      className="px-4 py-3 bg-dark_grey hover:bg-light_grey hover:cursor-pointer text-white rounded"
                    >
                      Withdraw balance
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/bank_account")}
                      className="px-4 py-3 bg-dark_grey hover:bg-light_grey hover:cursor-pointer text-white rounded"
                    >
                      Update bank details
                    </button>
                  )}
                </div>
              </section>
              <section className="">
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
                {orderList?.length > 0 ? (
                  <ul>
                    {orderList.map(
                      (order, index) =>
                        order.status === "Completed" && (
                          <div
                            key={index}
                            className="border-b p-4 py-8 grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4"
                          >
                            <div className="flex flex-col-reverse gap-1 md:col-span-2 md:grid md:grid-cols-2 md:gap-4">
                              <li className="text-xs font-light md:font-normal md:text-sm">
                                {new Date(
                                  order.completedAt
                                ).toLocaleDateString()}
                              </li>
                              <li className="capitalize">
                                {order.seller._id === user._id
                                  ? "Earning"
                                  : "Buying"}
                              </li>
                            </div>
                            <li className="hidden sm:inline">
                              {order.seller._id === user._id
                                ? order.buyer.name
                                : order.seller.name}
                            </li>
                            <li className="hidden min-[480px]:inline uppercase underline hover:cursor-pointer">
                              <Link to={`/orders/${order._id}`}>
                                {order.orderId}
                              </Link>
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
                        )
                    )}
                  </ul>
                ) : (
                  <div className="flex justify-center border-b items-center h-56">
                    <p className="text-base text-no_focus">
                      No transactions yet
                    </p>
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>
        {openWithdrawModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white min-w-[80%] sm:min-w-[28rem] p-8 rounded-lg relative">
              <IoClose
                className="absolute top-4 right-4 text-2xl hover:cursor-pointer"
                onClick={() => setOpenWithdrawModal(false)}
              />
              <h2 className="text-xl mb-4 font-semibold">Withdraw Funds</h2>
              <input
                type="number"
                step={5}
                placeholder="Enter amount"
                className="w-full border p-3 rounded mb-4"
                max={user.balance}
                value={widthdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />

              <button
                onClick={() => {
                  if (widthdrawAmount > user.balance) {
                    toast.error("Insufficient balance");
                    return;
                  }
                  if (widthdrawAmount < 100) {
                    toast.error("Minimum withdrawl amount is ₹100");
                    return;
                  }
                  setOpenWithdrawModal(false);
                  setOpenConfirmWithdrawModal(true);
                }}
                className="px-6 mt-4 flex justify-end ml-auto py-3 bg-dark_grey hover:bg-light_grey hover:cursor-pointer text-white rounded"
              >
                Withdraw
              </button>
            </div>
          </div>
        )}
        {openConfirmWithdrawModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white min-w-[80%] sm:min-w-[28rem] p-6 rounded-lg relative">
              <IoClose
                className="absolute top-4 right-4 text-lg hover:cursor-pointer"
                onClick={() => setOpenConfirmWithdrawModal(false)}
              />
              <p className="text-lg text-light_heading mb-4">
                Are you sure you want to withdraw{" "}
                <span className="">₹{widthdrawAmount}?</span>
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setOpenConfirmWithdrawModal(false);
                    setOpenWithdrawModal(true);
                  }}
                  className="px-6 mt-4 flex justify-end ml-auto py-3 text-dark_grey hover:underline  hover:cursor-pointer  rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdrawl}
                  className="px-6 mt-4 flex justify-end py-3 bg-primary hover:bg-primary_hover hover:cursor-pointer text-white rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {openWithdrawSuccessModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white min-w-[80%] sm:min-w-[28rem] sm:max-w-[32rem] p-6 rounded-lg relative">
              <IoClose
                className="absolute top-4 right-4 text-lg hover:cursor-pointer"
                onClick={() => setOpenWithdrawSuccessModal(false)}
              />
              <p className="text-xl text-light_heading">Withdrawl successful</p>
              <p className="text-light_heading leading-5 mt-1 mb-4">
                We recieved you request and amount will be transferred to your
                account withing 15 working days.
              </p>
              <div>
                <AnimatedCheck />
              </div>
              <button
                onClick={() => setOpenWithdrawSuccessModal(false)}
                className="px-6 mt-4 flex justify-end ml-auto py-3 bg-primary hover:bg-primary_hover hover:cursor-pointer text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </>
    )
  );
};
