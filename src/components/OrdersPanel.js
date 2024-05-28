import React from "react";
import "../styles/OrdersPanel.css";

function OrdersPanel() {
  return (
    <div className="p-4">
      <section className="w-full flex flex-col">
        <h2 className="text-gray-900 font-semibold p-2">Orders</h2>
        <div className="flex flex-row gap-2 flex-nowrap">
          <button className="bg-green-600 w-full order-btn">Buy</button>
          <button className="bg-red-600 w-full order-btn">Sell</button>
        </div>
        <div className="">
          {/* order form */}
          <div>
            <form>
              <fieldset>
                <div className="input-field">
                  <label for="size">Size</label>
                  <input id="size" type="number" placeholder="0.00" />
                </div>
                <div className="input-field">
                  <label for="stop">Stop</label>
                  <input id="stop" type="number" placeholder="0.00" />
                </div>
                <div className="input-field">
                  <label for="limit">Limit</label>
                  <input id="limit" type="number" placeholder="0.00" />
                </div>
                <div>
                  
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrdersPanel;
