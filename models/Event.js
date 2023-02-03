const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title field is mandatory"],
  },
  location: {
    type: String,
    required: [true, "location field is mandatory"],
  },
  createdBy: {
    type: String,
    required: true,
  },
  startAt: {
    type: Date,
    required: true,
  },
  endAt: {
    type: Date,
    required: true,
  },
  isAllDay: {
    type: Boolean,
    required: true,
  },
});

const Event = mongoose.model("event", userSchema);

module.exports = Event;
