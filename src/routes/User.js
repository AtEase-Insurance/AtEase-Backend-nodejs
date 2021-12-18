const router = require("express").Router();

const userBasic = require("../controllers/UserBasic");
const userProfile = require("../controllers/UserProfile");

const auth = require("../middlewares/Auth");

// Basic Routes (Unprotected)
router.post("/signup", userBasic.signUp);
router.post("/login", userBasic.logIn);
router.get("/logout", userBasic.logOut);

// Set Protected Routes for Profile Info
router.get("/profile", auth, userProfile.getProfile);
router.put("/profile", auth, userProfile.editProfile);
router.put("/profile/password", auth, userProfile.changePassword);

module.exports = router;
