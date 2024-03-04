import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductContext from "../../Context/Product/ProductContext";
import OrderContext from "../../Context/Order/OrderContext";
import Loader from "../Loader";
import Cookies from "js-cookie";
import ReviewModal from "./ReviewModal";
import { Rating } from "react-simple-star-rating";

export default function ViewProduct() {
  const { getSingleProduct, addAReview, particularProduct } =
    useContext(ProductContext);
  const { addToCart } = useContext(OrderContext);

  // const [particularProduct, setparticularProduct] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const openReviewModal = useRef();
  const closeReviewModal = useRef();
  const [review, setReview] = useState({
    comment: "",
    rating: "",
  });

  const handleReviewClick = () => {
    if (!Cookies.get("username")) return alert("Login first");
    openReviewModal.current.click();
  };

  const handleAddReview = async () => {
    if (!review.comment || !review.rating) {
      return alert("Enter all the fields");
    }
    const res = await addAReview({ review, id: particularProduct._id });
    if (res == true) {
      closeReviewModal.current.click();
    }
  };

  useEffect(() => {
    getSingleProduct(id);
  }, [id, getSingleProduct, navigate]);
  const changeQty = (num) => {
    setQty(qty + num);
  };

  return (
    <div className="container m-3">
      {particularProduct.length === 0 ? (
        <Loader />
      ) : (
        <div>
          <div
            className="d-flex flex-wrap align-items-center"
            style={{ width: "100vw" }}
          >
            <div
              style={{
                width: "50vw",
                overflow: "hidden",
              }}
            >
              <img
                src={particularProduct.images[0].url}
                alt={particularProduct.name}
                style={{ width: "32rem", height: "18rem", objectFit: "cover" }}
              />
              <div
                className="my-3 d-flex justify-content-between"
                style={{ width: "100%" }}
              >
                {particularProduct.images.length !== 0 &&
                  particularProduct.images.map((img) => {
                    return (
                      <div
                        key={img._id}
                        style={{
                          height: "100px",
                          width: "100px",
                          objectFit: "cover",
                          padding: "0.2em",
                        }}
                      >
                        <img
                          src={img.url}
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
            <div style={{ width: "50vw" }}>
              <h1>{particularProduct.name}</h1>
              <b>Price: </b>Rs. {particularProduct.price}
              <p>
                <b>Description: </b>
                {particularProduct.description}
              </p>
              <p>
                <small>
                  <b>Category: </b>
                  {particularProduct.category}
                </small>
              </p>
              <p>Ratings : {particularProduct.ratings}</p>
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
              <button
                className="btn btn-primary mx-3"
                onClick={() => {
                  if (!Cookies.get("authToken")) return alert("login first");
                  else addToCart({ product: particularProduct, qty: qty });
                }}
                disabled={particularProduct.stock === 0}
              >
                Add To Cart
              </button>
            </div>
          </div>
          <div>
            <h1>Reviews ({particularProduct.reviews.length})</h1>
            <div className="d-flex gap-3">
              <div
                className="btn btn-primary"
                style={{ padding: "1em" }}
                onClick={() => {
                  handleReviewClick();
                }}
              >
                +
                <br />
                Add a Review
              </div>
              {particularProduct.reviews.length !== 0 &&
                particularProduct.reviews.map((review) => {
                  return (
                    <div
                      style={{ border: "1px solid black", padding: "1em" }}
                      key={review._id}
                    >
                      <Rating initialValue={review.rating} readonly size={20} />
                      <br />
                      {review.comment}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      <ReviewModal
        review={review}
        setReview={setReview}
        openReviewModal={openReviewModal}
        closeReviewModal={closeReviewModal}
        handleAddReview={handleAddReview}
      />
    </div>
  );
}
