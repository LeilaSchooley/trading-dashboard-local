
import SecuritiesMenu from "@/components/SecuritiesMenu"
import TopNav from "@/components/TopNav"
import Candlestick from "@/components/charts/Candlestick";
import OrdersPanel from "@/components/OrdersPanel";
import { OrderBook } from "@/components/OrderBook";
export default function Home() {
  return (
      <main>
        <TopNav/>
        <div className=" grid lg:grid-cols-12 w-full lg:grid-rows-1">
          <div className="col-span-3 border border-blue-600">
              <SecuritiesMenu />
          </div>
          <div className="col-span-6 border border-red-600">
            <Candlestick/>  
            <OrderBook/>
          </div>
          <div className="col-span-3  border border-pink-600">
            <OrdersPanel />

          </div>
        </div>
      </main>
  );
}
