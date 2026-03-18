create table meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  meeting_date date not null,
  source text not null,
  raw_transcript text not null,
  created_at timestamp default now()
);

create table notes (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null,
  summary text,
  action_items jsonb,
  key_takeaways jsonb,
  topics jsonb,
  next_steps jsonb,
  created_at timestamp default now(),

  constraint fk_meeting foreign key (meeting_id) references meetings(id) on delete cascade
);