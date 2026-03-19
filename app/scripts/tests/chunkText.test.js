import { chunkText } from "../ingest";
import {test, expect} from "@jest/globals";

test('chunk text into chunks of 10', () => {
    const text = "this text must be divided into 4 chunks.";

    const chunks = chunkText(text, 10);

    expect(chunks.length).toEqual(4);
    expect(chunks[0]).toBe("this text ");
})