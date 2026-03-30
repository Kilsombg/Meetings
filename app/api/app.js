import express from "express";
import { meetingsRouter } from "./routers/meetings.js";

const app = express();

app.use(express.json()); 
app.use('/api/meetings', meetingsRouter);

app.listen(8080, () => {
    console.log(`Server is running on http://localhost:8080`);
});