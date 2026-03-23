import { SupabaseService } from "../services/supabase.service.js";


async function generateMeetingNote(uuid) {
    const {data, error} = await SupabaseService.getMeeting(uuid);

    if(error) {
        console.log(error);
        return;
    }

    
}

if(process.argv[1].includes('generateMeetingNote.js')) {
    if(process.argv.length > 2) {
        generateMeetingNote(process.argv[2]);
    } else {
        console.log('Can\'t execute generateMeetingNote. Please provide meeting id as argument.');
    }
}