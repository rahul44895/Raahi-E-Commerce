import React, { useContext, useEffect, useState } from "react";
import OrderItemsCard from "./OrderItemsCard";
import OrderContext from "../../Context/Order/OrderContext";
import { Link } from "react-router-dom";

export default function ViewCart() {
  const orderContext = useContext(OrderContext);
  const { orders, itemsPrice, getLocalOrders } = orderContext;
  useEffect(() => {
    getLocalOrders();
  }, []);
  return (
    <>
      <div className="container m-3">
        {orders.length == 0 && (
          <h1>Explore our selection to fill your cart with more items.</h1>
        )}
        {orders.length != 0 && (
          <div>
            <h1>Your cart items</h1>
            <div className="d-flex flex-wrap container mt-3">
              {orders.map((item) => {
                return <OrderItemsCard item={item} key={item.product} />;
              })}
            </div>
            <div>
              <h1>Total Price : Rs. {itemsPrice}</h1>
              <Link className="btn btn-primary" to="/shippingDetails">Place Order</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
