import { supabase } from './supabase.js'

async function listMeetings() {
    const {data, error} = await supabase
        .from('meetings')
        .select('id, title, meeting_date');

        if(error) {
            console.log(error); 
            return;
        }

        console.log("Meetings:");

        data.forEach((m) => {
            console.log(`${m.id} ${m.title} ${m.meeting_date}`);
        });
};

listMeetings();