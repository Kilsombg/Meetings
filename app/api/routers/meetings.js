import express from "express"
import multer from "multer"
import { processMeeting, uploadMeetingViaFile } from "../controllers/meetings.js";

export const meetingsRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

meetingsRouter.post('/:meeting_id/process', processMeeting);
meetingsRouter.post('/upload', upload.single('file'), uploadMeetingViaFile);