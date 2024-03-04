import React, { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../../Context/User/UserContext";
import EditUserModal from "./EditUserModal";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function UserPanelModalCreateProduct() {
  const userContext = useContext(UserContext);
  const { usersArr, getAllUsers, updateRole, deleteUser } = userContext;

  const navigate = useNavigate();
  useEffect(() => {
    if (Cookies.get("role") !== "admin") {
      alert("Only authorized users can access this page");
      navigate("/");
    } else {
      getAllUsers();
    }
  }, []);

  const editModalOpen = useRef();
  const editModalClose = useRef();

  const [editUserDetails, setEditUserDetails] = useState({
    username: "",
    email: "",
    role: "",
    id: "",
  });

  const handleEditUserModal = (e) => {
    setEditUserDetails({
      username: e.username,
      email: e.email,
      role: e.role,
      id: e._id,
    });
    editModalOpen.current.click();
  };
  const handleDeleteUser = (e) => {
    deleteUser(e);
  };

  const handleEditSubmit = () => {
    // console.log(editUserDetails);
    updateRole(editUserDetails);
    editModalClose.current.click();
  };

  return (
    <>
      {usersArr && usersArr.length !== 0 && Cookies.get("role") === "admin" && (
        <div className="container m-3">
          <table>
            <tbody>
              <tr>
                <td className="p-3">
                  <h5>Username</h5>
                </td>
                <td className="p-3">
                  <h5>Email</h5>
                </td>
                <td className="p-3">
                  <h5>Role</h5>
                </td>
                <td className="p-3">
                  <h5>Edit</h5>
                </td>
                <td className="p-3">
                  <h5>Delete</h5>
                </td>
              </tr>
              {usersArr.length !== 0 &&
                usersArr.map((e) => {
                  return (
                    <tr style={{ borderBottom: "1px solid black" }} key={e._id}>
                      <td className="p-3">
                        <img
                          src={e.avatar.url}
                          style={{
                            height: "50px",
                            width: "50px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginRight: "10px",
                          }}
                        />
                        {e.username}
                      </td>
                      <td className="p-3">{e.email}</td>
                      <td className="p-3">{e.role}</td>
                      <td
                        className="p-3"
                        onClick={() => {
                          handleEditUserModal(e);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <button className="btn btn-primary">Edit</button>
                      </td>
                      <td
                        onClick={() => {
                          handleDeleteUser(e);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <button className="btn btn-primary">Delete</button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <EditUserModal
            editUserDetails={editUserDetails}
            setEditUserDetails={setEditUserDetails}
            editModalOpen={editModalOpen}
            editModalClose={editModalClose}
            handleEditSubmit={handleEditSubmit}
          />
        </div>
      )}
    </>
  );
}
