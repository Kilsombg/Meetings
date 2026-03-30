import express from "express"
import { processMeeting } from "../controllers/meetings.js";

export const meetingsRouter = express.Router();

meetingsRouter.post('/:meeting_id/process', processMeeting);