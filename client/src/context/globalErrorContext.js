// import React, { createContext, useEffect, useState, useContext } from "react";
// import { useSelector } from "react-redux";

// const GlobalErrorContext = createContext();
// const UpdateGlobalErrorContext = createContext();

// export const useGlobalError = () => {
//   return useContext(GlobalErrorContext);
// };

// export const useUpdateGlobalError = () => {
//   return useContext(UpdateGlobalErrorContext);
// };

// export const GlobalErrorProvider = ({ children }) => {
//   const [globalError, setglobalError] = useState("");

//   const { gigError } = useSelector((state) => state.gigs || {});
//   const { gigError: gigDetailError } = useSelector(
//     (state) => state.gigDetail || {}
//   );
//   const { gigError: userGigslError } = useSelector(
//     (state) => state.userGigs || {}
//   );

//   const { userError } = useSelector((state) => state.user || {});
//   const { userError: gigUserError } = useSelector(
//     (state) => state.gigUser || {}
//   );

//   const { orderError } = useSelector((state) => state.order || {});
//   const { orderError: orderDetailError } = useSelector(
//     (state) => state.orderDetail || {}
//   );

//   // useEffect(() => {
//   //   if (
//   //     gigError ||
//   //     orderError ||
//   //     gigDetailError ||
//   //     userGigslError ||
//   //     gigUserError ||
//   //     orderDetailError
//   //   ) {
//   //     setglobalError("Oops something went wrong");
//   //   } else {
//   //     setglobalError("");
//   //   }
//   // }, [
//   //   gigError,
//   //   orderError,
//   //   gigDetailError,
//   //   userGigslError,
//   //   gigUserError,
//   //   orderDetailError,
//   // ]);

//   const updateglobalError = (val) => {
//     setglobalError(val);
//   };

//   return (
//     <GlobalErrorContext.Provider value={globalError}>
//       <UpdateGlobalErrorContext.Provider value={updateglobalError}>
//         {children}
//       </UpdateGlobalErrorContext.Provider>
//     </GlobalErrorContext.Provider>
//   );
// };
