import { SupabaseService } from '../services/supabase.service.js'

async function listMeetings() {
    const {data, error} = await SupabaseService.getAllMeetings();

        if(error) {
            console.log(error); 
            return;
        }

        console.log("Meetings:");

        data.forEach((m) => {
            console.log(`${m.id} ${m.title} ${m.meeting_date}`);
        });
};


if (process.argv[1].includes('listMeetings.js')) {
    listMeetings();
}