/* VocabVibe: app.js = all the logic. Sections are numbered below. */
/* ===== 1. SETTINGS AND SMALL HELPER FUNCTIONS ===== */
const KEY = "vocabvibe_words", PKEY = "vocabvibe_progress", SKEY = "vocabvibe_status";
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };

/* ===== 2. LANGUAGE AND SAVING (each language has its own words and progress) ===== */
const DEFAULTS = { en: DEFAULT_WORDS, ko: DEFAULT_KO };
let lang = load("vocabvibe_lang", "en"); if (!DEFAULTS[lang]) lang = "en";
let words, prog;
const sfx = () => lang === "en" ? "" : "_" + lang; // English keeps the old keys, so saved words stay
function loadLang() { // words come from data.js; only marks and progress come from the browser
  words = structuredClone(DEFAULTS[lang]);
  const st = load(SKEY + sfx(), null) || Object.fromEntries((load(KEY + sfx(), []) || []).map(o => [o.id, o.status])); // first run: reuse old marks
  words.forEach(w => w.status = st[w.id] || "new");
  prog = load(PKEY + sfx(), { best: 0, streak: 0, last: "" });
}
function save() { // saves only marks and progress, never the words
  localStorage.setItem(SKEY + sfx(), JSON.stringify(Object.fromEntries(words.filter(w => w.status !== "new").map(w => [w.id, w.status]))));
  localStorage.setItem(PKEY + sfx(), JSON.stringify(prog)); stats();
}
function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(t.h); t.h = setTimeout(() => t.classList.remove("show"), 2200); }
/* ===== 3. STREAK AND PROGRESS NUMBERS ===== */
function touch() { // daily streak
  const today = new Date().toDateString(); if (prog.last === today) return;
  prog.streak = prog.last === new Date(Date.now() - 864e5).toDateString() ? prog.streak + 1 : 1; prog.last = today; save();
}
function stats() {
  $("#s-total").textContent = words.length;
  $("#s-known").textContent = words.filter(w => w.status === "known").length;
  $("#s-best").textContent = prog.best + "%";
  $("#s-streak").textContent = prog.streak;
}
function say(t) { if ("speechSynthesis" in window) { const u = new SpeechSynthesisUtterance(t); u.lang = lang === "ko" ? "ko-KR" : "en-US"; u.rate = .9; speechSynthesis.cancel(); speechSynthesis.speak(u); } else toast("Speech is not supported in this browser."); }

/* ===== 4. NAVIGATION (switch between Home, Learn, Flashcards, Quiz) ===== */
function show(v) {
  ["home", "learn", "flash", "quiz"].forEach(n => $("#v-" + n).hidden = n !== v);
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("on", b.dataset.view === v));
  scrollTo(0, 0);
  if (v === "flash") buildDeck();
  if (v === "quiz") { $("#qz-setup").hidden = false; $("#qz-play").hidden = true; $("#qz-end").hidden = true; }
}
document.querySelectorAll(".tab").forEach(b => b.onclick = () => show(b.dataset.view));

/* ===== 5. LEARN TAB (search, filters, word cards) ===== */
function cats() { return [...new Set(words.map(w => w.category).filter(Boolean))].sort(); }
/* ----- CLASS PICKERS: choose a level, then a class (used by Learn, Flashcards, Quiz) ----- */
const cl = w => w.cls || 1; // a word with no class is in Class 1
function fillClasses(levelSel, classSel) {
  const lv = $(levelSel).value, sel = $(classSel), cur = sel.value;
  const nums = [...new Set(words.filter(w => !lv || w.level === lv).map(cl))].sort((a, b) => a - b);
  sel.innerHTML = '<option value="">All classes</option>' + nums.map(n => `<option value="${n}">Class ${n}</option>`).join("");
  sel.value = nums.includes(+cur) ? cur : "";
}
function fillAllClasses() { fillClasses("#f-level", "#f-class"); fillClasses("#fc-level", "#fc-class"); fillClasses("#qz-level", "#qz-class"); }

function fillCats() {
  const cur = $("#f-cat").value;
  $("#f-cat").innerHTML = '<option value="">All categories</option>' + cats().map(c => `<option>${esc(c)}</option>`).join("");
  $("#f-cat").value = cats().includes(cur) ? cur : "";
  fillAllClasses();
}
/* ----- WORD IMAGES: folder path is images/<language>/<level>/class <number>/<id>.png
   Example: images/korean/beginner/class 1/k9.png. Also tries .jpg, .jpeg, .webp; no picture if none is found ----- */
function picBase(w) { return `images/${lang === "ko" ? "korean" : "english"}/${w.level.toLowerCase()}/class ${cl(w)}/${w.id}`; }
function picErr(img) {
  const types = ["png", "jpg", "jpeg", "webp"], i = +img.dataset.i + 1;
  if (i < types.length) { img.dataset.i = i; img.src = encodeURI(`${img.dataset.n}.${types[i]}`); } else img.remove();
}

/* ----- SHOW A WORD PICTURE IN AN <img> (used by Flashcards back and Quiz feedback) ----- */
function setPic(el, w) {
  const types = ["png", "jpg", "jpeg", "webp"]; let i = 0;
  el.hidden = true; el.alt = w.term;
  el.onload = () => { el.hidden = false; };
  el.onerror = () => { if (++i < types.length) el.src = encodeURI(`${picBase(w)}.${types[i]}`); else el.hidden = true; };
  el.src = encodeURI(`${picBase(w)}.${types[0]}`);
}

function renderLearn() {
  const q = $("#search").value.toLowerCase(), lv = $("#f-level").value, ct = $("#f-cat").value, cs = $("#f-class").value;
  const list = words.filter(w => (!lv || w.level === lv) && (!ct || w.category === ct) && (!cs || cl(w) === +cs) &&
    [w.term, w.def, w.ex, w.roman || ""].some(t => t.toLowerCase().includes(q))).sort((a, b) => a.term.localeCompare(b.term));
  $("#grid").innerHTML = list.length ? list.map(w => `
    <article class="word">
      <img class="pic" src="${esc(encodeURI(picBase(w)))}.png" data-n="${esc(picBase(w))}" data-i="0" onerror="picErr(this)" alt="${esc(w.term)}" loading="lazy">
      <div class="tags"><span class="tag">${esc(w.pos)}</span><span class="tag">${esc(w.level)}</span><span class="tag">Class ${cl(w)}</span>${w.category ? `<span class="tag">${esc(w.category)}</span>` : ""}
        ${w.status !== "new" ? `<span class="tag ${w.status}">${w.status === "known" ? "Known" : "Need practice"}</span>` : ""}</div>
      <h3>${esc(w.term)} <small class="muted">${esc([w.roman, w.pron].filter(Boolean).join(" · "))}</small></h3>
      <p>${esc(w.def)}</p><p class="ex">${esc(w.ex)}${w.extr ? "<br>" + esc(w.extr) : ""}</p>
      <div class="acts" data-id="${w.id}"><button data-a="say">Listen</button></div>
    </article>`).join("") : `<p class="empty">No words match. Clear the filters or add a new word.</p>`;
}
$("#grid").onclick = e => {
  const b = e.target.closest("button"); if (!b) return;
  const id = b.parentElement.dataset.id, w = words.find(x => x.id === id);
  if (b.dataset.a === "say") say(w.term);
};
["#search", "#f-cat", "#f-class"].forEach(s => $(s).oninput = renderLearn);
$("#f-level").oninput = () => { fillClasses("#f-level", "#f-class"); renderLearn(); };

/* ===== 6. FLASHCARDS (flip, Known, Need practice) ===== */
let deck = [], di = 0;
function buildDeck() {
  const f = $("#fc-filter").value;
  const lv = $("#fc-level").value, cs = $("#fc-class").value;
  deck = words.filter(w => (!lv || w.level === lv) && (!cs || cl(w) === +cs) &&
    (f === "all" || (f === "practice" ? w.status === "practice" : w.status !== "known")));
  di = 0; drawCard();
}
function drawCard() {
  const has = deck.length > 0;
  $("#fc-empty").hidden = has; $("#fc-area").hidden = !has;
  if (!has) { $("#fc-count").textContent = ""; return; }
  const w = deck[di], card = $("#card"), wasFlipped = card.classList.contains("flipped");
  card.classList.remove("flipped");
  $("#fc-count").textContent = `Card ${di + 1} of ${deck.length}`;
  $("#fc-meta").textContent = `${w.level} · Class ${cl(w)}${w.category ? " · " + w.category : ""}`;
  $("#fc-term").textContent = w.term; $("#fc-pron").textContent = [w.roman, w.pron].filter(Boolean).join(" · ");
  // the back of the card is filled in after it has turned away, so the next answer is never seen early
  clearTimeout(drawCard.t);
  const fillBack = () => {
    $("#fc-pos").textContent = w.pos; $("#fc-def").textContent = w.def; $("#fc-ex").textContent = `"${w.ex}"` + (w.extr ? ` (${w.extr})` : "");
    setPic($("#fc-pic"), w);
  };
  if (wasFlipped) drawCard.t = setTimeout(fillBack, 300); else fillBack();
}
const step = d => { di = (di + d + deck.length) % deck.length; drawCard(); };
function rate(s) {
  deck[di].status = s; save(); touch(); renderLearn();
  toast(s === "known" ? "Marked as known" : "We'll practise this one again");
  if (di === deck.length - 1) toast("You reached the end of the deck"); step(1);
}
$("#card").onclick = () => $("#card").classList.toggle("flipped");
$("#fc-next").onclick = () => step(1); $("#fc-prev").onclick = () => step(-1);
$("#fc-say").onclick = () => say(deck[di].term);
$("#fc-known").onclick = () => rate("known"); $("#fc-practice").onclick = () => rate("practice");
$("#fc-filter").onchange = buildDeck; $("#fc-class").onchange = buildDeck;
$("#fc-level").onchange = () => { fillClasses("#fc-level", "#fc-class"); buildDeck(); };
document.addEventListener("keydown", e => {
  if ($("#v-flash").hidden || !deck.length || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1);
});

/* ===== 7. QUIZ (questions, feedback, score, retry) ===== */
let Q = {};
function startQuiz(ids) {
  const lv = $("#qz-level").value, cs = $("#qz-class").value, msg = $("#qz-msg"); msg.textContent = "";
  if (words.length < 4) { msg.textContent = "Add at least 4 words to play."; return; }
  const pool = ids ? words.filter(w => ids.includes(w.id)) : words.filter(w => (!lv || w.level === lv) && (!cs || cl(w) === +cs));
  if (!pool.length) { msg.textContent = "No words in this level or class yet."; return; }
  Q = { qs: shuffle(pool).slice(0, 10), i: 0, score: 0, wrong: [], done: false };
  $("#qz-setup").hidden = true; $("#qz-end").hidden = true; $("#qz-play").hidden = false; ask();
}
function ask() {
  const w = Q.qs[Q.i]; Q.done = false;
  Q.opts = shuffle([w, ...shuffle(words.filter(x => x.id !== w.id)).slice(0, 3)]);
  $("#qz-prog").textContent = `Question ${Q.i + 1} of ${Q.qs.length} · Score ${Q.score}`;
  $("#qz-bar").style.width = (Q.i / Q.qs.length * 100) + "%";
  $("#qz-q").innerHTML = `What does “${esc(w.term)}” mean? <small class="muted">${esc(w.pos)}</small>`;
  $("#qz-opts").innerHTML = Q.opts.map((o, k) => `<button data-k="${k}">${esc(o.def)}</button>`).join("");
  $("#qz-fb").hidden = true; $("#qz-next").hidden = true;
}
$("#qz-opts").onclick = e => {
  const b = e.target.closest("button"); if (!b || Q.done) return; Q.done = true;
  const w = Q.qs[Q.i], pick = Q.opts[b.dataset.k], ok = pick.id === w.id;
  [...$("#qz-opts").children].forEach((x, k) => { x.disabled = true; if (Q.opts[k].id === w.id) x.classList.add("right"); });
  if (ok) Q.score++; else { b.classList.add("wrong"); Q.wrong.push(w.id); }
  $("#qz-fb").innerHTML = (ok ? `<b>Correct!</b> ` : `<b>Not quite.</b> That meaning belongs to “${esc(pick.term)}”. `) +
    `“${esc(w.term)}” means: ${esc(w.def)}<br><em>Example: ${esc(w.ex)}${w.extr ? " (" + esc(w.extr) + ")" : ""}</em><img id="qz-pic" class="pic-sm" alt="" hidden>`;
  setPic($("#qz-pic"), w); $("#qz-fb").hidden = false; $("#qz-next").hidden = false;
  $("#qz-next").textContent = Q.i === Q.qs.length - 1 ? "See results" : "Next question";
};
$("#qz-next").onclick = () => {
  if (++Q.i < Q.qs.length) return ask();
  const pct = Math.round(Q.score / Q.qs.length * 100);
  prog.best = Math.max(prog.best, pct); save(); touch();
  $("#qz-play").hidden = true; $("#qz-end").hidden = false;
  $("#qz-score").textContent = `${Q.score}/${Q.qs.length} (${pct}%)`;
  $("#qz-note").textContent = Q.wrong.length ? `Words to review: ${Q.wrong.map(id => words.find(w => w.id === id)?.term).join(", ")}` : "Perfect score. Great work!";
  $("#qz-retry").hidden = !Q.wrong.length;
};
$("#qz-start").onclick = () => startQuiz();
$("#qz-level").onchange = () => fillClasses("#qz-level", "#qz-class");
$("#qz-retry").onclick = () => startQuiz(Q.wrong);
$("#qz-again").onclick = () => show("quiz");

/* ===== 8. HOME PAGE EXTRAS (word of the day, hero and footer links) ===== */
function renderWotd() { // shows a different word each day
  const w = words[Math.floor(Date.now() / 864e5) % words.length], box = $("#wotd");
  if (!w) { box.innerHTML = '<p class="muted">Add a word to see it here.</p>'; return; }
  box.innerHTML = `<h3>${esc(w.term)}</h3><p class="muted">${esc([w.roman, w.pron].filter(Boolean).join(" · "))}</p><p>${esc(w.def)}</p><p class="ex">${esc(w.ex)}${w.extr ? "<br>" + esc(w.extr) : ""}</p><button class="btn" id="wotd-say">Listen</button>`;
  $("#wotd-say").onclick = () => say(w.term);
}
document.querySelectorAll("[data-go]").forEach(b => b.onclick = e => { e.preventDefault(); show(b.dataset.go); scrollTo(0, 0); }); // hero, footer, logo
document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { setLang(b.dataset.lang); scrollTo(0, 0); }); // footer language links

/* ===== 9. LANGUAGE SWITCH AND START-UP (runs when the page opens) ===== */
function setLang(l) {
  lang = l; localStorage.setItem("vocabvibe_lang", JSON.stringify(l)); loadLang(); $("#lang").value = l;
  $("#search").value = ""; $("#f-level").value = ""; fillCats(); renderLearn(); stats(); renderWotd();
  show(["home", "learn", "flash", "quiz"].find(n => !$("#v-" + n).hidden) || "home");
}
$("#lang").onchange = e => setLang(e.target.value);
setLang(lang);