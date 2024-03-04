import React, { useContext, useEffect, useRef, useState } from "react";
import ProductContext from "../../Context/Product/ProductContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import NewProductModal from "./NewProductModal";

export default function ManageProducts() {
  const productContext = useContext(ProductContext);
  const {
    getAllProducts,
    totalProductsCount,
    productArr,
    createProduct,
    deleteProduct,
  } = productContext;

  const [pageNum, setPageNum] = useState(1);
  const limit = 5;
  const changePage = (num) => {
    getAllProducts({ page: pageNum + num, limit: limit });
    setPageNum(pageNum + num);
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (Cookies.get("role") !== "admin") navigate("/");
    getAllProducts({ page: pageNum, limit: limit });
  }, []);

  const openNewProductModal = useRef();
  const closeNewProductModal = useRef();
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    file: "",
  });

  const handleNewProduct = () => {
    openNewProductModal.current.click();
  };

  //save the product -- ADMIN
  const handleSaveProduct = () => {
    if (!newProduct.name) return alert("Enter Product name");
    if (!newProduct.price) return alert("Enter Product price");
    if (!newProduct.description) return alert("Enter Product description");
    if (!newProduct.category) return alert("Enter Product category");
    if (!newProduct.stock) return alert("Enter Product stock");
    if (!newProduct.file) return alert("Enter Product Image");

    closeNewProductModal.current.click();
    createProduct(newProduct);
    
      setNewProduct({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
        file: "",
      });
    
  };

  //delete the product -- ADMIN
  const handleDelete = (product) => {
    deleteProduct(product);
  };
  return (
    <>
      {/* {console.log(productArr)} */}

      <div className="container">
        <div className="d-flex justify-content-between">
          <h1>Products List</h1>
          <button className="btn btn-primary" onClick={handleNewProduct}>
            Add new Product
          </button>
        </div>
        <table>
          <tbody>
            <tr>
              <td>
                <h6>name</h6>
              </td>
              <td>
                <h6>price</h6>
              </td>
              <td>
                <h6>description</h6>
              </td>
              <td>
                <h6>category</h6>
              </td>
              <td>
                <h6>ratings</h6>
              </td>
              <td>
                <h6>stock</h6>
              </td>
            </tr>
            {productArr.length !== 0 &&
              productArr.map((product) => {
                return (
                  <tr
                    style={{ borderBottom: "1px solid black" }}
                    key={product._id}
                  >
                    <td>{product.name}</td>
                    <td>Rs. {product.price}</td>
                    <td>{product.description}</td>
                    <td>{product.category}</td>
                    <td>{product.ratings} stars</td>
                    <td>{product.stock}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          handleDelete(product);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {!productArr.length && <div>Reached the end of the page</div>}
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
      <NewProductModal
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        openNewProductModal={openNewProductModal}
        closeNewProductModal={closeNewProductModal}
        handleSaveProduct={handleSaveProduct}
      />
    </>
  );
}
