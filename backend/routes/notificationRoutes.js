const auth = require("../middleware/authMiddleware");

const router = require("express").Router();
const {
  allNotifications,
  addNotification,
  removeNotification,
} = require("../controllers/notificationController");

router.route("/").get(auth, allNotifications).post(auth, addNotification);
router.delete("/:notifId", auth, removeNotification);

module.exports = router;
