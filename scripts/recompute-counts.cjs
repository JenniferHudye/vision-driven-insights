#!/usr/bin/env node
// Recomputes wordCount and readingMinutes for every entry in posts.json and
// queue.json from the actual body text. Run after writing or editing articles.
const { getPosts, getQueue, setPosts, setQueue } = require("./lib/site-data.cjs");

function wordCount(html) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
  return text ? text.split(" ").length : 0;
}

function fix(list) {
  return list.map((e) => {
    const wc = wordCount(e.body || "");
    return { ...e, wordCount: wc, readingMinutes: Math.max(1, Math.round(wc / 220)) };
  });
}

const posts = fix(getPosts());
const queue = fix(getQueue());
setPosts(posts);
setQueue(queue);

const all = [...posts, ...queue];
console.log(`recompute-counts: updated ${all.length} entr${all.length === 1 ? "y" : "ies"}.`);
for (const e of all) console.log(`  ${e.slug}: ${e.wordCount} words, ${e.readingMinutes} min`);
