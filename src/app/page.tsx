"use client"
import SecuritiesMenu from "@/components/SecuritiesMenu"
import TopNav from "@/components/TopNav"
import OrdersPanel from "@/components/OrdersPanel";
import  OrderBook  from "@/components/OrderBook";
import Candlestick from "@/components/charts/Candlestick";
import FillsPane from "@/components/FillsPane"
import { useState,useEffect } from "react";
export default function Home() {
  const [pendingOrders,setPendingOrders] = useState([])
  const [symbol,setSymbol] = useState("APPL")
  const pushOrder = (order:any)=>{
    setPendingOrders([...pendingOrders,{...order,symbol,date:Date.now()}])
  }

  return (
      <main className=" h-screen">
        <TopNav price={100} stock={"APPL"}/>
        <div className=" grid lg:grid-cols-12 gap-2 w-full lg:grid-rows-2 h-100">
          <div className="col-span-2 row-span-2 ">
              <SecuritiesMenu />
          </div>
          <div className="col-span-7 row-span-2  overflow-scroll">
            <Candlestick/>  
            <FillsPane pendingOrders={pendingOrders} />
            <OrderBook/>
          </div>
          <div className="col-span-3 row-span-2">
            <OrdersPanel setOrder={pushOrder} />

          </div>
        </div>
      </main>
  );
}
