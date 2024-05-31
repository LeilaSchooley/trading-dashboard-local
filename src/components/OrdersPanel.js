"use client"
import React from "react";
import "../styles/OrdersPanel.css";
import { useState } from "react";

function OrdersPanel({setOrder}) {
  const[orderType, setOrderType] = useState("Buy")
  const [size,setSize] = useState(0)
  const [stop,setStop] = useState(0)
  const [limit,setLimit] = useState(0)

  const setOrderType_ = (orderType) => () => {
    setOrderType(orderType);
  };
  const submit = () => {
    setOrder({
      type: orderType,
      size: size,
      stop: stop,
      limit: limit
    })
  }
  return (
    <div className="p-4">
      <section className="w-full flex flex-col">
        <h2 className="text-gray-900 font-semibold p-2">Orders</h2>
        <div className="flex flex-row gap-2 flex-nowrap">
        <button onClick={setOrderType_("Buy")} className="bg-green-600 w-full order-btn">Buy</button>
          <button onClick={setOrderType_("Sell")} className="bg-red-600 w-full order-btn">Sell</button>
          </div>
        <div className="">
          {/* order form */}
          <div>
  
              <fieldset>
                <div className="input-field">
                  <label htmlFor="size">Size</label>
                  <input id="size" value={size} onChange={(e)=>{setSize(e.target.value)}} type="number" placeholder="0.00" />
                </div>
                <div className="input-field">
                  <label htmlFor="stop">Stop</label>
                  <input id="stop" value={stop} onChange={(e)=>{setStop(e.target.value)}}  type="number" placeholder="0.00" />
                </div>
                <div className="input-field">
                  <label htmlFor="limit">Limit</label>
                  <input id="limit" value={limit} onChange={(e)=>{setLimit(e.target.value)}}  type="number" placeholder="0.00" />
                </div>
                <div>
                  <button onClick={submit} className="w-full bg-gray-800 text-white p-2">Place {orderType} Order </button>
                </div>
              </fieldset>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrdersPanel;
