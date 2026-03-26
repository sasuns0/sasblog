require('dotenv').config();

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const db = require('../db');

const POSTS_DIR = path.join(__dirname, '..', 'posts');

async function importPosts() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { data, content } = matter(raw);

    const slug = data.slug || path.basename(file, '.md');
    const title = data.title || slug;
    const published = data.published !== false;
    const published_at = data.date ? new Date(data.date) : new Date();
    const html = marked(content);

    await db.query(
      `INSERT INTO posts (slug, title, content, raw_markdown, published, published_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (slug) DO UPDATE
         SET title = EXCLUDED.title,
             content = EXCLUDED.content,
             raw_markdown = EXCLUDED.raw_markdown,
             published = EXCLUDED.published,
             published_at = EXCLUDED.published_at`,
      [slug, title, html, raw, published, published_at]
    );

    console.log(`Imported: ${slug}`);
  }

  await db.end();
}

importPosts().catch(err => {
  console.error(err);
  process.exit(1);
});
