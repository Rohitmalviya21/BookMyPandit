const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) +
      path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },

  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|mp4|mov|avi/;

    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mimetype =
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/");

    if (extname && mimetype) {
      return cb(null, true);
    }

    cb(new Error("Only images and videos are allowed"));
  },
});

module.exports = upload;