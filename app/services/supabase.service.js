import { supabase } from "../scripts/supabase.js";

/**
 * Service class for calling supabase database.
 */
export class SupabaseService {
    /**
     * Get all meetings from database.
     * 
     * @returns
     */

    static async getAllMeetings() {
        return supabase
            .from('meetings')
            .select('id, title, meeting_date');
    }

    /**
     * Get meeting by id from supabase.
     * 
     * @param {string} uuid - meeting id.
     * @returns 
     */
    static async getMeeting(uuid) {
        return supabase
            .from('meetings')
            .select('id, raw_transcript')
            .eq('id', uuid)
            .limit(1)
            .single();
    }

    /**
     * Get all meetings that do not have notes.
     * 
     * @returns 
     */
    static async getMeetingsWithoutNote() {
        return supabase
            .from('meetings')
            .select(`
                    id,
                    raw_transcript,
                    notes( id )
                `)
            .is('notes', null);
    }
    
    /**
     * Insert meeting into database.
     * 
     * @param {*} meta - include title, meeting_date and source.
     * @param {*} transcript - meeting raw transcript.
     * @returns 
     */
    static async insertMeeting(meta, transcript) {
        return supabase
            .from('meetings')
            .insert({
                title: meta.title,
                meeting_date: meta.meeting_date,
                source: meta.source,
                raw_transcript: transcript
            });
    }

    /**
     * Insert meeting note.
     * 
     * @param {*} note
     * @param {*} meetingUUID - meeting id.
     * @param {*} llmRaw - raw response from LLM model.
     * @returns 
     */
    static async insertNote(note, meetingUUID, llmRaw) {
        return supabase
            .from('notes')
            .insert({
                meeting_id: meetingUUID,
                summary: note.summary,
                action_items: note.action_items,
                key_takeaways: note.key_takeaways,
                topics: note.topics,
                next_steps: note.next_steps,
                llm_raw: llmRaw
            });
    }
}