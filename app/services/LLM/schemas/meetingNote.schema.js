import z from "zod";

export const MeetingNoteSchema = z.object({
  summary: z.string(),

  action_items: z.array(
    z.object({
      text: z.string(),
      owner: z.string().nullable(),
      due_date: z.string().nullable()
    })
  ),

  decisions: z.array(z.string()),
  key_takeaways: z.array(z.string()),
  topics: z.array(z.string()),

  next_steps: z.array(
    z.object({
      text: z.string(),
      owner: z.string().nullable()
    })
  )
});