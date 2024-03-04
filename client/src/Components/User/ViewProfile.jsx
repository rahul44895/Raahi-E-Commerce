import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../Context/User/UserContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function ViewProfile() {
  const userContext = useContext(UserContext);
  const { usersArr, setUsersArr, getSingleUser, updateProfile } = userContext;

  const navigate = useNavigate();
  useEffect(() => {
    if (!Cookies.get("username")) {
      return navigate("/login");
    }
    getSingleUser();
  }, []);

  const [newAvatar, setNewAvatar] = useState("");
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (usersArr.username.length < 3) {
      return alert("Username name must be atleast 3 characters long");
    }
    updateProfile({ username: usersArr.username, avatar: newAvatar });
  };
  return (
    <>
      {usersArr.length !== 0 && (
        <div className="card mb-3" style={{ maxWidth: "540px" }}>
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src={usersArr.avatar.url}
                className="img-fluid rounded-start"
              />
            </div>
            <div className="col-md-8">
              <form
                className="card-body"
                onSubmit={(e) => {
                  handleUpdateProfile(e);
                }}
              >
                <div className="mb-3">
                  <label className="form-label" htmlFor="username">
                    <h6>Username</h6>
                  </label>
                  <input
                    id="username"
                    name="username"
                    className="form-control"
                    value={usersArr.username}
                    onChange={(e) => {
                      setUsersArr({
                        ...usersArr,
                        [e.target.name]: e.target.value,
                      });
                    }}
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
                      if (
                        e.target.files.length > 0 &&
                        e.target.files[0].type != "image/jpeg" &&
                        e.target.files[0].type != "image/jpg" &&
                        e.target.files[0].type != "image/png"
                      ) {
                        e.target.value = "";
                        return alert(
                          "Only JPG/JPEG/PNG file types are allowed"
                        );
                      }
                      setNewAvatar(e.target.files[0]);
                    }}
                  />
                </div>
                <button className="btn btn-primary" type="Submit">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
