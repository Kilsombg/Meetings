import { PDFParse } from 'pdf-parse';
import mammoth from "mammoth";
import { processMeetingTranscript } from "../scripts/ingest.js";

export class MeetingsService {
    static async uploadFromFile(file) {
        let text;

        if (file.mimetype === "application/pdf") { // pdf
            const parser = new  PDFParse({data: file.buffer});
            text = (await parser.getText()).text;
        } else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") { // docx
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            text = result.value;
        } else {
            throw new Error('Uploaded file must be PDF or word document.');
        }

        await processMeetingTranscript(text);
    }
}