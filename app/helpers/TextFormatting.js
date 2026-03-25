export function chunkTranscript(text, chunkSize = 4000) {
    const chunks = [];

    const blocks = text.split(/\n(?=\d{1,2}:\d{2})/);

    let currentChunk = "";

    for(const block of blocks) {
        // if block exceed chunkSize when included.
        if(currentChunk.length + block.length > chunkSize) {
            if(currentChunk) {
                chunks.push(currentChunk);
                currentChunk = "";
            }

            // break the block into chunks if exceeds
            if(block.length > chunkSize) {
                for(let i=0; i<block.length; i+=chunkSize) {
                    chunks.push(block.slice(i, i+chunkSize));
                }
                continue;
            }
        }

        currentChunk += (currentChunk ? " " : "") + block;
    }

    // if there is chunk left, add it
    if(currentChunk) {
        chunks.push(currentChunk);
    }

    return chunks;
}
