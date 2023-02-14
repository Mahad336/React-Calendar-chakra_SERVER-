const { Router } = require("express");
const router = Router();
const eventController = require("../controllers/eventControllers");

router
  .route("/")
  .get(eventController.displayEvents)
  .post(eventController.createEvent);

router
  .route("/:id")
  .put(eventController.updateEvent)
  .delete(eventController.deleteEvent);

module.exports = router;
