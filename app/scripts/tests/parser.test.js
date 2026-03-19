import  {parseMeetingMeta}  from '../ingest.js';
import {test, expect} from "@jest/globals";

test('parses meeting date correctly', () => {
  const input = "Team update - September 04\n---";
  
  const result = parseMeetingMeta(input);

  expect(result.meeting_date).toBe("2025-09-04");
});

test('extracts title correctly', () => {
  const input = "AI TEAM MEETING - July 17\n---";

  const result = parseMeetingMeta(input);

  expect(result.title).toBe("AI TEAM MEETING");
});