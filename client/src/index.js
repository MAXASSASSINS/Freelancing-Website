import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { GlobalLoadingProvider } from "./context/globalLoadingContext.js";
import { GlobalErrorProvider } from "./context/globalErrorContext.js";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <GlobalErrorProvider>
        <GlobalLoadingProvider>
          <App />
        </GlobalLoadingProvider>
      </GlobalErrorProvider>
    </Provider>
  </BrowserRouter>
);
