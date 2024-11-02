import React from "react";
import ReactDOM from "react-dom/client";

import App from "./components/App/App";
import SessionProvider from "./context/SessionContext";
import "antd/lib/style/index";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <SessionProvider>
      <App />
    </SessionProvider>
  </React.StrictMode>,
);
