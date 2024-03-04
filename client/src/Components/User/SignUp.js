import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../Context/User/UserContext";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function SignUp() {
  const navigate = useNavigate();
  useEffect(() => {
    if (Cookies.get("authToken")) {
      alert("First log out please");
      navigate("/");
    }
  }, []);
  const userContext = useContext(UserContext);
  const { signup } = userContext;

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    avatar: "",
  });
  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.password !== user.confirm_password) {
      return alert("Password Mismatch");
    }
    if (user.password.length < 8) {
      return alert("Password must be 8 characters long");
    }
    if (user.avatar == "") {
      return alert("Please choose a profile photo");
    }
    signup(user, setLoading);
  };

  const [loading, setLoading] = useState(false);

  return (
    <>
      {!Cookies.get("authToken") && (
        <div className="loginPageBg">
          <div className="loginFormContainer">
            <form className="loginForm" onSubmit={handleSubmit}>
              <h1>Signup yourself with us</h1>
              <div className="mb-3">
                <label className="form-label" htmlFor="username">
                  Username
                </label>
                <input
                  className="form-control"
                  id="username"
                  name="username"
                  value={user.username}
                  onChange={(e) => onChange(e)}
                />
              </div>

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
              <div className="mb-3">
                <label className="form-label" htmlFor="confirmPassword">
                  ConfirmPassword
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirm_password"
                  value={user.confirm_password}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="avatar">
                  Choose Avatar
                </label>
                <input
                  className="form-control"
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/png,.jpeg,.jpg"
                  onChange={(e) => {
                    if (e.target.files.length>0 &&
                      e.target.files[0].type != "image/jpeg" &&
                      e.target.files[0].type != "image/jpg" &&
                      e.target.files[0].type != "image/png"
                    ) {
                      e.target.value = "";
                      return alert("Only JPG/JPEG/PNG file types are allowed");
                    }
                    setUser({
                      ...user,
                      ["avatar"]: e.target.files[0],
                    });
                  }}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      {loading && <Loader />}
    </>
  );
}
