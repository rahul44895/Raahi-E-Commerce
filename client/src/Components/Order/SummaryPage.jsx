import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import OrderContext from "../../Context/Order/OrderContext";

export default function SummaryPage() {
  const [loading, setLoading] = useState(false);
  const orderContext = useContext(OrderContext);
  const {
    getLocalOrders,
    orders,
    itemsPrice,
    taxPrice,
    shippingPrice,
    placeOrder,
  } = orderContext;
  const [shippingInfo, setShippingInfo] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("shippingInfo")) {
      navigate("/");
      return alert("First place some orders");
    }
    setShippingInfo(JSON.parse(localStorage.getItem("shippingInfo")));
    getLocalOrders(setLoading);
  }, []);
  return (
    <div className="container m-3">
      {loading && <Loader />}

      <h1>Shipping Details</h1>
      <div>Address : {shippingInfo.address}</div>
      <div>City : {shippingInfo.city}</div>
      <div>State : {shippingInfo.state}</div>
      <div>Country : {shippingInfo.country}</div>
      <div>PinCode : {shippingInfo.pincode}</div>
      <div>Phone : {shippingInfo.phoneNo}</div>
      <hr />
      <h1>Order Items</h1>
      <div className="d-flex flex-wrap">
        {orders.map((item) => {
          return (
            <div
              className="card m-3"
              style={{ maxWidth: "540px" }}
              key={item.product}
            >
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={item.image}
                    className="img-fluid rounded-start"
                    style={{
                      height: "10rem",
                      width: "10rem",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title">{item.name}</h5>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className="card-text">Price: Rs. {item.price}</p>
                      <p className="card-text">
                        Qty:
                        {item.qty}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <hr />
      <div className="d-flex justify-content-between">
        <h6>Items Price : Rs. {itemsPrice}</h6>
        <h6>Tax Price : Rs. {taxPrice}</h6>
        <h6>Shipping Price : Rs. {shippingPrice}</h6>
      </div>
      <div className="d-flex justify-content-between my-3">
        <h1>
          Grand Total : Rs. {Math.round(itemsPrice + taxPrice + shippingPrice)}
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            placeOrder(setLoading);
          }}
        >
          Proceed to Pay
        </button>
      </div>
    </div>
  );
}
