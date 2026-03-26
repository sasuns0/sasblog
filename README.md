# sasblog

A minimal blog built with Node.js, Express, and PostgreSQL.

## Stack

- **Node.js + Express** — server
- **PostgreSQL** — post storage
- **Markdown** — post format (via `marked` + `gray-matter`)
- **Vanilla HTML/CSS/JS** — no frontend frameworks
- **AWS EC2** — hosting
- **Nginx** — reverse proxy
- **PM2** — process manager

## Local Setup

```bash
pnpm install
createdb sasblog
psql sasblog < schema.sql
```

Create a `.env` file in the project root:

```
POSTGRES_URL=postgresql://localhost/sasblog
PORT=3000
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

## Running Locally

```bash
node server.js
```

Open `http://localhost:3000`.

## Deploy (AWS EC2)

Deployments are automated via GitHub Actions. Push to `main` to trigger a deployment.

The workflow SSHes into the EC2 instance and runs:

```bash
git pull origin main
pnpm install --frozen-lockfile
pm2 restart sasblog
```
