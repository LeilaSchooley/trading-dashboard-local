"use client"
import React from "react";
import "../styles/SecuritiesMenu.css";

function SmenuLi({symbol,name,ticker}) {
  const handleClick = (stock:any) => {
      setter(stock);
  };

  return (
        <li className={symbol == ticker?'selected':''} onClick={() => handleClick(ticker)}>{name} ({ticker})</li>

  );
}

export default SmenuLi;
