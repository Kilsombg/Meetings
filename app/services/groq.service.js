import Groq from "groq-sdk"

const groq = new Groq();

export class GroqService {
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
}