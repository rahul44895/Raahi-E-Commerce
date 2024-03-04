import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ShippingDetails() {
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    phoneNo: "",
  });

  const onChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.country ||
      !shippingInfo.pincode ||
      !shippingInfo.phoneNo
    ) {
      return alert("Enter all the details first");
    }
    localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
    navigate("/summary");
  };
  return (
    <>
      <form className="container" onSubmit={(e) => handleSubmit(e)}>
      <h1>Shipping Details</h1>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            name="address"
            id="address"
            onChange={(e) => onChange(e)}
            value={shippingInfo.address}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="city" className="form-label">
            city
          </label>
          <input
            type="text"
            className="form-control"
            name="city"
            id="city"
            onChange={(e) => onChange(e)}
            value={shippingInfo.city}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="state" className="form-label">
            state
          </label>
          <input
            type="text"
            className="form-control"
            name="state"
            id="state"
            onChange={(e) => onChange(e)}
            value={shippingInfo.state}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="country" className="form-label">
            country
          </label>
          <input
            type="text"
            className="form-control"
            name="country"
            id="country"
            onChange={(e) => onChange(e)}
            value={shippingInfo.country}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="pincode" className="form-label">
            pincode
          </label>
          <input
            type="text"
            className="form-control"
            name="pincode"
            id="pincode"
            onChange={(e) => onChange(e)}
            value={shippingInfo.pincode}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNo" className="form-label">
            phoneNo
          </label>
          <input
            type="phone"
            className="form-control"
            name="phoneNo"
            id="phoneNo"
            onChange={(e) => onChange(e)}
            value={shippingInfo.phoneNo}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Proceed
        </button>
      </form>
    </>
  );
}
