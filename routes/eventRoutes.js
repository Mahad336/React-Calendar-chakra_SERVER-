const { Router } = require("express");
const router = Router();
const eventController = require("../controllers/eventControllers");

router
  .route("/")
  .get(eventController.displayEvents)
  .post(eventController.createEvent)
  .put(eventController.updateEvent);
router.delete("/:id", eventController.eventDelete);

module.exports = router;
