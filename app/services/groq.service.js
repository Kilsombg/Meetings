import Groq from "groq-sdk"

const groq = new Groq();

/**
 * Service class using groq LLM models.
 */
export class GroqService {
    /**
     * Generate structured note from raw transcript from meeting.
     * 
     * Chunk meeting transcript if the size is over model limit.
     * Better use generateStructuredNoteWithRetry() to not lose some transcripts chunks.
     * 
     * @param {string} transcript - meeting raw transcript. If transcript is too big, it is better to use chunks.
     * @returns strict response from groq model.
     */
    static async generateStructuredNote(transcript) {
        return groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content: "Given a meeting transcript, generate structured notes. Form summary into one sentence. Include both names for owner."
                },
                {
                    role: "user",
                    content: transcript,
                },
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "meeting_note",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            summary: { type: "string" },
                            action_items: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        text: { type: "string" },
                                        owner: { type: ["string", "null"] },
                                        due_date: { type: ["string", "null"] }
                                    },
                                    required: ["text", "owner", "due_date"],
                                    additionalProperties: false
                                },
                            },
                            decisions: {
                                type: "array",
                                items: { type: "string" }
                            },
                            key_takeaways: {
                                type: "array",
                                items: { type: "string" }
                            },
                            topics: {
                                type: "array",
                                items: { type: "string" }
                            },
                            next_steps: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        text: { type: "string" },
                                        owner: { type: ["string", "null"] }
                                    },
                                    required: ["text", "owner"],
                                    additionalProperties: false
                                }
                            },
                        },
                        required: ["summary", "action_items", "decisions", "key_takeaways", "topics", "next_steps"],
                        additionalProperties: false
                    }
                }
            }
        })
    }


    /**
     * Generate structured note from raw transcript from meeting with retry.
     * 
     * @param {*} chunk - meeting raw transcript chunk.
     * @param {*} maxRetries - after maxRetries note generations stops and returns failure.
     * @param {*} baseDelay - baseDelay to start from. Value is in [ms].
     * @returns 
     */
    static async  generateStructuredNoteWithRetry(chunk, maxRetries = 5, baseDelay = 500) {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const response = await this.generateStructuredNote(chunk);
                if (response.status === 429) {
                    throw new Error(`Rate limit: ${response.status}`);
                }
                return response;
            } catch (error) {
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