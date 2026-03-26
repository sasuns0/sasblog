require('dotenv').config();

const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

function layout(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <header>
    <a href="/">works on my machine</a>
  </header>
  <main>
    ${body}
  </main>
</body>
</html>`;
}

app.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT slug, title, published_at
       FROM posts
       WHERE published = true
       ORDER BY published_at DESC`
    );

    const items = rows.map(post => {
      const date = post.published_at
        ? new Date(post.published_at).toISOString().slice(0, 10)
        : '';
      return `<li><span>${date}</span> <a href="/post/${post.slug}">${post.title}</a></li>`;
    }).join('\n');

    const body = `<ul class="post-list">${items}</ul>`;
    res.send(layout('sasblog', body));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/post/:slug', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT title, content, published_at
       FROM posts
       WHERE slug = $1 AND published = true`,
      [req.params.slug]
    );

    if (!rows.length) return res.status(404).send('Post not found');

    const post = rows[0];
    const date = post.published_at
      ? new Date(post.published_at).toISOString().slice(0, 10)
      : '';

    const body = `
      <article>
        <h1>${post.title}</h1>
        <time>${date}</time>
        ${post.content}
      </article>`;

    res.send(layout(post.title, body));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
