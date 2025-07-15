import express from "express"
import { createEvent, getEvent } from "./controller.js";

const router= express.Router();

router.post('/',createEvent);
router.get('/:eventId',getEvent);
router.post('/:eventId/register',getEvent);

export default router;