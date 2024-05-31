import React from "react";
import Link from "next/link";
import "../styles/TopNav.css";

function TopNav( {stock, price} ) {
  return (
    <nav>
      <div className="stockpair">{stock}</div>

      
      <Link href="/orders">Orders</Link>
      <Link href="/strategies">Strategies</Link>
      {/* Add more links as needed */}
    </nav>
  );
}

export default TopNav;
