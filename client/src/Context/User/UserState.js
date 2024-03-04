import Cookies from "js-cookie";
import UserContext from "./UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const UserState = (props) => {
  const navigate = useNavigate();
  const host = process.env.REACT_APP_HOST;
  const [usersArr, setUsersArr] = useState([]);

  const signup = async (user, setLoading) => {
    setLoading(true);
    let bodyContent = new FormData();
    bodyContent.append("file", user.avatar);
    bodyContent.append("username", user.username);
    bodyContent.append("email", user.email);
    bodyContent.append("password", user.password);
    bodyContent.append("confirm_password", user.confirm_password);
    let response = await fetch(`${host}/api/userRoute/register`, {
      method: "POST",
      body: bodyContent,
      credentials: "include",
    });

    let data = await response.json();
    setLoading(false);
    if (data.success) {
      alert(`Welcome ${Cookies.get("username")}`);
      navigate("/");
    } else {
      alert(data.error);
    }
  };

  const login = async (user, setLoading) => {
    setLoading(true);
    let response = await fetch(`${host}/api/userRoute/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password,
      }),
    });
    let data = await response.json();
    setLoading(false);
    if (data.success) {
      // alert(`Welcome ${Cookies.get("username")}`);
      navigate("/");
    } else {
      alert(data.error);
    }
  };

  const logout = async (setLoading) => {
    setLoading(true);
    let response = await fetch(`${host}/api/userRoute/logout`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    });
    let data = await response.json();
    setLoading(false);
    if (data.success) {
      alert(`Logged Out Successfully`);
      localStorage.clear("orderArr");
      localStorage.clear("shippingInfo");
      navigate("/");
    } else {
      alert(data.error);
    }
  };

  const forgetPassword = async (
    user,
    password,
    confirm_password,
    setLoading
  ) => {
    setLoading(true);
    let response = await fetch("/api/userRoute/forgetPassword", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email: user.email, password, confirm_password }),
    });
    let data = await response.json();
    setLoading(false);
    if (data.success) {
      alert(`${data.message}`);
    } else {
      alert(data.error);
    }
  };

  //getSingleUser
  const getSingleUser = async () => {
    const response = await fetch(`${host}/api/userRoute/getsingleuser`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.success) {
      setUsersArr(data.user);
    } else {
      alert(data.error);
    }
  };

  //update profile
  const updateProfile = async ({ username, avatar }) => {
    console.log({ username, avatar });
    const bodyContent = new FormData();
    bodyContent.append("username", username);
    if (avatar !== "") {
      bodyContent.append("file", avatar);
    }
    // for (const [key, value] of bodyContent) {
    //   console.log(`${key}: ${value}\n`);
    // }
    const response = await fetch(`${host}/api/userRoute/updateprofile`, {
      method: "PUT",
      credentials: "include",
      body: bodyContent,
    });
    const data = await response.json();
    if (data.success) {
      alert("Profile has been successfully updated");
      navigate("/");
    } else {
      alert(data.error);
    }
  };

  //getAllUsers -- ADMIN
  const getAllUsers = async () => {
    let response = await fetch(`${host}/api/userRoute/admin/getAllUsers`, {
      method: "GET",
      credentials: "include",
    });
    let data = await response.json();
    if (data.success) {
      setUsersArr(data.user);
    } else {
      alert(data.error);
      navigate("/");
    }
  };

  //update user Role -- ADMIN

  const updateRole = async (user) => {
    user.role = user.role.toLowerCase();
    if (user.role !== "admin" && user.role !== "user")
      return alert("Only admin or user can be assigned as a role");
    let response = await fetch(`${host}/api/userRoute/admin/updateUserRole`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, role: user.role }),
    });
    let data = await response.json();
    if (data.success) {
      alert(data.message);
      let arrayCopy = JSON.parse(JSON.stringify(usersArr));
      arrayCopy.forEach((ele) => {
        if (ele._id == user.id) {
          ele.role = user.role;
        }
      });
      setUsersArr(arrayCopy);
    } else {
      alert(data.error);
    }
  };

  //delete a user -- ADMIN

  const deleteUser = async (user) => {
    let response = await fetch(`${host}/api/userRoute/admin/deleteuser`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user._id }),
    });
    let data = await response.json();
    if (data.success) {
      alert(data.message);
      let arrayCopy = usersArr.filter((ele) => {
        return ele._id !== user._id;
      });
      setUsersArr(arrayCopy);
    } else {
      alert(data.error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        signup,
        login,
        logout,
        forgetPassword,
        usersArr,
        setUsersArr,
        getAllUsers,
        updateRole,
        deleteUser,
        getSingleUser,
        updateProfile,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
