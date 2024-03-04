const mongoose = require("mongoose");
const { Schema } = mongoose;
const ProductSchema = new Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  stock: { type: Number, default: 1 },
  numOfReviews: { type: Number, default: 0 },
  ratings: { type: Number, default: 0 },
  reviews: [
    {
      comment: String,
      rating: Number,
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "UserSchema",
        required: true,
      },
    },
  ],
  images: [
    {
      public_id: String,
      url: String,
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "UserSchema",
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Product", ProductSchema);
