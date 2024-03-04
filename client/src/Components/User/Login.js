import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../Context/User/UserContext";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Loader";
import Cookies from "js-cookie";

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    if (Cookies.get("authToken")) {
      alert("First log out please");
      navigate("/");
    }
  }, []);
  const userContext = useContext(UserContext);
  const { login, forgetPassword } = userContext;

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      return alert("Please enter credentials to login");
    }
    login(user, setLoading);
  };
  const [loading, setLoading] = useState(false);
  const handleForgetPassword = () => {
    if (!user.email) {
      return alert("Please enter an email");
    }
    let password = prompt("Password");
    let confirm_password = prompt("Confirm Password");
    // console.log(password, confirm_password);
    if (password.length < 8 || confirm_password.length < 8) {
      return alert("Password Must be atleast 8 characters long");
    }

    if (password != confirm_password) {
      return alert("Password Mismatch");
    }
    forgetPassword(user, password, confirm_password, setLoading);
  };
  return (
    <>
     {!Cookies.get("authToken") && <div className="loginPageBg">
        <div className="loginFormContainer">
          <form className="loginForm" onSubmit={handleSubmit}>
            <h1>Login in to your account</h1>

            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                name="email"
                aria-describedby="emailHelp"
                value={user.email}
                onChange={(e) => onChange(e)}
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                name="password"
                id="exampleInputPassword1"
                value={user.password}
                onChange={(e) => onChange(e)}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <br />
            <Link
              style={{ color: "white" }}
              className="my-3"
              onClick={() => {
                handleForgetPassword();
              }}
            >
              Forget Password ?
            </Link>
          </form>
        </div>
      </div>}
      {loading && <Loader />}
    </>
  );
}
