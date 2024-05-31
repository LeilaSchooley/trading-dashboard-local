"use client"
import SecuritiesMenu from "@/components/SecuritiesMenu"
import TopNav from "@/components/TopNav"
import OrdersPanel from "@/components/OrdersPanel";
import  OrderBook  from "@/components/OrderBook";
import Candlestick from "@/components/charts/Candlestick";
import FillsPane from "@/components/FillsPane"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState,useEffect } from "react";
export default function Home() {
  const [pendingOrders,setPendingOrders] = useState([])
  const [symbol,setSymbol] = useState("APPL")
  const pushOrder = (order:any)=>{
    setPendingOrders([...pendingOrders,{...order,symbol,date:Date.now()}])
  }
  const selectSymbol = (symbol:string)=>{
    setSymbol(symbol)
  }
  return (
    <Tabs defaultValue="home">
      <TabsList className="w-full justify-start">
        <div className="p-2">{symbol}</div>
        <TabsTrigger value="home">Pricing</TabsTrigger>
        <TabsTrigger value="markets">Markets</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
      </TabsList>

      <TabsContent value="home">
      <div className=" grid lg:grid-cols-12 gap-2 w-full lg:grid-rows-2 h-100">
          <div className="col-span-2 row-span-2 ">
              <SecuritiesMenu symbol={symbol} setter={selectSymbol}  />
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
      </TabsContent>
    </Tabs>
  );
}
