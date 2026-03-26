import { validateMeetingNote, mergeChunkNotes } from "../generateMeetingNote.js"

describe('validateMeetingNote', () => {
    test('note without action items should get item for no action detected.', () => {
        const note = {
            summary: 'test',
            action_items: [],
            decisions: ['test'],
            key_takeaways: ['test'],
            topics: ['test'],
            next_steps: [{}]
        };

        const expectedNote = {
            action_items: [
                {
                    text: 'No action items detected in this meeting',
                    owner: null,
                    due_date: null
                }
            ]
        };

        validateMeetingNote(note);

        expect(note.action_items).toStrictEqual(expectedNote.action_items);
    });


    test('note with action items should not be changed.', () => {
        const note = {
            summary: 'test',
            action_items: [
                {
                    text: 'This is a test.',
                    owner: "Test",
                    due_date: null
                },
                {
                    text: 'This is a test2.',
                    owner: "Test2",
                    due_date: null
                }
            ],
            decisions: ['test'],
            key_takeaways: ['test'],
            topics: ['test'],
            next_steps: [{}]
        };

        const expectedNote = {
            action_items: [
                {
                    text: 'This is a test.',
                    owner: "Test",
                    due_date: null
                },
                {
                    text: 'This is a test2.',
                    owner: "Test2",
                    due_date: null
                }
            ]
        };

        validateMeetingNote(note);

        expect(note.action_items).toStrictEqual(expectedNote.action_items);
    });
});