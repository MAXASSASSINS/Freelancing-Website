import React, { createContext, useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";

const GlobalLoadingContext = createContext();
const GlobalLoadingTextContext = createContext();
const UpdateGlobalLoadingContext = createContext();

export const useGlobalLoading = () => {
  return useContext(GlobalLoadingContext);
};

export const useGlobalLoadingText = () => {
  return useContext(GlobalLoadingTextContext);
};

export const useUpdateGlobalLoading = () => {
  return useContext(UpdateGlobalLoadingContext);
};

export const GlobalLoadingProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalLoadingText, setGlobalLoadingText] = useState("");

  const { gigLoading } = useSelector((state) => state.gigs || {});
  const { gigLoading: gigDetailLoading } = useSelector(
    (state) => state.gigDetail || {}
  );
  const { gigLoading: userGigslLoading } = useSelector(
    (state) => state.userGigs || {}
  );

  const { userLoading } = useSelector((state) => state.user || {});
  const { userLoading: gigUserLoading } = useSelector(
    (state) => state.gigUser || {}
  );

  const { orderLoading } = useSelector((state) => state.order || {});
  const { orderLoading: orderDetailLoading } = useSelector(
    (state) => state.orderDetail || {}
  );

  useEffect(() => {
    if (
      gigLoading ||
      userLoading ||
      orderLoading ||
      gigDetailLoading ||
      userGigslLoading ||
      gigUserLoading ||
      orderDetailLoading
    ) {
      // setGlobalLoading(true);
      updateGlobalLoading(true);
    } else {
      // setGlobalLoading(false);
      updateGlobalLoading(false);
    }
  }, [
    gigLoading,
    userLoading,
    orderLoading,
    gigDetailLoading,
    userGigslLoading,
    gigUserLoading,
    orderDetailLoading,
  ]);

  const updateGlobalLoading = (val, text = "") => {
    console.log(text);
    setGlobalLoading(val);
    setGlobalLoadingText(text);
  };

  return (
    <GlobalLoadingContext.Provider value={globalLoading}>
      <GlobalLoadingTextContext.Provider value={globalLoadingText}>
        <UpdateGlobalLoadingContext.Provider value={updateGlobalLoading}>
          {children}
        </UpdateGlobalLoadingContext.Provider>
      </GlobalLoadingTextContext.Provider>
    </GlobalLoadingContext.Provider>
  );
};
