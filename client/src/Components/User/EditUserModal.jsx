import React from "react";

export default function EditUserModal({
  editUserDetails,
  setEditUserDetails,
  editModalOpen,
  editModalClose,
  handleEditSubmit,
}) {
  const onChange = (e) => {
    setEditUserDetails({ ...editUserDetails, [e.target.name]: e.target.value });
  };
  return (
    <>
      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#UpdateUserRole"
        ref={editModalOpen}
      >
        Update User Role
      </button>

      <div
        className="modal fade"
        id="UpdateUserRole"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Update User Role
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={editModalClose}
              ></button>
            </div>
            <div className="modal-body">
              <form className="loginForm">
                <div className="form-label">
                  User ID
                </div>
                <div className="form-control" name="id" id="id">
                  {editUserDetails.id}
                </div>
                <div className="form-label">
                  Username
                </div>
                <div className="form-control" name="username" id="username">
                  {editUserDetails.username}
                </div>

                <div className="form-label">
                  email
                </div>
                <div className="form-control" name="email" id="email">
                  {editUserDetails.email}
                </div>

                <label htmlFor="role" className="form-label">
                  role
                </label>
                <select
                  className="form-control"
                  name="role"
                  id="role"
                  value={editUserDetails.role}
                  onChange={(e) => {
                    onChange(e);
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleEditSubmit()}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
