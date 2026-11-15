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
  ["home", "learn", "verbs", "flash", "quiz"].forEach(n => $("#v-" + n).hidden = n !== v);
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("on", b.dataset.view === v));
  scrollTo(0, 0);
  if (v === "flash") buildDeck();
  if (v === "verbs") showVT(VT);
  if (v === "quiz") { $("#qz-setup").hidden = false; $("#qz-play").hidden = true; $("#qz-end").hidden = true; }
}
document.querySelectorAll(".tab").forEach(b => b.onclick = () => show(b.dataset.view));

/* ===== 5. LEARN TAB (search, filters, word cards) ===== */
function cats() { return [...new Set(words.map(w => w.category).filter(Boolean))].sort(); }
/* ----- PICKER: choose a section (Mixed vocabulary, Noun, Pronoun...) then a class. Used by Learn, Flashcards and Quiz ----- */
const cl = w => w.cls || 1; // a word with no class is in Class 1
const SECTIONS = ["Mixed vocabulary", "Noun", "Pronoun", "Adjective", "Adverb", "Preposition", "Conjunction", "Interjection", "Phrase"];
const sec = w => w.section || "Mixed vocabulary"; // a word with no section is in Mixed vocabulary
function makePicker(secBox, clsBox, onChange) {
  const P = {
    sec: "", cls: "",
    ready() { return !!(P.sec && P.cls); },
    render() {
      $(secBox).innerHTML = SECTIONS.map(x => `<button class="chip${x === P.sec ? " on" : ""}" data-sec="${x}">${x}</button>`).join("");
      const nums = [...new Set(words.filter(w => sec(w) === P.sec).map(cl))].sort((a, b) => a - b);
      if (!nums.includes(+P.cls)) P.cls = "";
      $(clsBox).innerHTML = !P.sec ? '<span class="muted">Pick a section first.</span>'
        : nums.length ? nums.map(n => `<button class="chip${n === +P.cls ? " on" : ""}" data-cls="${n}">Class ${n}</button>`).join("")
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
function renderPickers() { PL.render(); PF.render(); PQ.render(); } // called when the language changes
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
  const list = words.filter(w => sec(w) === PL.sec && cl(w) === +PL.cls).sort((a, b) => a.term.localeCompare(b.term));
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
  PL.sec = PL.cls = PF.sec = PF.cls = PQ.sec = PQ.cls = ""; VLV = ""; VCL = ""; gs.value = ""; gr.hidden = true; renderPickers(); renderLearn(); stats(); renderWotd();
  show(["home", "learn", "verbs", "flash", "quiz"].find(n => !$("#v-" + n).hidden) || "home");
}
$("#lang").onchange = e => setLang(e.target.value);
setLang(lang);