import React, { useContext, useEffect, useState } from "react";
import OrderContext from "../../Context/Order/OrderContext";

export default function OrderItemsCard({ item }) {
  const orderContext = useContext(OrderContext);
  const { removeFromCart } = orderContext;
  const [qty, setQty] = useState(0);
  useEffect(() => {
    setQty(item.qty);
  }, []);
  const changeQty = (num) => {
    if (qty + num > 0) {
      setQty(qty + num);
      removeFromCart({ product: item, qty: num });
    }
    if(num==0)
    removeFromCart({ product: item, qty: num });
  };
  return (
    <>
      <div className="card m-3" style={{ maxWidth: "540px" }}>
        <div className="row g-0">
          <div className="col-md-4">
            <img src={item.image} className="img-fluid rounded-start" />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5 className="card-title">{item.name}</h5>
                <small className="text-body-secondary btn" onClick={()=>changeQty(0)}>Delete Item</small>
              </div>
              <div className="d-flex justify-content-between">
                <p className="card-text">Price: Rs. {item.price}</p>
                <p className="card-text">
                  Qty:
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      changeQty(-1);
                    }}
                  >
                    -
                  </button>{" "}
                  {qty}
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      changeQty(1);
                    }}
                  >
                    +
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
