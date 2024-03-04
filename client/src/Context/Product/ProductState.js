import { useState } from "react";
import ProductContext from "./ProductContext";
import { useNavigate } from "react-router-dom";
const ProductState = (props) => {
  const navigate = useNavigate();
  const host = process.env.REACT_APP_HOST;

  const [productArr, setProductArr] = useState([]);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [particularProduct, setParticularProduct] = useState([]);

  //getAllProducts
  const getAllProducts = async ({
    keyword,
    category,
    price_gte,
    price_lte,
    page,
    limit,
  }) => {
    setProductArr([]);
    if (!page) page = 1;
    if (!limit) limit = 10;
    const params = {};
    if (keyword) params.keyword = keyword;
    if (category) params.category = category;
    if (price_gte) params.price_gte = price_gte;
    if (price_lte) params.price_lte = price_lte;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    let queryString = Object.keys(params)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
      )
      .join("&");
    if (price_gte) queryString = queryString.replace("_gte", "[gte]");
    if (price_lte) queryString = queryString.replace("_lte", "[lte]");
    // console.log(params, queryString);

    const response = await fetch(
      `${host}/api/productRoute/getAllProducts?${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data.success) {
      //   console.log(data);
      setProductArr(data.product);
      setTotalProductsCount(data.totalProductCount);
    } else {
      alert("Some Internal Error Occured");
    }
  };

  //getSingleProduct
  const getSingleProduct = async (id) => {
    const response = await fetch(
      `${host}/api/productRoute/getSingleProduct/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    if (data.success) {
      setParticularProduct(data.product);
      return data.product;
    } else {
      alert(data.error);
      navigate("/");
    }
  };

  // add a review
  const addAReview = async ({ review, id }) => {
    const response = await fetch(`${host}/api/productRoute/review/add/${id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comment: review.comment,
        rating: review.rating,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data.success) {
      setParticularProduct({
        ...particularProduct,
        reviews: [...particularProduct.reviews, review],
      });

      return true;
    } else {
      alert(data.error);
      return false;
    }
  };

  //create product -- ADMIN
  const createProduct = async (newProduct) => {
    const bodyContent = new FormData();
    bodyContent.append("name", newProduct.name);
    bodyContent.append("price", newProduct.price);
    bodyContent.append("description", newProduct.description);
    bodyContent.append("category", newProduct.category);
    bodyContent.append("stock", newProduct.stock);
    bodyContent.append("file", newProduct.file);
    const response = await fetch(
      `${host}/api/productRoute/admin/createProduct`,
      {
        method: "POST",
        credentials: "include",
        body: bodyContent,
      }
    );
    const data = await response.json();
    if (data.success) {
      alert(data.message);
      setProductArr((productArr) => [...productArr, data.product]);
    } else {
      alert(data.error);
    }
  };

  //delete product -- ADMIN
  const deleteProduct = async (product) => {
    const response = await fetch(
      `${host}/api/productRoute/admin/deleteProduct`,
      {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product._id }),
      }
    );
    const data = await response.json();
    console.log(data);
    if (data.success) {
      let arrayCopy = JSON.parse(JSON.stringify(productArr));
      arrayCopy = arrayCopy.filter((pro) => pro._id !== product._id);
      setProductArr(arrayCopy);
      alert("Product Deleted Successfully");
    } else {
      alert(data.error || data.message);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        productArr,
        totalProductsCount,
        getAllProducts,
        getSingleProduct,
        addAReview,
        particularProduct,
        setParticularProduct,
        deleteProduct,
        createProduct,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};
export default ProductState;
