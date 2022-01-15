const router = require("express").Router();

const userBasic = require("../controllers/userBasic");
const upload = require("../middlewares/multer");

// Basic Routes (Unprotected)
router.post("/signup", upload.single("avatar"), userBasic.signUp);
router.post("/login", userBasic.logIn);
router.get("/logout", userBasic.logOut);

module.exports = router;
