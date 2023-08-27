const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController");
router.route("/").post(auth, sendMessage);
router.route("/:chatId").get(auth, allMessages);

module.exports = router;
