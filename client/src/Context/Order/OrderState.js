import Cookies from "js-cookie";
import OrderContext from "./OrderContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const OrderState = (props) => {
  const navigate = useNavigate();
  const host = process.env.REACT_APP_HOST;
  const [orders, setOrders] = useState([]);
  const [itemsPrice, setItemsPrice] = useState(0);
  const [taxPrice, setTaxPrice] = useState(100);
  const [shippingPrice, setShippingPrice] = useState(50);

  const getLocalOrders = () => {
    const temp = JSON.parse(localStorage.getItem("orderArr")) || [];
    setOrders(temp);
    const tempPrice = temp.reduce((total, e) => total + e.price * e.qty, 0);
    setItemsPrice(tempPrice);
  };

  const addToCart = ({ product, qty }) => {
    if (!qty) qty = 1;

    let orderArr = localStorage.getItem("orderArr")
      ? JSON.parse(localStorage.getItem("orderArr"))
      : [];

    const index = orderArr.findIndex((item) => item.product === product._id);

    if (index !== -1) {
      orderArr[index].qty += 1;
    } else {
      orderArr.push({
        user: Cookies.get("authToken"),
        price: product.price,
        name: product.name,
        qty,
        image: product.images[0]?.url || "",
        product: product._id,
      });
    }

    localStorage.setItem("orderArr", JSON.stringify(orderArr));
  };

  const removeFromCart = ({ product, qty }) => {
    let orderArr = [];

    if (qty === 0) {
      const updatedCart = orders.filter(
        (item) => item.product !== product.product
      );
      localStorage.setItem("orderArr", JSON.stringify(updatedCart));
      setOrders(updatedCart);
      setItemsPrice(
        updatedCart.reduce((total, item) => total + item.price * item.qty, 0)
      );
    } else {
      if (localStorage.getItem("orderArr")) {
        orderArr = JSON.parse(localStorage.getItem("orderArr"));

        const index = orderArr.findIndex(
          (item) => item.product === product.product
        );

        if (index !== -1 && orderArr[index].qty + qty > 0) {
          orderArr[index].qty += qty;
        }
      }
      localStorage.setItem("orderArr", JSON.stringify(orderArr));
      setItemsPrice(
        orderArr.reduce((total, item) => total + item.price * item.qty, 0)
      );
    }
  };

  const placeOrder = async (setLoading) => {
    setLoading(true);
    const bodyContent = {
      shippingInfo: JSON.parse(localStorage.getItem("shippingInfo")),
      orderItems: JSON.parse(localStorage.getItem("orderArr")),
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice: Math.round(itemsPrice + shippingPrice + taxPrice),
    };
    let response = await fetch(`${host}/api/orderRoute/createOrder`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyContent),
    });
    let data = await response.json();
    setLoading(false);
    if (data.success) {
      alert("Order Placed Successfully");
      localStorage.clear("orderArr");
      localStorage.clear("shippingInfo");
      navigate("/");
    } else {
      alert(data.error);
    }
  };

  const getOrdersSingleUser = async () => {
    let response = await fetch(`${host}/api/orderRoute/getOrders/singleUser`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await response.json();
    if (data.success) {
      setOrders(data.order.reverse());
    } else {
      alert(data.error);
    }
  };

  //get all order -- ADMIN
  const getOrdersAllUser = async () => {
    let response = await fetch(`${host}/api/orderRoute/getOrders/allUser`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await response.json();
    // console.log(data)
    if (data.success) {
      setOrders(data.order.reverse());
    } else {
      alert(data.error);
    }
  };

  //update orderStatus -- ADMIN
  const updateOrderStatus = async (id, orderStatus) => {
    let response = await fetch(`${host}/api/orderRoute/updateOrder`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderID: id, orderStatus }),
    });
    let data = await response.json();
    // console.log(data);
    if (data.success) {
      alert("Order Updated Successfully");
      let updateOrders = JSON.parse(JSON.stringify(orders));
      updateOrders.forEach((e) => {
        if (e._id == id) {
          e.orderStatus = orderStatus;
        }
      });
      setOrders(updateOrders);
    } else {
      alert(data.error);
    }
  };

  //cancel order
  const cancelOrder = async (e) => {
    const response = await fetch(`${host}/api/orderRoute/cancelOrder`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderID: e._id }),
    });
    const data = await response.json();
    console.log(data);
    if (data.success) {
      alert("Order cancelled successfully");
      let arrayCopy = JSON.parse(JSON.stringify(orders));
      arrayCopy.forEach((ele) => {
        if (ele._id === e._id) {
          ele.orderStatus = "Cancelled";
        }
      });
      setOrders(arrayCopy);
    } else {
      alert(data.error);
    }
  };
  return (
    <OrderContext.Provider
      value={{
        orders,
        itemsPrice,
        taxPrice,
        shippingPrice,
        getLocalOrders,
        addToCart,
        removeFromCart,
        placeOrder,
        getOrdersSingleUser,
        updateOrderStatus,
        getOrdersAllUser,
        cancelOrder,
      }}
    >
      {props.children}
    </OrderContext.Provider>
  );
};
export default OrderState;
