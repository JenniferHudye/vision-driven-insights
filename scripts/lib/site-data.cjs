// Central loader for the project's JSON content. Every script requires this
// instead of relative-requiring data files directly, so paths stay correct
// no matter what directory a script is invoked from.
const path = require("path");
const fs = require("fs");

const ROOT = path.resolve(__dirname, "..", "..");

function readJson(relPath) {
  const full = path.join(ROOT, relPath);
  return JSON.parse(fs.readFileSync(full, "utf8"));
}

function writeJson(relPath, data) {
  const full = path.join(ROOT, relPath);
  fs.writeFileSync(full, JSON.stringify(data, null, 2) + "\n", "utf8");
}

module.exports = {
  ROOT,
  readJson,
  writeJson,
  paths: {
    site: "config/site.json",
    voiceProfile: "config/voice-profile.md",
    posts: "data/blog/posts.json",
    queue: "data/blog/queue.json",
    frameworks: "data/frameworks.json",
    pillars: "data/pillars.json",
    testimonials: "data/testimonials.json",
    caseStudies: "data/case-studies.json",
    speaking: "data/speaking.json",
    press: "data/press.json",
    books: "data/books.json",
    courses: "data/courses.json",
    awards: "data/awards.json",
    trustedBy: "data/trusted-by.json",
    faq: "data/faq.json",
  },
  getSite() {
    return readJson("config/site.json");
  },
  getPosts() {
    return readJson("data/blog/posts.json");
  },
  setPosts(posts) {
    writeJson("data/blog/posts.json", posts);
  },
  getQueue() {
    return readJson("data/blog/queue.json");
  },
  setQueue(queue) {
    writeJson("data/blog/queue.json", queue);
  },
  getPillars() {
    return readJson("data/pillars.json");
  },
  getFrameworks() {
    return readJson("data/frameworks.json");
  },
  getTestimonials() {
    return readJson("data/testimonials.json");
  },
  getCaseStudies() {
    return readJson("data/case-studies.json");
  },
  getSpeaking() {
    return readJson("data/speaking.json");
  },
  getPress() {
    return readJson("data/press.json");
  },
  getBooks() {
    return readJson("data/books.json");
  },
  getCourses() {
    return readJson("data/courses.json");
  },
  getAwards() {
    return readJson("data/awards.json");
  },
  getTrustedBy() {
    return readJson("data/trusted-by.json");
  },
  getFaq() {
    return readJson("data/faq.json");
  },
};
