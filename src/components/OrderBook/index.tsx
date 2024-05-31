import React, { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import '@/styles/Orderbook.css';


const generateOrders = (type, count) => {
  return Array.from({ length: count }, () => ({
    id: faker.datatype.uuid(),
    date: faker.date.recent(),
    price: faker.finance.amount(50, 150, 2),
    amount: faker.finance.amount(1, 100, 2),
    total: function() { return (parseFloat(this.price) * parseFloat(this.amount)).toFixed(2); },
    type,
  }));
};

const OrderBook = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders([...generateOrders('buy', 10), ...generateOrders('sell', 10)]);
  }, []);

  return (
    <div className=" mx-auto h-56 relative max-h-56 overflow-scroll .table-container ">
      <table className="min-w-full bg-gray-500">
        <thead className='sticky top-0 z-10 bg-gray-500'>
          <tr className="border-b border-gray-600">
            <th className="py-2 px-2 text-left text-gray-300 text-xs border-r border-gray-600">Date</th>
            <th className="py-2 px-2 text-left text-gray-300 text-xs border-r border-gray-600">Type</th>
            <th className="py-2 px-2 text-left text-gray-300 text-xs border-r border-gray-600">Price</th>
            <th className="py-2 px-2 text-left text-gray-300 text-xs border-r border-gray-600">Amount</th>
            <th className="py-2 px-2 text-left text-gray-300 text-xs">Total</th>
          </tr>
        </thead>
        <tbody className=''>
          {orders.map((order, index) => (
            <tr key={index} className={`border-b  bg-white even:bg-gray-300 font-bold hover:bg-gray-600 border-gray-600 ${order.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
              <td className="py-1 px-2 text-xs">{order.date.toLocaleString()}</td>
              <td className="py-1 px-2 text-xs">{order.type.charAt(0).toUpperCase() + order.type.slice(1)}</td>
              <td className="py-1 px-2 text-xs">${order.price}</td>
              <td className="py-1 px-2 text-xs">{order.amount}</td>
              <td className="py-1 px-2 text-xs">${order.total()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderBook;
