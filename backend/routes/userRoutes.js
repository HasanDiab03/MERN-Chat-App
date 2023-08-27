const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
router.route("/").post(registerUser).get(auth, allUsers);
router.post("/login", authUser);

module.exports = router;
