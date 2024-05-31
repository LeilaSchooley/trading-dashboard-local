"use client"
import React from "react";
import "../styles/SecuritiesMenu.css";

function SecuritiesMenu({symbol,setter}) {
  const handleClick = (stock:any) => {
      setter(stock);
  };

  return (
    <div className="securities-menu">
      <ul>
        <li className={symbol == "AAPL"?'selected':''} onClick={() => handleClick("AAPL")}>Apple Inc. (AAPL)</li>
        <li className={symbol == "MSFT"?'selected':''} onClick={() => handleClick("MSFT")}>Microsoft Corp. (MSFT)</li>
        <li className={symbol == "AMZN"?'selected':''} onClick={() => handleClick("AMZN")}>Amazon.com Inc. (AMZN)</li>
      </ul>
    </div>
  );
}

export default SecuritiesMenu;
