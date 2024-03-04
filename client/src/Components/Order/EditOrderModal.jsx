import React, { useState } from "react";

export default function EditOrderModal({
  editOrderBtn,
  editOrderBtnCLose,
  editableData,
  handleSubmit,
}) {
  const [status, setStatus] = useState(editableData.orderStatus);
  const handleEdit = (e) => {
    setStatus(e.target.value);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        ref={editOrderBtn}
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Update Order Status
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={editOrderBtnCLose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-between my-3">
                <h3>Order Status</h3>
                {editableData.length !== 0 && (
                  <select
                    className="form-control w-50"
                    onChange={(e) => {
                      handleEdit(e);
                    }}
                  >
                    <option className="py-3" value={editableData.orderStatus}>
                      {editableData.orderStatus}
                    </option>
                    <option className="py-3" value="Delivered">
                      Delivered
                    </option>
                    <option className="py-3" value="Processing">
                      Processing
                    </option>
                    <option className="py-3" value="Shipped">
                      Shipped
                    </option>
                  </select>
                )}
              </div>
              <h6>Id: {editableData._id}</h6>
              <h6>User: {editableData.user}</h6>
              {/* {console.log(editableData)} */}

              <h4>Items </h4>
              {editableData.length !== 0 &&
                editableData.orderItems.map((e) => {
                  return (
                    <div
                      key={e.name}
                      className="d-flex justify-content-between px-3"
                    >
                      <h6>Product : {e.name}</h6>
                      <h6>Qty : {e.qty}</h6>
                    </div>
                  );
                })}
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
                onClick={() => {
                  handleSubmit(status);
                }}
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
