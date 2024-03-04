const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
  fileFilter: function (req, file, cb) {
    // Accept only JPEG and PNG files
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG and PNG files are allowed."));
    }
  },
});

const uploadStorage = multer({ storage: storage });
module.exports = uploadStorage;
