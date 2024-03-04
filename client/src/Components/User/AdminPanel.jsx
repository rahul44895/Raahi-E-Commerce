import React from "react";
import { Link } from "react-router-dom";

export default function AdminPanel() {
  return (
    <div className="container m-3">
      <h1>Admin Panel</h1>
      <div className="d-flex gap-5 flex-wrap">
        <div className="card" style={{ width: "18rem" }}>
          <img
            src={require("../../Images/userPanel.png")}
            className="card-img-top"
            style={{ height: "9rem", objectFit: "cover" }}
          />
          <div className="card-body">
            <div className="d-flex justify-content-between flex-wrap">
              <h5 className="card-title">User Route</h5>
              <Link to="/adminpanel/userRoute" className="btn btn-primary">
                Open
              </Link>
            </div>
          </div>
        </div>
        <div className="card" style={{ width: "18rem" }}>
          <img
            src={require("../../Images/productPanel.png")}
            className="card-img-top"
            style={{ height: "9rem", objectFit: "cover" }}
          />
          <div className="card-body">
            <div className="d-flex justify-content-between flex-wrap">
              <h5 className="card-title">Product Route</h5>
              <Link to="/adminpanel/productRoute" className="btn btn-primary">
                Open
              </Link>
            </div>
          </div>
        </div>
        <div className="card" style={{ width: "18rem" }}>
          <img
            src={require("../../Images/orderRoute.png")}
            className="card-img-top"
            style={{ height: "9rem", objectFit: "cover" }}
          />
          <div className="card-body">
            <div className="d-flex justify-content-between flex-wrap">
              <h5 className="card-title">Order Route</h5>
              <Link to="/viewOrders" className="btn btn-primary">
                Open
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
