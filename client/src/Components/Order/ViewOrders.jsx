import React, { useContext, useEffect, useRef, useState } from "react";
import OrderContext from "../../Context/Order/OrderContext";
import OrderItemsCard from "./OrderItemsCard";
import Cookies from "js-cookie";
import EditOrderModal from "./EditOrderModal";
import { useNavigate } from "react-router-dom";

export default function ViewOrders() {
  const orderContext = useContext(OrderContext);
  const {
    orders,
    getOrdersSingleUser,
    getOrdersAllUser,
    updateOrderStatus,
    cancelOrder,
  } = orderContext;
  const editOrderBtn = useRef();
  const editOrderBtnCLose = useRef();
  const [editableData, setEditableData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!Cookies.get("username")) {
      alert("Login First");
      return navigate("/login");
    }
    if (Cookies.get("role") == "user") getOrdersSingleUser();
    else getOrdersAllUser();
  }, []);

  //handleEditClick
  const handleEditClick = (e) => {
    setEditableData(e);
    editOrderBtn.current.click();
  };
  const handleSubmit = (status) => {
    updateOrderStatus(editableData._id, status);
    editOrderBtnCLose.current.click();
  };

  //cancel order -- ADMIN
  const handleCancel = (e) => {
    cancelOrder(e);
  };

  return (
    <>
      {orders.length == 0 && <h1 className="container m-3">No orders</h1>}
      {orders.length !== 0 &&
        orders.map((e) => {
          return (
            <div
              className="container m-3"
              style={{ borderBottom: "1px solid black" }}
              key={e._id}
            >
              <div className="d-flex justify-content-between">
                <h3>{e.orderStatus}</h3>
                <div>
                  <button
                    className="btn btn-primary mx-1"
                    disabled={
                      e.orderStatus === "Cancelled" ||
                      e.orderStatus === "Delivered"
                    }
                    onClick={() => {
                      handleCancel(e);
                    }}
                  >
                    Cancel Order
                  </button>
                  {Cookies.get("role") == "admin" && (
                    <button
                      className="btn btn-primary mx-1"
                      disabled={e.orderStatus === "Cancelled"}
                      onClick={() => {
                        handleEditClick(e);
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
              <table>
                <tbody>
                  {e.orderItems.map((ele) => {
                    return (
                      <tr key={ele._id}>
                        <td className="px-3">
                          <b>Name:</b> {ele.name}{" "}
                        </td>
                        <td className="px-3">
                          <b>Price:</b> {ele.price}{" "}
                        </td>
                        <td className="px-3">
                          <b>Qty:</b> {ele.qty}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <h6 className="m-3">Total Price :{e.totalPrice}</h6>
            </div>
          );
        })}
      {orders.length !== 0 && (
        <EditOrderModal
          editOrderBtn={editOrderBtn}
          editableData={editableData}
          editOrderBtnCLose={editOrderBtnCLose}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
}
