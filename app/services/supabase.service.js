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

    static async insertNote() {
        return supabase
            .from('notes')
            .insert({

            });
    }
}