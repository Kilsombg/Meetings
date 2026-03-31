import { generateMeetingNote } from "../../scripts/generateMeetingNote.js";
import { MeetingsService } from "../../services/meetings.service.js";
import { isRateLimited } from "../rateLimit.js";

export const processMeeting = async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (isRateLimited(ip)) {
        res.status(429).json({ error: 'Too many requests' });
        return;
    }

    const id = req.params.meeting_id;
    const llm = req.body?.llm;

    try {
        await generateMeetingNote(id, llm);
        res.status(200).json({ success: true });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
}


export const uploadMeetingViaFile = async (req, res) => {
    try {
        await MeetingsService.uploadFromFile(req.file);
        res.status(200).json({ success: true });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
}