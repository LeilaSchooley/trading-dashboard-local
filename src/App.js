import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BaseTemplate from "./components/BaseTemplate";
import OrdersPanel from "./components/OrdersPanel";
import SecuritiesMenu from "./components/SecuritiesMenu";
import TopNav from "./components/TopNav";
import "./styles/GlobalStyles.css"; // Import at the top

function App() {
  return (
    <Router>
      <TopNav />
      <BaseTemplate>
        <SecuritiesMenu />
        <Routes>
          <Route path="/orders" element={<OrdersPanel />} />
          {/* Define more routes as needed */}
        </Routes>
      </BaseTemplate>
    </Router>
  );
}

export default App;
