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
      res.redirect("/events");
    })
    .catch((e) => {});
};

const updateEvent = (req, res) => {
  const { id, title, location, startAt, endAt } = { ...req.body };

  Event.findByIdAndUpdate(
    id,
    {
      $set: { title, location, startAt, endAt },
    },
    { useFindAndModify: false }
  )
    .then((result) => {
      res.json({ redirect: "/" });
    })
    .catch((error) => {
      console.log(error);
    });
};

const eventDelete = (req, res) => {
  const id = req.params.id;
  Event.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/" });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  displayEvents,
  createEvent,
  updateEvent,
  eventDelete,
};
