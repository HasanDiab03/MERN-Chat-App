const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    belong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
