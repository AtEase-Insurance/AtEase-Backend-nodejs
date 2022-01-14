const router = require("express").Router();

const userProfile = require("../controllers/userProfile");
const upload = require("../middlewares/multer");

// Set Protected Routes for Profile Info
router.get("/", userProfile.getProfile);
router.put("/", userProfile.editProfile);
router.put("/password", userProfile.changePassword);
router.post("/avatar", upload.single("avatar"), userProfile.uploadAvatar);

// Simply check token only
router.get("/checkToken", (req, res) => {
  res.status(200);
});

module.exports = router;
