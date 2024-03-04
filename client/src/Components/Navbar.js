import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../Context/User/UserContext";
import Cookies from "js-cookie";
import Loader from "./Loader";
import ProductContext from "../Context/Product/ProductContext";

export default function Navbar() {
  const userContext = useContext(UserContext);
  const { logout, getOrdersSingleUser } = userContext;
  const productContext = useContext(ProductContext);
  const { getAllProducts } = productContext;
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const onChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(search);
    getAllProducts({ keyword: search });
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Raahi E-commerce
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
            </ul>
            <div>
              <img
                src={
                  Cookies.get("profilePicture") ||
                  require("../Images/profilePicIcon.webp")
                }
                className="nav_profilePic"
              />
            </div>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {Cookies.get("username")
                  ? Cookies.get("username")
                  : "Guest User"}
              </button>
              <ul className="dropdown-menu">
                {!Cookies.get("username") && (
                  <li>
                    <Link className="dropdown-item" to="/login">
                      Login
                    </Link>
                  </li>
                )}
                {!Cookies.get("username") && (
                  <li>
                    <Link className="dropdown-item" to="/signup">
                      SignUp
                    </Link>
                  </li>
                )}

                {Cookies.get("username") && (
                  <li>
                    <Link to="/viewOrders" className="dropdown-item">
                      View Orders
                    </Link>
                  </li>
                )}
                {Cookies.get("username") && (
                  <li>
                    <Link to="/viewProfile" className="dropdown-item">
                      Your Profile
                    </Link>
                  </li>
                )}
                {Cookies.get("role") && Cookies.get("role") == "admin" && (
                  <li>
                    <Link to="/adminpanel" className="dropdown-item">
                      Admin Panel
                    </Link>
                  </li>
                )}

                {Cookies.get("username") && (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        logout(setLoading);
                      }}
                    >
                      Logout
                    </button>
                  </li>
                )}
              </ul>
            </div>
            <Link className="btn btn-outline-primary mx-2" to="/viewCart">
              View Cart
            </Link>
            <form className="d-flex" role="search" onSubmit={handleSubmit}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                name="Search"
                value={search}
                onChange={(e) => onChange(e)}
              />
              <button className="btn btn-outline-primary" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
      {loading && <Loader />}
    </>
  );
}
