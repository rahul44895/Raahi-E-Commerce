import React from "react";
import { Rating } from "react-simple-star-rating";

export default function ReviewModal({
  review,
  setReview,
  openReviewModal,
  closeReviewModal,
  handleAddReview,
}) {
  const onChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };
  const handleRating = (rate) => {
    setReview({ ...review, ["rating"]: rate });
  };
  return (
    <>
      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        ref={openReviewModal}
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
                Add a review
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <label className="form-label">Comment</label>
                <input
                  name="comment"
                  className="form-control"
                  type="text"
                  value={review.comment}
                  onChange={(e) => {
                    onChange(e);
                  }}
                />
                <label className="form-label">Ratings</label>
                <input
                  name="rating"
                  className="form-control"
                  type="number"
                  value={review.rating}
                  readOnly
                />
                <Rating onClick={handleRating} />
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={closeReviewModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddReview}
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
