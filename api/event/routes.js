import express from "express"
import { cancelRegistration, createEvent, getEvent, getEventStats, registerForEvent, upcomingEvents } from "./controller.js";

const router= express.Router();

router.post('/',createEvent);
router.get('/:eventId',getEvent);
router.post('/:eventId',registerForEvent);
router.delete('/:eventId',cancelRegistration);
router.get('/',upcomingEvents);
router.get('/:eventId/stats', getEventStats);

export default router;