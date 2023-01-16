const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is mandatory"],
  },
  location: {
    type: String,
    required: [true, "Location is mandatory"],
  },
  createdBy: {
    type: String,
    required: true,
  },
});

const DayEvent = mongoose.model("day_event", userSchema);

module.exports = DayEvent;
