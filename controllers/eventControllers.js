const Event = require("../models/Event");
const DayEvent = require("../models/DayEvent");

const displayEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id });
    const dayEvents = await DayEvent.find({ createdBy: req.user._id });
    return res.status(200).json({
      data: {
        events,
        dayEvents,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
const displayEvent = async (req, res) => {
  const id = req.params.id;
  try {
    const event = await Event.find({ _id: id });
    const dayEvent = await DayEvent.find({ _id: id });
    return res.status(200).json({
      data: {
        event,
        dayEvent,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const create = (req, res) => {
  res.render("create");
};

const createPost = (req, res) => {
  const event = new Event({ ...req.body, createdBy: req.user._id });
  event
    .save()
    .then((result) => {
      res.redirect("/events");
    })
    .catch((e) => {});
};

const createAllDayEvent_post = (req, res) => {
  const event = new DayEvent({ ...req.body, createdBy: req.user._id });
  event
    .save()
    .then((result) => res.redirect("/events"))
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

const updateAllDayEvent = (req, res) => {
  const { id, title, location } = { ...req.body };

  DayEvent.findByIdAndUpdate(
    id,
    {
      $set: { title, location },
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

const createAllDayEvent = (req, res) => {
  res.render("createAllDayEvent");
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

const eventAllDayDelete = (req, res) => {
  const id = req.params.id;
  DayEvent.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/" });
    })
    .catch((error) => {
      console.log(error);
    });
  res.json({ redirect: "/display-events" });
};

module.exports = {
  displayEvents,
  displayEvent,
  create,
  createPost,
  updateEvent,
  eventDelete,
  createAllDayEvent,
  createAllDayEvent_post,
  eventAllDayDelete,
  updateAllDayEvent,
};
