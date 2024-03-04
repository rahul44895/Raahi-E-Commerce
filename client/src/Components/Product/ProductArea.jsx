import React, { useContext, useEffect, useState } from "react";
import ProductContext from "../../Context/Product/ProductContext";
import OrderContext from "../../Context/Order/OrderContext";
import ProductCard from "./ProductCard";

export default function ProductArea() {
  const productContext = useContext(ProductContext);
  const { getAllProducts, totalProductsCount, productArr } = productContext;
  const orderContext = useContext(OrderContext);
  const { addToCart } = orderContext;


  const [pageNum, setPageNum] = useState(1);
  const limit = 10;
  const changePage = (num) => {
    getAllProducts({ page: pageNum + num, limit: limit });
    setPageNum(pageNum + num);
  };
  useEffect(() => {
    getAllProducts({ page: pageNum, limit: limit });
  }, []);
 

  return (
    <div className="container">
      <h1>ProductArea</h1>
      <div className="d-flex flex-wrap justify-content-start">
        {productArr.length!==0 &&
          productArr.map((product) => {
            return <ProductCard product={product} key={product._id} addToCart={addToCart}/>;
          })}
        {!productArr.length && <div>Reached the end of the page</div>}
      </div>
      <button
        className="btn btn-primary"
        onClick={() => {
          changePage(-1);
        }}
        disabled={limit * (pageNum - 1) < 1}
      >
        Prev Page
      </button>
      <button
        className="btn btn-primary"
        onClick={() => {
          changePage(1);
        }}
        disabled={productArr.length == 0}
      >
        Next Page
      </button>
    </div>
  );
}
