const express = require("express");
const router = express.Router();
const UserSchema = require("../models/UserSchema");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const genToken = require("../utils/genToken");
const sendEmail = require("../utils/sendEmail");
const decodeToken = require("../utils/decodeToken");
const uploadStorage = require("../middlewares/uploadFile");
const uploadOnCloudinary = require("../utils/cloudinary");

const defaultAvatar = {
  public_id: "Some Id",
  url: "Some Url",
};

//Register new user
router.post(
  "/register",
  uploadStorage.single("file"),
  [
    body("email").isEmail(),
    body("username").isLength({ min: 3 }),
    body("password").isLength({ min: 8 }),
  ],
  async (req, res) => {
    try {
      // console.log(req.body);
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error(errors.array());
        return res.status(400).json({
          success: false,
          error: "Check the credentials",
          validationErrors: errors.array(),
        });
      }
      let user = await UserSchema.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(201)
          .json({ success: false, error: "Email already registered" });
      }
      if (req.body.password !== req.body.confirm_password) {
        return res
          .status(400)
          .json({ success: false, error: "Password Mismatch" });
      }
      const cloudinaryResponse = await uploadOnCloudinary(
        `uploads/${req.file.filename}`,
        `users/${req.body.email}`
      );
      const avatar = {
        public_id: cloudinaryResponse.public_id || defaultAvatar.public_id,
        url: cloudinaryResponse.url || defaultAvatar.url,
      };
      req.body.avatar = avatar || defaultAvatar;
      req.body.password = await bcrypt.hash(
        req.body.password,
        await bcrypt.genSalt(10)
      );
      user = await UserSchema.create(req.body);
      let authToken = genToken(user);
      let cookieOptions = {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        secure: false,
        httpOnly: false,
      };
      res.cookie("authToken", authToken, cookieOptions);
      res.cookie("username", user.username, cookieOptions);
      res.cookie("role", user.role, cookieOptions);
      res.cookie("profilePicture", user.avatar.url, cookieOptions);
      res.status(200).json({
        success: true,
        message: "Successfully registered",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Registration failed" });
    }
  }
);

//login existing user
router.post("/login", async (req, res) => {
  try {
    let user = await UserSchema.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User does not exist",
      });
    }
    let isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        error: "User does not exist",
      });
    }
    let authToken = genToken(user);
    let cookieOptions = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      secure: false,
      httpOnly: false,
    };
    res.cookie("authToken", authToken, cookieOptions);
    res.cookie("username", user.username, cookieOptions);
    res.cookie("role", user.role, cookieOptions);
    res.cookie("profilePicture", user.avatar.url, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Logged In Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
});

//Logout existing user
router.get("/logout", (req, res) => {
  let cookieOptions = {
    expires: new Date(Date.now()),
    secure: false,
    httpOnly: false,
  };
  res.cookie("authToken", null, cookieOptions);
  res.cookie("username", null, cookieOptions);
  res.cookie("role", null, cookieOptions);
  res.cookie("profilePicture", null, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

//forget password
router.post("/forgetPassword", async (req, res) => {
  let user = await UserSchema.findOne({ email: req.body.email });
  try {
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User does not exist",
      });
    }
    let token = crypto.randomBytes(20).toString("hex");
    let resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    let resetPasswordExpire =
      Date.now() + process.env.RESET_LINK_EXPIRE * 60 * 1000;

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    //send Email
    let url = `${req.protocol}://${req.get(
      "host"
    )}/api/userRoute/forgetPassword/reset/${resetPasswordToken}/${
      req.body.password
    }/${req.body.confirm_password}`;
    let message = `This link will be valid till ${process.env.RESET_LINK_EXPIRE} minutes only\n\n${url}`;

    await sendEmail({
      email: req.body.email,
      subject: "Password Recovery Email",
      message,
    });

    res.status(200).json({
      success: true,
      message: "A password reset link has been sent to the registered email",
    });
  } catch (error) {
    console.error(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
});
//reset password
router.get(
  "/forgetPassword/reset/:token/:password/:confirm_password",
  async (req, res) => {
    try {
      // console.log(req.params.token);
      // console.log(req.params.password);
      // console.log(req.params.confirm_password);
      let user = await UserSchema.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpire: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Unauthorized access not allowed",
        });
      }
      if (req.params.password.length < 8 || req.params.password.length < 8) {
        returnres.status(400).json({
          success: false,
          message: "Password should be atleast 8 characters long",
        });
      }
      if (req.params.password !== req.params.confirm_password) {
        return res
          .status(400)
          .json({ success: false, error: "Password Mismatch" });
      }
      user.password = await bcrypt.hash(
        req.params.password,
        await bcrypt.genSalt(10)
      );
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(200).json({
        success: true,
        message: "Password has been successfully updated",
        // user,
      });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({
        success: false,
        error: "Password reset failed",
      });
    }
  }
);

//get single user details
router.get("/getsingleuser", decodeToken, async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

//get all the registerd users -- ADMIN
router.get("/admin/getAllUsers", decodeToken, async (req, res) => {
  try {
    let user = await UserSchema.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User does not exist",
      });
    }
    if (user.role !== "admin") {
      return res.status(400).json({
        success: false,
        error: "User with given role cannot access this page",
      });
    }
    user = await UserSchema.find().select("-password");
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

//update user details
router.put(
  "/updateprofile",
  decodeToken,
  uploadStorage.single("file"),
  async (req, res) => {
    try {
      let user = await UserSchema.findById(req.user.id);
      if (!user) {
        return res.status(400).json({
          success: false,
          error: "User does not exist",
        });
      }
      let newUserDetails = {};
      let { username } = req.body;
      if (username.length < 3) {
        return res.status(500).json({
          success: false,
          error: "Username must be atleast 3 characters long",
        });
      }
      let avatar = "";
      if (req.file) {
        const cloudinaryResponse = await uploadOnCloudinary(
          `uploads/${req.file.filename}`,
          `users/${user.email}`
        );
        avatar = {
          public_id: cloudinaryResponse.public_id || defaultAvatar.public_id,
          url: cloudinaryResponse.url || defaultAvatar.url,
        };
      }
      if (username) newUserDetails.username = username;
      if (avatar) newUserDetails.avatar = avatar;
      user = await UserSchema.findByIdAndUpdate(
        req.user.id,
        {
          $set: newUserDetails,
        },
        { new: true }
      ).select("-password");
      res.status(200).json({
        success: true,
        message: "Profile has been successfully updated",
        user,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }
);

//update user role -- ADMIN
router.put("/admin/updateUserRole", decodeToken, async (req, res) => {
  try {
    const requestingUser = await UserSchema.findById(req.user.id);

    if (!requestingUser) {
      return res.status(404).json({
        success: false,
        error: "Requesting user not found",
      });
    }

    if (requestingUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Unauthorized. Only admin can update user roles.",
      });
    }

    const userToUpdate = await UserSchema.findOne({ _id: req.body.id });

    if (!userToUpdate) {
      return res.status(404).json({
        success: false,
        error: "User to update not found",
      });
    }

    if (req.body.role && typeof req.body.role === "string") {
      userToUpdate.role = req.body.role;
    } else {
      return res.status(400).json({
        success: false,
        error: "Invalid role provided",
      });
    }

    const savedUser = await userToUpdate.save();

    res.status(200).json({
      success: true,
      message: "User's role has been successfully updated",
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

//delete user -- ADMIN
router.delete("/admin/deleteuser", decodeToken, async (req, res) => {
  try {
    const requestingUser = await UserSchema.findById(req.user.id);

    if (!requestingUser) {
      return res.status(404).json({
        success: false,
        error: "Requesting user not found",
      });
    }

    if (requestingUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Unauthorized. Only admin can delete users.",
      });
    }

    const userToDelete = await UserSchema.findOne({ _id: req.body.id }).select(
      "-password"
    );

    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        error: "User to delete not found",
      });
    }

    // Delete the user
    await UserSchema.findOneAndDelete({ _id: req.body.id });
    res.status(200).json({
      success: true,
      message: "User has been successfully deleted",
      user: userToDelete,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

module.exports = router;
