const auth = require("../middleware/authMiddleware");
const router = require("express").Router();
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
} = require("../controllers/chatController");
router.route("/").post(auth, accessChat);
router.route("/").get(auth, fetchChats);
router.route("/group").post(auth, createGroupChat);
router.route("/rename").put(auth, renameGroup);
router.route("/groupAdd").put(auth, addToGroup);
router.route("/groupRemove").put(auth, removeFromGroup);

module.exports = router;
