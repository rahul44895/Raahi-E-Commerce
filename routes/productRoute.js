const express = require("express");
const router = express.Router();
const ProductSchema = require("../models/ProductSchema");
const UserSchema = require("../models/UserSchema");
const decodeToken = require("../utils/decodeToken");
const ApiFeatures = require("../utils/ApiFeatures");
const uploadStorage = require("../middlewares/uploadFile");
const uploadOnCloudinary = require("../utils/cloudinary");

const defaultImage = [
  {
    public_id: "Some id",
    url: "Some url",
  },
];

//create product -- Admin
router.post(
  "/admin/createProduct",
  decodeToken,
  uploadStorage.single("file"),
  async (req, res) => {
    try {
      const user = await UserSchema.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      if (user.role !== "admin") {
        return res.status(403).json({
          success: false,
          error: "Unauthorized. Only admin can create products.",
        });
      }

      let product = await ProductSchema.findOne({ name: req.body.name });

      if (product) {
        return res.status(400).json({
          success: false,
          error: "Product with given name already exists",
        });
      }

      const { name, price, description, category } = req.body;

      if (!name || !price || !description || !category) {
        return res.status(400).json({
          success: false,
          error: "Insufficient attributes found",
        });
      }
      const cloudinaryResponse = await uploadOnCloudinary(
        `uploads/${req.file.filename}`,
        `${category}/${name}`
      );
      const avatar = {
        public_id: cloudinaryResponse.public_id || defaultAvatar.public_id,
        url: cloudinaryResponse.url || defaultAvatar.url,
      };
      req.body.image = avatar || defaultImage;

      product = await ProductSchema.create({
        name,
        price,
        description,
        category,
        images: req.body.image,
        stock: req.body.stock,
        user,
      });

      res.status(201).json({
        success: true,
        message: "Product successfully created",
        product,
      });
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }
);

//delete product -- Admin
router.delete("/admin/deleteProduct", decodeToken, async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Unauthorized. Only admin can delete products.",
      });
    }

    const productId = req.body.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required for deletion",
      });
    }

    let product = await ProductSchema.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Delete the product
    product = await ProductSchema.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

//get single product
const getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await ProductSchema.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

router.get("/getSingleProduct/:id", getSingleProduct);

// get all products
router.get("/getAllProducts", async (req, res) => {
  const apiFeatures = new ApiFeatures(ProductSchema.find(), req.query)
    .search()
    .filter()
    .pagination(req.query.limit);
  const product = await apiFeatures.query;
  const totalProductCount = await ProductSchema.countDocuments();
  res.status(200).json({ success: true, totalProductCount, product });
});

//add a review or update a existing review of a particular user
router.post("/review/add/:productID", decodeToken, async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (!req.params.productID) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required",
      });
    }

    const product = await ProductSchema.findById(req.params.productID);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    const review = {
      comment: req.body.comment,
      rating: Number(req.body.rating),
      user: req.user.id,
    };

    const userReviewedIndex = product.reviews.findIndex(
      (rev) => rev.user.toString() === req.user.id.toString()
    );

    if (userReviewedIndex !== -1) {
      // User has already reviewed, update the existing review
      product.reviews[userReviewedIndex] = review;
    } else {
      // User is adding a new review
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    // Calculate average rating using reduce
    let avg = 0;
    product.reviews.forEach((review) => {
      avg += review.rating;
    });
    product.ratings = avg / product.reviews.length;

    await Promise.all([user.save(), product.save()]);

    res.json({ success: true, product });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//delete a review
router.delete("/review/delete", decodeToken, async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const product = await ProductSchema.findById(req.body.productID);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    const reviewIDToDelete = req.body.reviewID;
    let updatedReviews = product.reviews.filter((rev) => {
      return rev.id.toString() !== reviewIDToDelete;
    });
    const numOfReviews = updatedReviews.length;

    let avgRating = 0;
    updatedReviews.forEach((review) => (avgRating += review.rating));
    let ratings = 0;
    if (numOfReviews > 0) {
      ratings = avgRating / numOfReviews;
    }

    const updatedProduct = await ProductSchema.findByIdAndUpdate(
      req.body.productID,
      {
        reviews: updatedReviews,
        numOfReviews,
        ratings,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Review Deleted Successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Delete review error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

module.exports = router;
