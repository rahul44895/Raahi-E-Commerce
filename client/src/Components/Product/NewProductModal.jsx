import React from "react";

export default function NewProductModal({
  newProduct,
  setNewProduct,
  openNewProductModal,
  closeNewProductModal,
  handleSaveProduct,
}) {
  const onChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };
  return (
    <>
      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        ref={openNewProductModal}
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
                Add New Product
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={closeNewProductModal}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    onChange={(e) => onChange(e)}
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={newProduct.name}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                  <input
                    onChange={(e) => onChange(e)}
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={newProduct.price}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    onChange={(e) => onChange(e)}
                    type="text"
                    className="form-control"
                    id="description"
                    name="description"
                    value={newProduct.description}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    onChange={(e) => onChange(e)}
                    type="text"
                    className="form-control"
                    id="category"
                    name="category"
                    value={newProduct.category}
                  >
                    <option value="Games">Games</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Cosmetics">Cosmetics</option>
                    <option value="Health">Health</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="stock" className="form-label">
                    Stock
                  </label>
                  <input
                    onChange={(e) => onChange(e)}
                    type="number"
                    className="form-control"
                    id="stock"
                    name="stock"
                    value={newProduct.stock}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="file" className="form-label">
                    File
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="file"
                    name="file"
                    accept="image/png,.jpeg,.jpg"
                    onChange={(e) => {
                      if (
                        e.target.files.length > 0 &&
                        e.target.files[0].type != "image/jpeg" &&
                        e.target.files[0].type != "image/jpg" &&
                        e.target.files[0].type != "image/png"
                      ) {
                        e.target.value = "";
                        return alert(
                          "Only JPG/JPEG/PNG file types are allowed"
                        );
                      }
                      setNewProduct({
                        ...newProduct,
                        ["file"]: e.target.files[0],
                      });
                    }}
                  />
                </div>
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
                onClick={handleSaveProduct}
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
