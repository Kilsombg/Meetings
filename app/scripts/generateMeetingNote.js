import { SupabaseService } from "../services/supabase.service.js";
import { chunkTranscript } from "../helpers/TextFormatting.js";
import { LLMFactory } from "../services/LLM/llm.factory.js";

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
    if (!mergedNote?.action_items || mergedNote?.action_items.length === 0) {
        mergedNote.action_items.push({
            text: 'No action items detected in this meeting',
            owner: null,
            due_date: null
        });
    }
}

async function generateLLMNote(transcript, uuid, llm) {
    // processing meeting into note.
    const chunks = chunkTranscript(transcript, 5000);
    const resultNotes = [];
    let llmRaw = "";
    for (const [i, chunk] of chunks.entries()) {
        console.log(`Processing transcript chunk ${i + 1} / ${chunks.length} for meeting with id: ${uuid}.`);

        //console.log(chunk);
        const response = await LLMFactory.generateNote(llm, transcript);
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

    // merge chunks note results and validate it.
    const mergedNote = mergeChunkNotes(resultNotes);
    if (!mergedNote) {
        console.log('No notes generated.');
        return null;
    }
    validateMeetingNote(mergedNote);

    return [mergedNote, llmRaw];
}

async function generateNote(uuid, transcript, llm) {
    const [meetingNote, llmRaw] = await generateLLMNote(transcript, uuid, llm);

    // insert meeting note if generated successfully.
    if (meetingNote) {
        console.log("Inseting meeting note!");
        await SupabaseService.insertNote(meetingNote, uuid, llmRaw, llm);
    }
}

export async function generateMeetingNote(uuid, llm) {
    const { data, error } = await SupabaseService.getMeeting(uuid);

    if (error) {
        console.log(error);
        return;
    }

    await generateNote(uuid, data.raw_transcript, llm);
}

async function generateAllMeetingWithoutNotes(llm) {
    const { data, error } = await SupabaseService.getMeetingsWithoutNote();
    
    if (error) {
        console.log(error);
        return;
    }

    for(const m of data) {
       await generateNote(m.id, m.raw_transcript, llm);
    }
}

async function generateNoteMain() {
    const llm = "groq";
    if (process.argv.length > 2) {
       await generateMeetingNote(process.argv[2], llm);
    } else {
        await generateAllMeetingWithoutNotes(llm);
    }

    console.log("Task completed!");
}

if (process.argv[1].includes('generateMeetingNote.js')) {
    generateNoteMain();
}