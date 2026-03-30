import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { SupabaseService } from '../services/supabase.service.js';


const MEETINGS_DIR = path.join(process.cwd(), "transcripts");

function parseText(rawText) {
  const splittedText = rawText.split('---');

  if (splittedText.length < 2) {
    return null;
  }

  return {
    meta: splittedText[0],
    transcript: splittedText[1]
  };
}

export function parseMeetingMeta(meetingMeta) {
  const lines = meetingMeta.split('\n');
  const meta = lines[0].split('-');

  const currentYear = new Date().getFullYear();
  let date = new Date(`${meta[1]} ${currentYear}`);

  if (date > new Date()) {
    date.setFullYear(date.getFullYear() - 1);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');


  return {
    title: meta[0].trim(),
    source: "teams",
    meeting_date: `${year}-${month}-${day}`
  }
}

async function insertMeeting(meta, transcript) {
  const { error } = await SupabaseService.insertMeeting(meta, transcript);

  if (error) {
    if (error.code === '23505') {
      console.log('Duplicate meeting skipped.');
    } else {
      console.log('Insert error', error);
    }
  }
}

export async function processMeetingTranscript(rawText) {
  const meeting = parseText(rawText);
  if (meeting === null) {
    return;
  }
  const meta = parseMeetingMeta(meeting.meta);
  //console.log(meta.meeting_date);

  await insertMeeting(meta, meeting.transcript);
}

async function ingestMeetings() {
  const files = fs.readdirSync(MEETINGS_DIR);

  for (const file of files) {
    if (!file.endsWith('.docx')) {
      continue;
    }

    const filePath = path.join(MEETINGS_DIR, file);
    console.log(`Processing: ${file}`);

    const rawText = (await mammoth.extractRawText({ path: filePath })).value;
    processMeetingTranscript(rawText);
  }
}

if (process.argv[1].includes('ingest.js')) {
  ingestMeetings();
}