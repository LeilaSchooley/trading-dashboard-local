import React from 'react';
import '@/styles/Orderbook.css';

const FillsPane = ({ pendingOrders }) => {
  return (
    <div className="mx-auto h-56 relative max-h-56 overflow-scroll .table-container">
      <table className="min-w-full bg-gray-500">
        <thead className='sticky top-0 z-10 bg-gray-500'>
          <tr className="border-b border-gray-600">
            <th className="py-2 px-2 text-left text-gray-300 text-xs border-r border-gray-600">Symbol</th>
            <th className="py-2 px-2 text-left text-gray-300 text-xs border-r border-gray-600">Date</th>
            <th className="py-2 px-2 text-left text-gray-300 text-xs border-r border-gray-600">Type</th>
            <th className="py-2 px-2 text-left text-gray-300 text-xs border-r border-gray-600">Stop</th>
            <th className="py-2 px-2 text-left text-gray-300 text-xs border-r border-gray-600">Size</th>
            <th className="py-2 px-2 text-left text-gray-300 text-xs border-r border-gray-600">Limit</th>
            <th className="py-2 px-2 text-left text-gray-300 text-xs border-r border-gray-600">Filled (%)</th>
          </tr>
        </thead>
        <tbody>
          {pendingOrders.map((order, index) => (
            <tr key={index} className={`border-b bg-white even:bg-gray-300 font-bold hover:bg-gray-600 border-gray-600 ${order.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
              <td className="py-1 px-2 text-xs">{order.symbol}</td>
              <td className="py-1 px-2 text-xs">{new Date(order.date).toLocaleString()}</td>
              <td className="py-1 px-2 text-xs">{order.type.charAt(0).toUpperCase() + order.type.slice(1)}</td>
              <td className="py-1 px-2 text-xs">{order.stop}</td>
              <td className="py-1 px-2 text-xs">{order.size}</td>
              <td className="py-1 px-2 text-xs">{order.limit}</td>
              <td className="py-1 px-2 text-xs">{Math.random()*10}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FillsPane;
