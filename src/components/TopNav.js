import React from "react";
import { NavLink } from "react-router-dom";

function TopNav() {
  return (
    <nav>
      <button>Display Stock</button>
      <NavLink to="/orders">Orders</NavLink>
      <NavLink to="/strategies">Strategies</NavLink>
      {/* Add more links as needed */}
    </nav>
  );
}

export default TopNav;
