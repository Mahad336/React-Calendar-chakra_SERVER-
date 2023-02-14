const Event = require("../models/Event");

const displayEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id });
    return res.status(200).json({
      data: {
        events,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const createEvent = (req, res) => {
  const event = new Event({ ...req.body, createdBy: req.user._id });
  event
    .save()
    .then((result) => {
      res.json({ result });
    })
    .catch((e) => {});
};

const updateEvent = (req, res) => {
  const id = req.params.id;
  Event.findByIdAndUpdate(id, req.body, { new: true })
    .then((result) => {
      res.json({ result });
    })
    .catch((error) => {
      console.log(error);
    });
};

const deleteEvent = (req, res) => {
  const id = req.params.id;
  Event.findByIdAndDelete(id)
    .then((result) => {
      res.json({ result });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  displayEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
