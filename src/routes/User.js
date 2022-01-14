const router = require("express").Router();

const userBasic = require("../controllers/userBasic");
const userProfile = require("../controllers/userProfile");

const auth = require("../middlewares/auth");
const upload = require("../middlewares/multer")

// Basic Routes (Unprotected)
router.post("/signup", upload.single('avatar'), userBasic.signUp);
router.get("/verify/:userId/:uniqueString", userBasic.verifyEmail);
router.post("/login", userBasic.logIn);
router.get("/logout", userBasic.logOut);


// Set Protected Routes for Profile Info
router.get("/profile", auth, userProfile.getProfile);
router.put("/profile", auth, userProfile.editProfile);
router.put("/profile/password", auth, userProfile.changePassword);
router.post("/profile/avatar", auth, upload.single('avatar'), userProfile.uploadAvatar)

// Simply check token only
router.get("/checkToken", auth, (req, res) => {
  res.status(200);
})

module.exports = router;
