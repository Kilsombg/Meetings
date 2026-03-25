import { SupabaseService } from "../services/supabase.service.js";
import { GroqService } from "../services/groq.service.js";
import { chunkTranscript } from "../helpers/TextFormatting.js";

export function mergeChunkNotes(resultNotes) {
    if (!resultNotes || resultNotes.length <= 0) {
        return null;
    }

    let meetingNote = {
        summary: "",
        action_items: [],
        decisions: [],
        key_takeaways: [],
        topics: [],
        next_steps: []
    };

    resultNotes.forEach((note) => {
        meetingNote.summary += note.summary || "";

        note.action_items.forEach((item) => {
            meetingNote.action_items.push(item);
        });

        note.decisions.forEach((decision) => {
            meetingNote.decisions.push(decision);
        });

        note.key_takeaways.forEach((key_takeaway) => {
            meetingNote.key_takeaways.push(key_takeaway);
        });

        note.topics.forEach((topic) => {
            meetingNote.topics.push(topic);
        });

        note.next_steps.forEach((step) => {
            meetingNote.next_steps.push(step);
        });
    });

    return meetingNote;
}

export function validateMeetingNote(mergedNote) {
    if (!mergedNote?.action_items) {
        mergedNote.action_items.push({
            text: 'No action items detected in this meeting',
            owner: null,
            due_date: null
        });
    }
}

async function generateStructuredNoteWithRetry(chunk, maxRetries = 5, baseDelay = 500) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await GroqService.generateStructuredNote(chunk);
            if (response.status === 429) {
                throw new Error(`Rate limit: ${response.status}`);
            }
            return response;
        } catch (error) {
            if (attempt === maxRetries) {
                throw new Error(`Failed after ${maxRetries + 1} attempts: ${error.message}`);
            }
            const backoff = baseDelay * 2 ** attempt;
            const jitter = Math.random() * 100;
            const delay = backoff + jitter;
            console.warn(`Attempt ${attempt + 1} failed. Retrying in ${delay.toFixed(0)}ms...`);
            await new Promise((r) => setTimeout(r, delay));
        }
    }
}

async function generateLLMNote(transcript, uuid) {
    // processing meeting into note.
    const chunks = chunkTranscript(transcript, 5000);
    const resultNotes = [];
    let llmRaw = "";
    for (const [i, chunk] of chunks.entries()) {
        console.log(`Processing transcript chunk ${i + 1} / ${chunks.length} for meeting with id: ${uuid}.`);

        //console.log(chunk);
        const response = await generateStructuredNoteWithRetry(chunk);
        let result;
        try {
            const raw = response.choices[0].message.content || "{}";
            if (raw !== "{}") {
                llmRaw += " " + raw;
            }
            result = JSON.parse(raw);
            //console.log(result);
        }
        catch (error) {
            console.log(`Chunk ${i} failed parsing. LLM returned invalid JSON for meeting: ${uuid}`);
            continue;
        }

        resultNotes.push(result);
    };

    // merge chunks note results and insert it into database.
    const mergedNote = mergeChunkNotes(resultNotes);
    if (!mergedNote) {
        console.log('No notes generated.');
        return null;
    }
    validateMeetingNote(mergedNote);

    return [mergedNote, llmRaw];
}

async function generateNote(uuid, transcript) {
    const [meetingNote, llmRaw] = await generateLLMNote(transcript, uuid);
    if (meetingNote) {
        console.log("Inseting meeting note!");
        await SupabaseService.insertNote(meetingNote, uuid, llmRaw);
    }
}

async function generateMeetingNote(uuid) {
    const { data, error } = await SupabaseService.getMeeting(uuid);

    if (error) {
        console.log(error);
        return;
    }

    await generateNote(uuid, data.raw_transcript);
}

async function generateAllMeetingWithoutNotes() {
    const { data, error } = await SupabaseService.getMeetingsWithoutNote();
    
    if (error) {
        console.log(error);
        return;
    }

    for(const m of data) {
       await generateNote(m.id, m.raw_transcript);
    }
}

async function generateNoteMain() {
    if (process.argv.length > 2) {
       await generateMeetingNote(process.argv[2]);
    } else {
        await generateAllMeetingWithoutNotes();
    }

    console.log("Task completed!");
}

if (process.argv[1].includes('generateMeetingNote.js')) {
    generateNoteMain();
}