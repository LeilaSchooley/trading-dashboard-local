"use client"
import React from "react";
import "../styles/SecuritiesMenu.css";

function SecuritiesMenu() {
  const handleClick = (stock:any) => {
    console.log("Selected:", stock);
    // You can handle navigation or display changes here
  };

  return (
    <div className="securities-menu">
      <ul>
        <li onClick={() => handleClick("AAPL")}>Apple Inc. (AAPL)</li>
        <li onClick={() => handleClick("MSFT")}>Microsoft Corp. (MSFT)</li>
        <li onClick={() => handleClick("AMZN")}>Amazon.com Inc. (AMZN)</li>
        {/* Add more stocks with onClick handlers as needed */}
      </ul>
    </div>
  );
}

export default SecuritiesMenu;
