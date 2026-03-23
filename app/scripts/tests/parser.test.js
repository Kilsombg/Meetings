import  {parseMeetingMeta}  from '../ingest.js';
import {jest} from '@jest/globals'

describe('parseMeetingMeta - date check', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should parse date in previous year', () => {
    const input = "Team update - September 04\n---";
    jest.setSystemTime(new Date('2026-02-21'));
    
    const result = parseMeetingMeta(input);

    expect(result.meeting_date).toBe("2025-09-04");
  });

  test('should parse date in same year with different month', () => {
    const input = "Team update - January 21\n---";
    jest.setSystemTime(new Date('2026-02-21'));

    const result = parseMeetingMeta(input);

    expect(result.meeting_date).toBe("2026-01-21");
  });


  test('should parse date in same year and same month', () => {
    const input = "Team update - March 07\n---";
    jest.setSystemTime(new Date('2026-03-15'));

    const result = parseMeetingMeta(input);

    expect(result.meeting_date).toBe("2026-03-07");
  });

  test('should parse same year with same date', () => {
    const input = "Team update - April 14\n---";
    jest.setSystemTime(new Date('2026-04-14'));

    const result = parseMeetingMeta(input);

    expect(result.meeting_date).toBe("2026-04-14");
  });
});


describe('parseMeetingMeta - title check', () => {
  test('extracts title correctly', () => {
    const input = "AI TEAM MEETING - July 17\n---";

    const result = parseMeetingMeta(input);

    expect(result.title).toBe("AI TEAM MEETING");
  });


  test('extracts title correctly', () => {
    const input = " - June 06\n---";

    const result = parseMeetingMeta(input);

    expect(result.title).toBe("");
  });
});