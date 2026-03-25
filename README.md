# sasblog

A minimal blog built with Node.js, Express, and PostgreSQL.

## Stack

- **Node.js + Express** — server
- **PostgreSQL** — post storage
- **Markdown** — post format (via `marked` + `gray-matter`)
- **Vanilla HTML/CSS/JS** — no frontend frameworks

## Setup

```bash
npm install
createdb sasblog
psql sasblog < schema.sql
```

## Writing Posts

Create a `.md` file in `posts/`:

```markdown
---
title: My Post
slug: my-post
date: 2026-03-25
published: true
---

Post content here.
```

Then import into the database:

```bash
node scripts/import.js
```

## Running

```bash
node server.js
```

Open `http://localhost:3000`.

## Deploy (Railway)

1. Push to GitHub
2. New Project → Deploy from GitHub repo
3. Add PostgreSQL plugin
4. Run once via Railway shell:
   ```bash
   psql $DATABASE_URL < schema.sql
   node scripts/import.js
   ```
