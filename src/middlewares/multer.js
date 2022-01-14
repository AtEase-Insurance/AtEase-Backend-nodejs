const multer = require("multer");
const path = require("path");

// Multer config
(fileFilter = (req, file, cb) => {
  checkFileType(file, cb);
}),
  (module.exports = multer({
    storage: multer.diskStorage({
      destination: "./public/images/avatars",
      filename: (req, file, cb) => {
        cb(
          null,
          req.body.surname +
            "_" +
            req.body.firstName +
            "_" +
            path.extname(file.originalname)
        );
      },
    }),
    limits: { fieldSize: 1024 * 1024 * 10 }, // set max. file size = 10 MB
    fileFilter,
  }));

// Check File Type
const checkFileType = (file, cb) => {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};
