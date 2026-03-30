import { GroqService } from "./groq.service.js";

export class LLMFactory {
    static async generateNote(llm, transcript) {
        switch(llm.toLowerCase()) {
            case "groq":
                //return GroqService.generateStructuredNoteWithRetry(transcript);

            default:
                throw new Error(`Unsupported LLM: ${llm}`);
        }
    }
}