import express from "express"
import { createUser } from "./controller.js";

const router= express.Router();

router.post('/',createUser);

export default router;