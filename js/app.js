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
  ["home", "learn", "verbs", "flash", "quiz", "game", "speak"].forEach(n => $("#v-" + n).hidden = n !== v);
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("on", b.dataset.view === v));
  scrollTo(0, 0);
  if (v === "flash") buildDeck();
  if (v === "verbs") showVT(VT);
  if (v === "speak") { $("#sp-setup").hidden = false; $("#sp-play").hidden = true; $("#sp-end").hidden = true; }
  if (v === "game") { $("#gm-setup").hidden = false; $("#gm-play").hidden = true; $("#gm-end").hidden = true; }
  if (v === "quiz") { $("#qz-setup").hidden = false; $("#qz-play").hidden = true; $("#qz-end").hidden = true; }
}
document.querySelectorAll(".tab").forEach(b => b.onclick = () => show(b.dataset.view));

/* ===== 5. LEARN TAB (search, filters, word cards) ===== */
function cats() { return [...new Set(words.map(w => w.category).filter(Boolean))].sort(); }
/* ----- PICKER: choose a section (Mixed vocabulary, Noun, Pronoun...) then a class. Used by Learn, Flashcards and Quiz ----- */
const cl = w => w.cls || 1; // a word with no class is in Class 1
const SECTIONS = ["Mixed vocabulary", "Noun", "Pronoun", "Adjective", "Adverb", "Preposition", "Conjunction", "Interjection", "Phrase", "Number"]; // "Number" shows in Korean only
const sec = w => w.section || "Mixed vocabulary"; // a word with no section is in Mixed vocabulary
const wordClassName = (s, n) => (typeof CLASS_NAMES !== "undefined" && CLASS_NAMES[lang]?.[s]?.[n]) || ""; // topic name of a class (from CLASS_NAMES in data.js)
function makePicker(secBox, clsBox, onChange) {
  const P = {
    sec: "", cls: "",
    ready() { return !!(P.sec && P.cls); },
    render() {
      $(secBox).innerHTML = SECTIONS.filter(n => n !== "Number" || lang === "ko").map(x => `<button class="chip${x === P.sec ? " on" : ""}" data-sec="${x}">${x}</button>`).join("");
      const nums = [...new Set(words.filter(w => sec(w) === P.sec).map(cl))].sort((a, b) => a - b);
      if (!nums.includes(+P.cls)) P.cls = "";
      $(clsBox).innerHTML = !P.sec ? '<span class="muted">Pick a section first.</span>'
        : nums.length ? nums.map(n => `<button class="chip${n === +P.cls ? " on" : ""}" data-cls="${n}">Class ${n}${wordClassName(P.sec, n) ? " · " + esc(wordClassName(P.sec, n)) : ""}</button>`).join("")
        : `<span class="muted">No words in “${esc(P.sec)}” yet. Add some in data.js.</span>`;
    }
  };
  $(secBox).onclick = e => { const b = e.target.closest("[data-sec]"); if (!b) return; P.sec = P.sec === b.dataset.sec ? "" : b.dataset.sec; P.cls = ""; P.render(); onChange(); };
  $(clsBox).onclick = e => { const b = e.target.closest("[data-cls]"); if (!b) return; P.cls = +P.cls === +b.dataset.cls ? "" : b.dataset.cls; P.render(); onChange(); };
  return P;
}
const PL = makePicker("#lv-chips", "#cl-chips", () => renderLearn()); // Learn
const PF = makePicker("#fc-secs", "#fc-cls", () => buildDeck()); // Flashcards
const PQ = makePicker("#qz-secs", "#qz-cls", () => { $("#qz-msg").textContent = ""; }); // Quiz
const PG = makePicker("#gm-secs", "#gm-cls", () => { $("#gm-msg").textContent = ""; }); // Game
const PS = makePicker("#sp-secs", "#sp-cls", () => { $("#sp-msg").textContent = ""; }); // Speak
function renderPickers() { PL.render(); PF.render(); PQ.render(); PG.render(); PS.render(); } // called when the language changes
/* ----- WORD IMAGES: folder path is images/<language>/<level>/class <number>/<id>.png
   Example: images/korean/beginner/class 1/k9.png. Also tries .jpg, .jpeg, .webp; no picture if none is found ----- */
function picBase(w) { return `images/${lang === "ko" ? "korean" : "english"}/${(sec(w) !== "Mixed vocabulary" ? sec(w) : w.level || "Beginner").toLowerCase()}/class ${cl(w)}/${w.id}`; }
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
  if (!PL.ready()) { $("#grid").innerHTML = '<p class="empty">Pick a section and a class to see words.</p>'; return; } // nothing until both are chosen
  const list = words.filter(w => sec(w) === PL.sec && cl(w) === +PL.cls).sort((a, b) => PL.sec === "Number" ? 0 : a.term.localeCompare(b.term)); // Number keeps the data.js order (1, 2, 3...); other sections are A to Z
  $("#grid").innerHTML = list.length ? list.map(w => `
    <article class="word">
      <img class="pic" src="${esc(encodeURI(picBase(w)))}.png" data-n="${esc(picBase(w))}" data-i="0" onerror="picErr(this)" alt="${esc(w.term)}" loading="lazy">
      <div class="tags"><span class="tag">${esc(w.pos)}</span><span class="tag">${esc(sec(w))}</span><span class="tag">Class ${cl(w)}</span>${w.category ? `<span class="tag">${esc(w.category)}</span>` : ""}
        ${w.status !== "new" ? `<span class="tag ${w.status}">${w.status === "known" ? "Known" : "Need practice"}</span>` : ""}</div>
      <h3>${esc(w.term)} <small class="muted">${esc([w.roman, w.pron].filter(Boolean).join(" · "))}</small></h3>
      <p>${esc(w.def)}</p><p class="ex">${esc(w.ex)}${w.extr ? "<br>" + esc(w.extr) : ""}</p>
      <div class="acts" data-id="${w.id}"><button data-a="say">Listen</button><button data-a="ex">Listen sentence</button></div>
    </article>`).join("") : `<p class="empty">No words in this class yet.</p>`;
}
$("#grid").onclick = e => {
  const b = e.target.closest("button"); if (!b) return;
  const id = b.parentElement.dataset.id, w = words.find(x => x.id === id);
  if (b.dataset.a === "say") say(w.term);
  if (b.dataset.a === "ex") say(w.ex);
};

/* ===== 6. FLASHCARDS (flip, Known, Need practice) ===== */
let deck = [], di = 0;
function buildDeck() {
  const f = $("#fc-filter").value;
  $("#fc-empty").textContent = PF.ready() ? "No cards match this filter. Try “All cards”." : "Pick a section and a class to see cards.";
  deck = !PF.ready() ? [] : words.filter(w => sec(w) === PF.sec && cl(w) === +PF.cls &&
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
  $("#fc-meta").textContent = `${sec(w)} · Class ${cl(w)}${w.category ? " · " + w.category : ""}`;
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
$("#fc-say-ex").onclick = () => say(deck[di].ex);
$("#fc-known").onclick = () => rate("known"); $("#fc-practice").onclick = () => rate("practice");
$("#fc-filter").onchange = buildDeck;
document.addEventListener("keydown", e => {
  if ($("#v-flash").hidden || !deck.length || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1);
});

/* ===== 7. QUIZ (questions, feedback, score, retry) ===== */
let Q = {};
function startQuiz(ids) {
  const msg = $("#qz-msg"); msg.textContent = "";
  if (!ids && !PQ.ready()) { msg.textContent = "Pick a section and a class first."; return; }
  if (words.length < 4) { msg.textContent = "Add at least 4 words to play."; return; }
  const pool = ids ? words.filter(w => ids.includes(w.id)) : words.filter(w => sec(w) === PQ.sec && cl(w) === +PQ.cls);
  if (!pool.length) { msg.textContent = "No words in this class yet."; return; }
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
    `“${esc(w.term)}” means: ${esc(w.def)}<br><em>Example: ${esc(w.ex)}${w.extr ? " (" + esc(w.extr) + ")" : ""}</em><div class="row left"><button class="btn" data-say="term">Listen</button><button class="btn" data-say="ex">Listen sentence</button></div><img id="qz-pic" class="pic-sm" alt="" hidden>`;
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
$("#qz-fb").onclick = e => { const b = e.target.closest("[data-say]"); if (b) say(Q.qs[Q.i][b.dataset.say]); }; // Listen buttons in the feedback box
$("#qz-retry").onclick = () => startQuiz(Q.wrong);
$("#qz-again").onclick = () => show("quiz");

/* ===== 8a. GUESS THE WORD GAME (English clue, pick the right word) ===== */
let G = {};
const keyOf = t => String(t || "").toLowerCase().replace(/[.\s]+$/g, "");
function gameOptions(w) { // the right word + 3 wrong words that never repeat a word or a meaning
  const pick = [w], seenT = new Set([w.term]), seenD = new Set([keyOf(w.def)]);
  const tiers = [words.filter(x => sec(x) === sec(w) && cl(x) === cl(w)), words.filter(x => sec(x) === sec(w)), words];
  for (const tier of tiers) for (const x of shuffle(tier)) {
    if (pick.length >= 4) break;
    if (seenT.has(x.term) || seenD.has(keyOf(x.def))) continue;
    pick.push(x); seenT.add(x.term); seenD.add(keyOf(x.def));
  }
  return shuffle(pick);
}
function startGame(ids) {
  const msg = $("#gm-msg"); msg.textContent = "";
  if (!ids && !PG.ready()) { msg.textContent = "Pick a section and a class first."; return; }
  const pool = ids ? words.filter(w => ids.includes(w.id)) : words.filter(w => sec(w) === PG.sec && cl(w) === +PG.cls);
  if (!pool.length) { msg.textContent = "No words in this class yet."; return; }
  G = { qs: shuffle(pool).slice(0, 10), i: 0, score: 0, wrong: [], done: false };
  $("#gm-setup").hidden = true; $("#gm-end").hidden = true; $("#gm-play").hidden = false; askGame();
}
function askGame() {
  const w = G.qs[G.i]; G.w = w; G.done = false; G.opts = gameOptions(w);
  $("#gm-prog").textContent = `Question ${G.i + 1} of ${G.qs.length} · Score ${G.score}`;
  $("#gm-bar").style.width = (G.i / G.qs.length * 100) + "%";
  $("#gm-clue").textContent = w.def;
  $("#gm-opts").innerHTML = G.opts.map((o, k) => `<div class="gopt"><button class="gans" data-k="${k}">${esc(o.term)}</button><button class="gspk" data-s="${k}" aria-label="Listen to ${esc(o.term)}">🔊</button></div>`).join("");
  $("#gm-fb").hidden = true; $("#gm-next").hidden = true;
}
$("#gm-opts").onclick = e => {
  const sp = e.target.closest("[data-s]"); if (sp) { say(G.opts[sp.dataset.s].term); return; } // hear an option
  const b = e.target.closest("[data-k]"); if (!b || G.done) return; G.done = true;
  const w = G.w, ok = G.opts[b.dataset.k].id === w.id;
  document.querySelectorAll("#gm-opts .gans").forEach((x, k) => { x.disabled = true; if (G.opts[k].id === w.id) x.classList.add("right"); });
  if (ok) G.score++; else { b.classList.add("wrong"); G.wrong.push(w.id); }
  $("#gm-fb").innerHTML = (ok ? "<b>Correct!</b> " : `<b>Not quite.</b> The answer is “${esc(w.term)}”. `) + esc([w.roman, w.pron].filter(Boolean).join(" · ")) +
    `<br><em>${esc(w.ex)}${w.extr ? " (" + esc(w.extr) + ")" : ""}</em><div class="row left"><button class="btn" data-gsay="term">Listen</button><button class="btn" data-gsay="ex">Listen sentence</button></div><img id="gm-pic" class="pic-sm" alt="" hidden>`;
  setPic($("#gm-pic"), w); $("#gm-fb").hidden = false; $("#gm-next").hidden = false;
  $("#gm-next").textContent = G.i === G.qs.length - 1 ? "See results" : "Next question";
};
$("#gm-fb").onclick = e => { const b = e.target.closest("[data-gsay]"); if (b) say(G.w[b.dataset.gsay]); };
$("#gm-next").onclick = () => {
  if (++G.i < G.qs.length) return askGame();
  $("#gm-play").hidden = true; $("#gm-end").hidden = false; touch();
  $("#gm-score").textContent = `${G.score}/${G.qs.length} (${Math.round(G.score / G.qs.length * 100)}%)`;
  $("#gm-note").textContent = G.wrong.length ? `Words to review: ${G.wrong.map(id => words.find(w => w.id === id)?.term).join(", ")}` : "Perfect score. Great work!";
  $("#gm-retry").hidden = !G.wrong.length;
};
$("#gm-start").onclick = () => startGame(); $("#gm-retry").onclick = () => startGame(G.wrong); $("#gm-again").onclick = () => show("game");

/* ===== 8a2. SPEAK THE WORD (voice game: English clue, say the word) ===== */
let S = {};
const getSR = () => window.SpeechRecognition || window.webkitSpeechRecognition; // voice recognition (Chrome, Edge...)
const cleanSp = (t, keepBrackets) => String(t || "").toLowerCase().replace(keepBrackets ? /[~.,!?'"“”‘’\-\s]/g : /\([^)]*\)|[~.,!?'"“”‘’\-\s]/g, "");
function lev(a, b) { // how many letters differ between two words
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
function targetsOf(w) { // the words that count as right (a term like "이것 / 이거" accepts either part)
  return [...new Set([...String(w.term).split("/").flatMap(p => [cleanSp(p, false), cleanSp(p, true)]), ...(w.alt || []).map(a => cleanSp(a, true))].filter(Boolean))];
}
function isMatch(w, heard) { // forgiving: close matches count
  const h = cleanSp(heard, true); if (!h) return false;
  return targetsOf(w).some(t => h === t || (t.length >= 2 && h.includes(t)) || (t.length >= 4 && lev(h, t) <= 1) || (t.length >= 8 && lev(h, t) <= 2));
}
function startSpeak(ids) {
  const msg = $("#sp-msg"); msg.textContent = "";
  if (!ids && !PS.ready()) { msg.textContent = "Pick a section and a class first."; return; }
  const pool = ids ? words.filter(w => ids.includes(w.id)) : words.filter(w => sec(w) === PS.sec && cl(w) === +PS.cls);
  if (!pool.length) { msg.textContent = "No words in this class yet."; return; }
  S = { qs: shuffle(pool).slice(0, 10), i: 0, score: 0, wrong: [], typing: !getSR(), reason: getSR() ? "" : "Voice is not supported in this browser. Type the answer instead (try Chrome or Edge for voice)." };
  $("#sp-setup").hidden = true; $("#sp-end").hidden = true; $("#sp-play").hidden = false; askSpeak();
}
function showSpeakMode() { // microphone button, or the Type instead box
  $("#sp-mic-row").hidden = S.typing || S.done; $("#sp-type").hidden = !S.typing || S.done;
  $("#sp-typemsg").textContent = S.reason;
}
function askSpeak() {
  const w = S.qs[S.i]; S.w = w; S.tries = 0; S.done = false; S.listening = false;
  $("#sp-prog").textContent = `Question ${S.i + 1} of ${S.qs.length} · Score ${S.score}`;
  $("#sp-bar").style.width = (S.i / S.qs.length * 100) + "%";
  $("#sp-clue").textContent = w.def; $("#sp-tries").textContent = "You have 2 tries."; $("#sp-heard").textContent = "";
  $("#sp-input").value = ""; $("#sp-fb").hidden = true; $("#sp-next").hidden = true;
  $("#sp-mic").disabled = false; $("#sp-mic").textContent = "🎤 Speak"; showSpeakMode();
}
function listenOnce(done) { // listens once, in Korean or English
  let finished = false; const fin = (a, e) => { if (!finished) { finished = true; done(a, e); } };
  try {
    const r = new (getSR())(); r.lang = lang === "ko" ? "ko-KR" : "en-US"; r.interimResults = false; r.continuous = false; r.maxAlternatives = 5;
    r.onresult = e => fin([...e.results[0]].map(a => a.transcript));
    r.onerror = e => fin(null, e.error);
    r.onend = () => fin([], "no-speech");
    r.start();
  } catch (err) { fin(null, "start-failed"); }
}
function checkSpeak(alts) { // called with what was heard (or typed)
  if (S.done) return;
  const ok = alts.some(a => isMatch(S.w, a));
  $("#sp-heard").textContent = alts[0] ? `I heard: “${alts[0]}”` : "";
  if (ok) return endSpeak(true);
  if (++S.tries >= 2) return endSpeak(false);
  $("#sp-tries").textContent = "Not quite. You have 1 try left.";
}
function endSpeak(ok) {
  const w = S.w; S.done = true;
  if (ok) S.score++; else S.wrong.push(w.id);
  $("#sp-fb").innerHTML = (ok ? "<b>Correct!</b> " : `<b>The answer is “${esc(w.term)}”.</b> `) + esc([w.roman, w.pron].filter(Boolean).join(" · ")) +
    `<br><em>${esc(w.ex)}${w.extr ? " (" + esc(w.extr) + ")" : ""}</em><div class="row left"><button class="btn" data-ssay="term">Listen</button><button class="btn" data-ssay="ex">Listen sentence</button></div><img id="sp-pic" class="pic-sm" alt="" hidden>`;
  setPic($("#sp-pic"), w); $("#sp-fb").hidden = false; $("#sp-next").hidden = false; $("#sp-tries").textContent = "";
  $("#sp-next").textContent = S.i === S.qs.length - 1 ? "See results" : "Next question"; showSpeakMode();
}
$("#sp-mic").onclick = () => {
  if (S.done || S.listening) return; S.listening = true; $("#sp-mic").disabled = true; $("#sp-mic").textContent = "🎤 Listening…";
  listenOnce((alts, err) => {
    S.listening = false; $("#sp-mic").disabled = false; $("#sp-mic").textContent = "🎤 Speak";
    if (err === "no-speech") { $("#sp-heard").textContent = "I did not hear anything. Press Speak and try again."; return; }
    if (err) { // microphone blocked, no microphone, no internet...
      S.typing = true; S.reason = err === "not-allowed" || err === "service-not-allowed" ? "The microphone is blocked. Allow it in the browser, or type the answer instead." : "Voice did not work here. Type the answer instead."; showSpeakMode(); return;
    }
    checkSpeak(alts);
  });
};
$("#sp-check").onclick = () => { const v = $("#sp-input").value.trim(); if (v) { checkSpeak([v]); $("#sp-input").value = ""; } };
$("#sp-input").onkeydown = e => { if (e.key === "Enter") $("#sp-check").click(); };
$("#sp-fb").onclick = e => { const b = e.target.closest("[data-ssay]"); if (b) say(S.w[b.dataset.ssay]); };
$("#sp-next").onclick = () => {
  if (++S.i < S.qs.length) return askSpeak();
  $("#sp-play").hidden = true; $("#sp-end").hidden = false; touch();
  $("#sp-score").textContent = `${S.score}/${S.qs.length} (${Math.round(S.score / S.qs.length * 100)}%)`;
  $("#sp-note").textContent = S.wrong.length ? `Words to practise: ${S.wrong.map(id => words.find(w => w.id === id)?.term).join(", ")}` : "Perfect score. Great work!";
  $("#sp-retry").hidden = !S.wrong.length;
};
$("#sp-start").onclick = () => startSpeak(); $("#sp-retry").onclick = () => startSpeak(S.wrong); $("#sp-again").onclick = () => show("speak");

/* ===== 8b. VERBS (learn, flashcards, quiz) ===== */
const TENSES = ["present", "past", "future"], TLABEL = { present: "Present (now)", past: "Past (before)", future: "Future (later)" };
const allVerbs = () => DEFAULT_VERBS[lang];
const verbList = () => allVerbs().filter(v => v.level === VLV && (v.cls || 1) === +VCL); // verbs of the chosen level and class
const vpron = v => [v.roman, v.pron].filter(Boolean).join(" · "); // pronunciation of the main verb
const fillS = t => t[0].replace("___", t[1]); // sentence with the answer filled in
let VT = "learn";
/* Verbs: pick a level, then a class (applies to Learn, Flashcards and Quiz) */
let VLV = "", VCL = "";
const className = n => (typeof VERB_CLASS_NAMES !== "undefined" && VERB_CLASS_NAMES[lang]?.[VLV]?.[n]) || ""; // topic name of a class
function renderVChips() {
  $("#vlv-chips").innerHTML = ["Beginner", "Intermediate", "Advanced"].map(l => `<button class="chip${l === VLV ? " on" : ""}" data-vlv="${l}">${l}</button>`).join("");
  const nums = [...new Set(allVerbs().filter(v => v.level === VLV).map(v => v.cls || 1))].sort((a, b) => a - b);
  if (!nums.includes(+VCL)) VCL = "";
  $("#vcl-chips").innerHTML = VLV ? nums.map(n => `<button class="chip${n === +VCL ? " on" : ""}" data-vcl="${n}">Class ${n}${className(n) ? " · " + esc(className(n)) : ""}</button>`).join("") : '<span class="muted">Pick a level first.</span>';
}
$("#vlv-chips").onclick = e => { const b = e.target.closest("[data-vlv]"); if (!b) return; VLV = VLV === b.dataset.vlv ? "" : b.dataset.vlv; VCL = ""; showVT(VT); };
$("#vcl-chips").onclick = e => { const b = e.target.closest("[data-vcl]"); if (!b) return; VCL = +VCL === +b.dataset.vcl ? "" : b.dataset.vcl; showVT(VT); };

function showVT(v) { // switch between the three small tabs
  VT = v;
  document.querySelectorAll("[data-vt]").forEach(b => b.classList.toggle("on", b.dataset.vt === v));
  renderVChips();
  const ready = VLV && VCL; $("#vb-empty").hidden = !!ready;
  $("#vb-learn").hidden = !ready || v !== "learn"; $("#vb-flash").hidden = !ready || v !== "flash"; $("#vb-quiz").hidden = !ready || v !== "quiz";
  if (!ready) return; // nothing until a level and a class are picked
  if (v === "learn") renderVerbs();
  if (v === "flash") buildVF();
  if (v === "quiz") { $("#vq-setup").hidden = false; $("#vq-play").hidden = true; $("#vq-end").hidden = true; }
}
document.querySelectorAll("[data-vt]").forEach(b => b.onclick = () => showVT(b.dataset.vt));

/* Verbs: Learn */
function renderVerbs() {
  $("#vb-grid").innerHTML = verbList().map(v => `<article class="word vcard"><h3>${esc(v.base)}${vpron(v) ? `<small class="muted">${esc(vpron(v))}</small>` : ""}<small class="muted">${esc(v.meaning)}</small></h3>
    <div class="acts"><button data-speak="${esc(v.base)}">Listen</button></div>` + TENSES.map(t => `
    <div class="vrow"><b>${TLABEL[t]}</b><span>${esc(v[t])}</span></div>
    <p class="ex">${esc(fillS(v.ex[t]))}${v.ex[t][2] ? "<br>" + esc(v.ex[t][2]) : ""} <button class="mini" data-speak="${esc(fillS(v.ex[t]))}">Listen</button></p>`).join("") + "</article>").join("");
}
$("#vb-grid").onclick = e => { const b = e.target.closest("[data-speak]"); if (b) say(b.dataset.speak); };

/* Verbs: Flashcards (every verb in every tense) */
let vdeck = [], vi = 0;
function buildVF() { vdeck = verbList().flatMap(v => TENSES.map(t => ({ v, t }))); vi = 0; drawVF(); }
function drawVF() {
  const { v, t } = vdeck[vi], card = $("#vf-card"), was = card.classList.contains("flipped");
  card.classList.remove("flipped");
  $("#vf-count").textContent = `Card ${vi + 1} of ${vdeck.length}`;
  $("#vf-tense").textContent = TLABEL[t]; $("#vf-term").textContent = v.base; $("#vf-pron").textContent = vpron(v); $("#vf-meaning").textContent = v.meaning;
  clearTimeout(drawVF.t);
  const back = () => { $("#vf-label").textContent = TLABEL[t]; $("#vf-form").textContent = v[t]; $("#vf-ex").textContent = fillS(v.ex[t]) + (v.ex[t][2] ? ` (${v.ex[t][2]})` : ""); };
  if (was) drawVF.t = setTimeout(back, 300); else back(); // back is filled after the card has turned away
}
$("#vf-card").onclick = () => $("#vf-card").classList.toggle("flipped");
$("#vf-next").onclick = () => { vi = (vi + 1) % vdeck.length; drawVF(); };
$("#vf-prev").onclick = () => { vi = (vi - 1 + vdeck.length) % vdeck.length; drawVF(); };
$("#vf-shuffle").onclick = () => { vdeck = shuffle(vdeck); vi = 0; drawVF(); toast("Cards shuffled"); };
$("#vf-say").onclick = () => { const { v, t } = vdeck[vi]; say(fillS(v.ex[t])); };
$("#vf-say-v").onclick = () => say(vdeck[vi].v.base);

/* Verbs: Quiz (fill the blank, 4 choices) */
let VQ = {};
function startVQ() {
  const all = verbList().flatMap(v => TENSES.map(t => ({ v, t })));
  VQ = { qs: shuffle(all).slice(0, 10), i: 0, score: 0, done: false };
  $("#vq-setup").hidden = true; $("#vq-end").hidden = true; $("#vq-play").hidden = false; askVQ();
}
function askVQ() {
  const { v, t } = VQ.qs[VQ.i], ans = v.ex[t][1]; VQ.done = false;
  let pool = [...new Set(TENSES.flatMap(x => [...v[x].split(" / "), v.ex[x][1]]))].filter(f => f !== ans);
  // wrong choices are other forms of the same verb only, so a wrong choice can never also fit the sentence
  VQ.opts = shuffle([ans, ...shuffle(pool).slice(0, 3)]);
  $("#vq-prog").textContent = `Question ${VQ.i + 1} of ${VQ.qs.length} · Score ${VQ.score}`;
  $("#vq-bar").style.width = (VQ.i / VQ.qs.length * 100) + "%";
  $("#vq-q").textContent = v.ex[t][0]; $("#vq-hint").textContent = `Verb: ${[v.base, vpron(v), v.meaning].filter(Boolean).join(" · ")}`;
  $("#vq-opts").innerHTML = VQ.opts.map((o, k) => `<button data-k="${k}">${esc(o)}</button>`).join("");
  $("#vq-fb").hidden = true; $("#vq-next").hidden = true;
}
$("#vq-opts").onclick = e => {
  const b = e.target.closest("button"); if (!b || VQ.done) return; VQ.done = true;
  const { v, t } = VQ.qs[VQ.i], ans = v.ex[t][1], ok = VQ.opts[b.dataset.k] === ans;
  [...$("#vq-opts").children].forEach((x, k) => { x.disabled = true; if (VQ.opts[k] === ans) x.classList.add("right"); });
  if (ok) VQ.score++; else b.classList.add("wrong");
  $("#vq-fb").innerHTML = (ok ? "<b>Correct!</b> " : `<b>Not quite.</b> The answer is “${esc(ans)}”. `) + `<br><em>${esc(fillS(v.ex[t]))}${v.ex[t][2] ? " (" + esc(v.ex[t][2]) + ")" : ""}</em><div class="row left"><button class="btn" data-vsay="form">Listen</button><button class="btn" data-vsay="sentence">Listen sentence</button></div>`;
  $("#vq-fb").hidden = false; $("#vq-next").hidden = false;
  $("#vq-next").textContent = VQ.i === VQ.qs.length - 1 ? "See results" : "Next question";
};
$("#vq-next").onclick = () => {
  if (++VQ.i < VQ.qs.length) return askVQ();
  $("#vq-play").hidden = true; $("#vq-end").hidden = false;
  $("#vq-score").textContent = `${VQ.score}/${VQ.qs.length} (${Math.round(VQ.score / VQ.qs.length * 100)}%)`; touch();
};
$("#vq-start").onclick = startVQ; $("#vq-again").onclick = startVQ;
$("#vq-fb").onclick = e => { const b = e.target.closest("[data-vsay]"); if (!b) return; const { v, t } = VQ.qs[VQ.i]; say(b.dataset.vsay === "form" ? v.ex[t][1] : fillS(v.ex[t])); }; // Listen buttons in the feedback box

/* ===== 8. HEADER SEARCH AND WORD POP-UP ===== */
const norm = s => String(s || "").toLowerCase();
function searchWords(q) { // works both ways: Korean word -> card, English meaning -> card
  q = norm(q).trim(); if (!q) return [];
  const score = w => {
    const t = norm(w.term), r = norm(w.roman), d = norm(w.def);
    if (t === q || r === q) return 0;
    if (t.startsWith(q) || r.startsWith(q)) return 1;
    if (t.includes(q) || r.includes(q)) return 2;
    if (d.split(/\s*[\/;,.]\s*/).some(x => x === q)) return 3;
    if (d.includes(q)) return 4;
    return norm(w.ex).includes(q) || norm(w.extr).includes(q) ? 5 : 9;
  };
  return words.map(w => [score(w), w]).filter(x => x[0] < 9).sort((a, b) => a[0] - b[0]).slice(0, 8).map(x => x[1]);
}
const gs = $("#gsearch"), gr = $("#gresults");
function showResults() {
  if (!gs.value.trim()) { gr.hidden = true; return; }
  const list = searchWords(gs.value);
  gr.innerHTML = list.length ? list.map(w => `<button data-id="${esc(w.id)}"><b>${esc(w.term)}</b><span>${esc(w.def)}</span><small>${esc(sec(w))} · Class ${cl(w)}</small></button>`).join("") : '<p class="muted">No words found.</p>';
  gr.hidden = false;
}
gs.oninput = showResults; gs.onfocus = showResults;
gr.onclick = e => { const b = e.target.closest("button"); if (b) { openWord(words.find(w => w.id === b.dataset.id)); gr.hidden = true; } };
document.addEventListener("click", e => { if (!e.target.closest(".hsearch")) gr.hidden = true; });
document.addEventListener("keydown", e => { if (e.key === "Escape") gr.hidden = true; });
function openWord(w) { // full word card in a pop-up
  $("#wcard").dataset.id = w.id;
  $("#wcard").innerHTML = `<img class="pic" id="w-pic" alt="" hidden>
    <div class="tags"><span class="tag">${esc(w.pos)}</span><span class="tag">${esc(sec(w))}</span><span class="tag">Class ${cl(w)}</span>${w.category ? `<span class="tag">${esc(w.category)}</span>` : ""}</div>
    <h2>${esc(w.term)} <small class="muted">${esc([w.roman, w.pron].filter(Boolean).join(" · "))}</small></h2>
    <p>${esc(w.def)}</p><p class="ex">${esc(w.ex)}${w.extr ? "<br>" + esc(w.extr) : ""}</p>
    <div class="row left"><button class="btn" data-say="term">Listen</button><button class="btn" data-say="ex">Listen sentence</button></div>`;
  setPic($("#w-pic"), w); $("#wdlg").showModal();
}
$("#wcard").onclick = e => { const b = e.target.closest("[data-say]"); if (b) say(words.find(w => w.id === $("#wcard").dataset.id)[b.dataset.say]); };
$("#wdlg-x").onclick = () => $("#wdlg").close();
$("#wdlg").onclick = e => { if (e.target.id === "wdlg") $("#wdlg").close(); }; // click outside closes

/* ===== 10. HOME PAGE EXTRAS (word of the day, hero and footer links) ===== */
function renderWotd() { // shows a different word each day
  const w = words[Math.floor(Date.now() / 864e5) % words.length], box = $("#wotd");
  if (!w) { box.innerHTML = '<p class="muted">Add a word to see it here.</p>'; return; }
  box.innerHTML = `<h3>${esc(w.term)}</h3><p class="muted">${esc([w.roman, w.pron].filter(Boolean).join(" · "))}</p><p>${esc(w.def)}</p><p class="ex">${esc(w.ex)}${w.extr ? "<br>" + esc(w.extr) : ""}</p><button class="btn" id="wotd-say">Listen</button>`;
  $("#wotd-say").onclick = () => say(w.term);
}
document.querySelectorAll("[data-go]").forEach(b => b.onclick = e => { e.preventDefault(); show(b.dataset.go); scrollTo(0, 0); }); // hero, footer, logo
document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { setLang(b.dataset.lang); scrollTo(0, 0); }); // footer language links

/* ===== 11. LANGUAGE SWITCH AND START-UP (runs when the page opens) ===== */
function setLang(l) {
  lang = l; localStorage.setItem("vocabvibe_lang", JSON.stringify(l)); loadLang(); $("#lang").value = l;
  PL.sec = PL.cls = PF.sec = PF.cls = PQ.sec = PQ.cls = PG.sec = PG.cls = PS.sec = PS.cls = ""; VLV = ""; VCL = ""; gs.value = ""; gr.hidden = true; renderPickers(); renderLearn(); stats(); renderWotd();
  show(["home", "learn", "verbs", "flash", "quiz", "game", "speak"].find(n => !$("#v-" + n).hidden) || "home");
}
$("#lang").onchange = e => setLang(e.target.value);
setLang(lang);