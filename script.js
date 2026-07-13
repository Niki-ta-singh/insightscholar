/* =========================================================
   INSIGHT SCHOLAR — site script
   -----------------------------------------------------------
   1) SET YOUR GOOGLE FORM LINK BELOW.
      This is the single most important edit in this file.
      Every "Register" button on the site opens this link
      in a new tab. If your form has a dropdown / short-answer
      field for "Which course?", have people pick it there,
      or create one Google Form per course and map it below in
      COURSE_DATA using the optional "formUrl" field.
   ========================================================= */

const GOOGLE_FORM_URL = "https://forms.gle/mhqiQmN9z27biwUx7";

/* Course catalogue. Edit freely — cards are rendered from this array.
   If a course needs its OWN form link (instead of the shared one above),
   just add a "formUrl" key to that course's object. */
const COURSE_DATA = [
  {
    domain: "AI / MACHINE LEARNING",
    level: "Beginner friendly",
    title: "AI from Scratch",
    description:
      "Start from plain Python and build up to neural networks — no ML background assumed. Math is taught alongside the code that needs it.",
    tags: ["Online", "Offline", "10 weeks"]
  },
  {
    domain: "PROGRAMMING",
    level: "Beginner friendly",
    title: "Python",
    description:
      "Core language, data structures, OOP and scripting, moving quickly into real projects like automation tools and small APIs.",
    tags: ["Online", "Offline", "8 weeks"]
  },
  {
    domain: "PROGRAMMING",
    level: "Beginner friendly",
    title: "Java",
    description:
      "Object-oriented fundamentals, collections and multithreading, building toward the backend concepts used in enterprise systems.",
    tags: ["Online", "Offline", "8 weeks"]
  },
  {
    domain: "WEB DEVELOPMENT",
    level: "Intermediate",
    title: "Full Stack Development",
    description:
      "Frontend, backend, databases and deployment in one track — ship a complete, working application by the end of the course.",
    tags: ["Online", "Offline", "12 weeks"]
  },
  {
    domain: "GENERATIVE AI",
    level: "Professional",
    title: "Professional Course: Gen AI",
    description:
      "LLMs, prompt engineering, RAG pipelines and agent workflows for people who want to build production-grade AI features.",
    tags: ["Online", "Offline", "12 weeks"]
  }
];

/* =========================== Render course cards =========================== */
function renderCourses(){
  const grid = document.getElementById("courseGrid");
  if(!grid) return;

  grid.innerHTML = COURSE_DATA.map((course) => `
    <article class="course-card">
      <div class="tag-row">
        <span class="course-domain">${course.domain}</span>
        <span class="course-level">${course.level}</span>
      </div>
      <h3>${course.title}</h3>
      <p>${course.description}</p>
      <div class="course-meta">
        ${course.tags.map(t => `<span>${t}</span>`).join("")}
      </div>
      <a class="btn btn-primary js-form-link" href="https://forms.gle/mhqiQmN9z27biwUx7" target="_blank" rel="noopener">
        Register for this course
      </a>
    </article>
  `).join("");
}

/* Fill in every other "Open Google Form" style link (e.g. footer) that
   didn't get a per-course link, so there is exactly one place to edit. */
function wireGenericFormLinks(){
  document.querySelectorAll('a.js-form-link[href="#"]').forEach(a => {
    a.setAttribute("href", GOOGLE_FORM_URL);
  });
}

/* =========================== Reveal cards on scroll =========================== */
function observeCards(){
  const cards = document.querySelectorAll(".course-card");
  if(!("IntersectionObserver" in window)){
    cards.forEach(c => c.classList.add("in-view"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  cards.forEach(c => io.observe(c));
}

/* =========================== Mobile nav toggle =========================== */
function wireNavToggle(){
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if(!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* =========================== FAQ accordion =========================== */
function wireFaq(){
  document.querySelectorAll(".faq-item").forEach(item => {
    const btn = item.querySelector(".faq-q");
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(openItem => {
        openItem.classList.remove("open");
        openItem.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if(!isOpen){
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* =========================== Hero terminal typing effect =========================== */
function typeHeroTerminal(){
  const target = document.getElementById("typingTarget");
  if(!target) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const lines = [
    { text: "$ insight-scholar --list-courses", cls: "prompt" },
    { text: "  ai-from-scratch, python, java, full-stack, gen-ai", cls: "comment" },
    { text: "$ insight-scholar --mode", cls: "prompt" },
    { text: "  online | offline", cls: "comment" },
    { text: "$ insight-scholar --register", cls: "prompt" },
    { text: "  opening Google Form...", cls: "comment" }
  ];

  if(prefersReducedMotion){
    target.innerHTML = lines.map(l => `<div class="${l.cls}">${l.text}</div>`).join("");
    return;
  }

  target.innerHTML = "";
  let lineIndex = 0;
  let charIndex = 0;
  let currentLineEl = null;

  function typeChar(){
    if(lineIndex >= lines.length){
      const caret = document.createElement("span");
      caret.className = "terminal-caret";
      target.appendChild(caret);
      return;
    }
    if(charIndex === 0){
      currentLineEl = document.createElement("div");
      currentLineEl.className = lines[lineIndex].cls;
      target.appendChild(currentLineEl);
    }
    const fullText = lines[lineIndex].text;
    if(charIndex <= fullText.length){
      currentLineEl.textContent = fullText.slice(0, charIndex);
      charIndex++;
      setTimeout(typeChar, 18 + Math.random() * 22);
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(typeChar, 260);
    }
  }
  typeChar();
}

/* =========================== Footer year =========================== */
function setYear(){
  const el = document.getElementById("year");
  if(el) el.textContent = new Date().getFullYear();
}

/* =========================== Init =========================== */
document.addEventListener("DOMContentLoaded", () => {
  renderCourses();
  wireGenericFormLinks();
  observeCards();
  wireNavToggle();
  wireFaq();
  typeHeroTerminal();
  setYear();
});
