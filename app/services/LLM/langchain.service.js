import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq"
import {UnsupportedLLMError} from "../../exceptions/unsupportedLLMError.js"


import { MeetingNoteSchema } from "./schemas/meetingNote.schema.js";

export class LangChainService {
    static model;

    static getModel(llm) {
        switch (llm) {
            case "groq":
                return new ChatGroq({
                    apiKey: process.env.GROQ_API_KEY,
                    model: "openai/gpt-oss-20b"
                });

            case "gemini":
                return new ChatGoogleGenerativeAI({
                    apiKey: process.env.GOOGLE_API_KEY,
                    model: "gemini-2.5-flash"
                });

            default:
                throw new UnsupportedLLMError(`Unsupported LLM: ${llm}`);
        }
    }

    static async generateStructuredNote(chunk, llm) {
        const model = this.getModel(llm);

        const parser = StructuredOutputParser.fromZodSchema(MeetingNoteSchema);

        const formatInstructions = parser.getFormatInstructions();

        const prompt = PromptTemplate.fromTemplate("Given a meeting transcript, generate structured notes. Form summary into one sentence. Include both names for owner. If no owner/due_date → return null. Avoid duplicates. {format_instructions} Transcript:{transcript}");

        const formattedPrompt = await prompt.format({
            transcript: chunk,
            format_instructions: formatInstructions
        });

        const response = await model.invoke(formattedPrompt);

        try {
            return await parser.parse(response.content);
        } catch (e) {
            throw new Error("Failed to parse structured output");
        }
    }

    static async generateStructuredNoteWithRetry(chunk, llm, maxRetries = 5, baseDelay = 500) {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const response = await this.generateStructuredNote(chunk, llm);
                if (response.status === 429) {
                    throw new Error(`Rate limit: ${response.status}`);
                }
                return response;
            } catch (error) {
                if(error instanceof UnsupportedLLMError) {
                    console.log(error.message);
                    throw error;
                }

                console.log(error);
                if (attempt === maxRetries) {
                    throw new Error(`Failed after ${maxRetries + 1} attempts: ${error.message}`);
                }
                const backoff = baseDelay * 2 ** attempt;
                const jitter = Math.random() * 100;
                const delay = backoff + jitter;
                console.warn(`Attempt ${attempt + 1} failed. Retrying in ${delay.toFixed(0)}ms...`);
                await new Promise((r) => setTimeout(r, delay));
            }
        }
    }
}