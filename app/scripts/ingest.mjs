import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import {supabase} from './supabase.js';


const MEETINGS_DIR = path.join(process.cwd(), "transcripts");

async function extractText(filePath) {
  const rawText = (await mammoth.extractRawText({ path: filePath})).value;
  const splittedText = rawText.split('---');

  if(splittedText.length < 2) return null;

  return {
    meta: splittedText[0], 
    transcript: splittedText[1]
  };
}

function parseMeetingMeta(meetingMeta) {
  const lines = meetingMeta.split('\n');
  const meta = lines[0].split('-');

  const time = meta[1].split(' ');
  const currentYear = new Date().getFullYear();
  let date = new Date(`${meta[1]} ${currentYear}`);

  if(date > new Date()) date.setFullYear(date.getFullYear()-1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  
  return {
    title: meta[0],
    source: "teams",
    meeting_date: `${year}-${month}-${day}`
  }
}

async function insertMeeting(meta, transcript) {
  const {error} = await supabase
    .from('meetings')
    .insert({
      title: meta.title,
      meeting_date: meta.meeting_date,
      source: meta.source,
      raw_transcript: transcript
    });

    if(error) console.log('Insert error', error);
}

async function ingestMeetings() {
    const files = fs.readdirSync(MEETINGS_DIR);

    for(const file of files) {
      if(!file.endsWith('.docx')) continue;

      const filePath = path.join(MEETINGS_DIR, file);
      console.log(`Processing: ${file}`);

      const meeting = await extractText(filePath);
      if(meeting === null) continue;
      const meta = parseMeetingMeta(meeting.meta);
      console.log(meta.meeting_date);

      insertMeeting(meta, meeting.transcript);
    }
}

ingestMeetings();