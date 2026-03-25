CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  raw_markdown TEXT NOT NULL,
  published_at TIMESTAMP,
  published BOOLEAN DEFAULT false
);
