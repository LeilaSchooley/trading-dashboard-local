import React from "react";
import Link from "next/link";
import "../styles/TopNav.css";

function TopNav() {
  return (
    <nav>
      <button>Display Stock</button>
      <Link href="/orders">Orders</Link>
      <Link href="/strategies">Strategies</Link>
      {/* Add more links as needed */}
    </nav>
  );
}

export default TopNav;
