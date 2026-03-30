export class UnsupportedLLMError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnsupportedLLMError";
    }
}