import React, { useContext } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

export default function ProductCard({ product, addToCart }) {
  return (
    <>
      <div
        className="card m-3"
        style={{
          width: " 18rem",
        }}
      >
        <img
          src={product.images[0].url}
          className="card-img-top"
          style={{ height: "11rem", objectFit: "cover" }}
        />
        <div className="card-body">
          <h5 className="card-title">
            {product.name < 20
              ? product.name
              : product.name.slice(0, 20) + "..."}
          </h5>
          <p className="card-text">
            {product.description.length < 60
              ? product.description
              : product.description.slice(0, 60) + "..."}
          </p>
          <p className="card-text">Rs.{product.price}</p>
          <button
            className="btn btn-primary mx-3"
            onClick={() => {
              if (!Cookies.get("authToken")) return alert("login first");
              else addToCart({ product, qty: 1 });
            }}
            disabled={product.stock === 0}
          >
            Add To Cart
          </button>
          <Link
            to={`/viewProduct/${product._id}`}
            className="btn btn-primary mx-3"
          >
            View
          </Link>
        </div>
      </div>
    </>
  );
}
