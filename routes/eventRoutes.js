const { Router } = require("express");
const router = Router();
const eventController = require("../controllers/eventControllers");

router.get("/", eventController.displayEvents);
router.post("/eventUpdate/:id", eventController.displayEvent);
router.get("/create", eventController.create);
router.get("/create-all-day-event", eventController.createAllDayEvent);
router.post("/create", eventController.createPost);
router.post("/create-all-day-event", eventController.createAllDayEvent_post);
router.put("/update", eventController.updateEvent);
router.put("/updateAllDayEvent", eventController.updateAllDayEvent);
router.delete("/deleteAllDayEvent/:id", eventController.eventAllDayDelete);
router.delete("/delete/:id", eventController.eventDelete);

module.exports = router;
