import { generateMeetingNote } from "../../scripts/generateMeetingNote.js";

export const processMeeting = async (req, res) => {
    const id = req.params.meeting_id;
    const llm = req.body?.llm;

    try {
        await generateMeetingNote(id, llm);
        res.status(200).json({ success: true });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
}