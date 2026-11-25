/* Oratorix: auth.js = sign in and sign out (Firebase Authentication).
   Loaded from index.html as a module. Put this file in the js folder, next to app.js and data.js. */

// ✏️ Your Firebase web config. It is safe to keep in a public site: it only says which project to talk to.
const firebaseConfig = {
  apiKey: "AIzaSyAmuWAhhu0g8MkK8T8opMaPKkSCGLPs8bE",
  authDomain: "oratorix.firebaseapp.com",
  projectId: "oratorix",
  storageBucket: "oratorix.firebasestorage.app",
  messagingSenderId: "668578963722",
  appId: "1:668578963722:web:52d4108a5fe7769ca61af3"
};

const CDN = "https://www.gstatic.com/firebasejs/10.12.2/";
const $ = s => document.querySelector(s);
const say = m => { if (typeof window.toast === "function") window.toast(m); }; // small pop-up message from app.js

/* ---------- 1. load Firebase (if it cannot load, the rest of the site still works) ---------- */
let F = null, FS = null, auth = null, db = null;
try {
  const [app, fa, fs] = await Promise.all([import(CDN + "firebase-app.js"), import(CDN + "firebase-auth.js"), import(CDN + "firebase-firestore.js")]);
  F = fa; FS = fs; const fb = app.initializeApp(firebaseConfig); auth = fa.getAuth(fb); db = fs.getFirestore(fb);
} catch (e) { console.warn("Firebase could not load:", e); }

/* ---------- 2. page parts ---------- */
const dlg = $("#authdlg"), form = $("#auth-form"), msg = $("#auth-msg");
let mode = "in"; // "in" = sign in, "up" = create account

function setMode(m) {
  mode = m;
  document.querySelectorAll("#authdlg [data-mode]").forEach(b => { const on = b.dataset.mode === m; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
  $("#auth-title").textContent = m === "in" ? "Sign in" : "Create your account";
  $("#auth-name-l").hidden = m === "in";
  $("#auth-submit").textContent = m === "in" ? "Sign in" : "Create account";
  $("#auth-forgot").hidden = m === "up";
  $("#auth-pass").autocomplete = m === "in" ? "current-password" : "new-password";
  showMsg("");
}
function showMsg(text, good) { msg.textContent = text; msg.hidden = !text; msg.classList.toggle("good", !!good); }
function busy(on) { form.querySelectorAll("button,input").forEach(x => x.disabled = on); $("#auth-google").disabled = on; }
function friendly(e) { // easy messages instead of Firebase error codes
  const c = e && e.code || "";
  if (c === "auth/popup-closed-by-user" || c === "auth/cancelled-popup-request") return "";
  return ({
    "auth/invalid-credential": "Wrong email or password.", "auth/wrong-password": "Wrong email or password.", "auth/user-not-found": "Wrong email or password.",
    "auth/invalid-email": "Please type a valid email address.", "auth/missing-password": "Please type your password.",
    "auth/email-already-in-use": "This email already has an account. Choose Sign in.", "auth/weak-password": "Use a password with at least 6 characters.",
    "auth/too-many-requests": "Too many tries. Please wait a moment and try again.", "auth/network-request-failed": "No internet connection. Please try again.",
    "auth/popup-blocked": "Your browser blocked the Google window. Allow pop-ups for this site and try again.", "auth/unauthorized-domain": "This website address is not allowed yet in Firebase (Authentication, Settings, Authorized domains).",
    "auth/operation-not-allowed": "This sign-in method is turned off in Firebase.",
    "auth/requires-recent-login": "For safety, please sign out, sign in again, and then try once more.", "auth/user-mismatch": "That is not the account you are signed in with."
  })[c] || "Something went wrong. Please try again.";
}
function openDialog(m) {
  if (!auth) { say("Sign-in could not load. Check your internet and refresh the page."); return; }
  setMode(m || "in"); form.reset(); showMsg(""); if (!dlg.open) dlg.showModal(); $("#auth-email").focus();
}

/* ---------- 3. buttons ---------- */
$("#auth-btn").onclick = () => openDialog("in");
$("#auth-x").onclick = () => dlg.close();
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); }); // click outside closes
document.querySelectorAll("#authdlg [data-mode]").forEach(b => b.onclick = () => setMode(b.dataset.mode));
$("#auth-show").onchange = e => { $("#auth-pass").type = e.target.checked ? "text" : "password"; };

form.onsubmit = async e => {
  e.preventDefault(); if (!auth) return;
  const email = $("#auth-email").value.trim(), pass = $("#auth-pass").value, name = $("#auth-name").value.trim();
  if (!email || !pass) { showMsg("Please type your email and password."); return; }
  busy(true); showMsg("");
  try {
    if (mode === "in") await F.signInWithEmailAndPassword(auth, email, pass);
    else { const cred = await F.createUserWithEmailAndPassword(auth, email, pass); if (name) await F.updateProfile(cred.user, { displayName: name }); }
    dlg.close();
  } catch (err) { showMsg(friendly(err)); }
  busy(false);
};

$("#auth-forgot").onclick = async () => {
  const email = $("#auth-email").value.trim(); if (!auth) return;
  if (!email) { showMsg("Type your email above first, then press Forgot password."); return; }
  try { await F.sendPasswordResetEmail(auth, email); showMsg("If this email has an account, a reset link is on its way. Check your inbox and spam folder.", true); }
  catch (err) { showMsg(friendly(err)); }
};

$("#auth-google").onclick = async () => {
  if (!auth) return; busy(true); showMsg("");
  try { await F.signInWithPopup(auth, new F.GoogleAuthProvider()); dlg.close(); }
  catch (err) {
    if (err.code === "auth/popup-blocked" || err.code === "auth/operation-not-supported-in-this-environment") { try { await F.signInWithRedirect(auth, new F.GoogleAuthProvider()); return; } catch (e2) { err = e2; } }
    showMsg(friendly(err));
  }
  busy(false);
};

/* account menu (when signed in) */
const acct = $("#acct"), menu = $("#acct-menu"), acctBtn = $("#acct-btn");
function setMenu(open) { menu.hidden = !open; acctBtn.setAttribute("aria-expanded", open); }
acctBtn.onclick = () => setMenu(menu.hidden);
document.addEventListener("click", e => { if (!e.target.closest("#acct")) setMenu(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
$("#auth-profile").onclick = () => { setMenu(false); openProfile(); };
$("#auth-out").onclick = async () => { setMenu(false); try { await F.signOut(auth); say("Signed out"); } catch (e) { say("Could not sign out. Try again."); } };

/* ---------- 4. show who is signed in ---------- */
let avatar = ""; // profile photo saved in the account (a small picture, kept in Firestore)
function showUser(u) {
  $("#auth-btn").hidden = !!u; acct.hidden = !u; setMenu(false);
  if (!u) return;
  const name = u.displayName || (u.email || "").split("@")[0] || "Account", av = $("#acct-av");
  $("#acct-name").textContent = name.split(" ")[0]; $("#acct-dn").textContent = name; $("#acct-em").textContent = u.email || "";
  const pic = avatar || u.photoURL;
  if (pic) { av.textContent = ""; av.style.backgroundImage = `url("${pic}")`; } else { av.style.backgroundImage = ""; av.textContent = name.charAt(0).toUpperCase(); }
}
/* ---------- 5. saving progress in the account (two-way merge, so nothing is lost on any device) ---------- */
const LANGS = ["en", "ko"], sf = l => l === "en" ? "" : "_" + l, ST = "vocabvibe_status", PR = "vocabvibe_progress", DY = "vocabvibe_daily";
const jget = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const readLocal = l => ({ status: jget(ST + sf(l), {}), prog: jget(PR + sf(l), {}), daily: jget(DY + sf(l), {}) });
const writeLocal = (l, b) => {
  localStorage.setItem(ST + sf(l), JSON.stringify(b.status || {}));
  localStorage.setItem(PR + sf(l), JSON.stringify(b.prog && b.prog.streak !== undefined ? b.prog : { best: 0, streak: 0, last: "", ...(b.prog || {}) }));
  if (b.daily && b.daily.date) localStorage.setItem(DY + sf(l), JSON.stringify(b.daily));
};
const norm = o => JSON.stringify(o, (k, v) => v && typeof v === "object" && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([x], [y]) => x.localeCompare(y))) : v);
const rank = s => s === "known" ? 2 : s === "practice" ? 1 : 0;
function mergeBundle(a = {}, b = {}) { // progress only moves forward: known beats practice, best score is the highest, studied days are joined
  const status = { ...(a.status || {}) };
  for (const [id, s] of Object.entries(b.status || {})) if (rank(s) > rank(status[id])) status[id] = s;
  const pa = a.prog || {}, pb = b.prog || {}, ta = pa.last ? new Date(pa.last).getTime() || 0 : 0, tb = pb.last ? new Date(pb.last).getTime() || 0 : 0, lead = tb > ta ? pb : pa;
  const days = [...new Set([...(pa.days || []), ...(pb.days || [])])].sort().slice(-120);
  const prog = { best: Math.max(pa.best || 0, pb.best || 0), streak: ta === tb ? Math.max(pa.streak || 0, pb.streak || 0) : (lead.streak || 0), last: lead.last || "", days };
  const da = a.daily || {}, dbb = b.daily || {}, daily = (da.date || "") > (dbb.date || "") ? da : (dbb.date || "") > (da.date || "") ? dbb : { ...dbb, ...da, score: Math.max(da.score || 0, dbb.score || 0) };
  return { status, prog, daily };
}
let syncInfo = { state: "", text: "" }, syncing = false, again = false, timer = 0;
async function sync(first) {
  const u = auth && auth.currentUser; if (!u || !db) return;
  if (syncing) { again = true; return; } syncing = true;
  try {
    const ref = FS.doc(db, "users", u.uid), snap = await FS.getDoc(ref), remote = snap.exists() ? snap.data() : {}, rd = remote.data || {}, out = {};
    let changed = false;
    for (const l of LANGS) { const loc = readLocal(l), m = mergeBundle(loc, rd[l]); out[l] = m; if (norm(m) !== norm({ status: loc.status, prog: loc.prog, daily: loc.daily })) { writeLocal(l, m); changed = true; } }
    if (norm({ en: out.en, ko: out.ko }) !== norm({ en: rd.en, ko: rd.ko })) {
      if (snap.exists()) await FS.updateDoc(ref, { "data.en": out.en, "data.ko": out.ko, updatedAt: Date.now() });
      else await FS.setDoc(ref, { data: out, updatedAt: Date.now() });
    }
    avatar = (remote.profile && remote.profile.avatar) || "";
    syncInfo = { state: "ok", text: "Saved to your account at " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    showUser(u); if (changed && first) setLang(lang); // show the progress that came from your account
  } catch (e) {
    console.warn("Sync failed:", e);
    syncInfo = { state: "bad", text: e && e.code === "unavailable" ? "You are offline. Your progress will be saved to your account when you are back online." : "Your progress could not be saved to your account yet. Make sure Firestore is created and its rules are published (see the setup steps)." };
  }
  syncing = false; refreshProfile();
  if (again) { again = false; setTimeout(() => sync(false), 500); }
}
window.addEventListener("oratorix:changed", () => { clearTimeout(timer); timer = setTimeout(() => sync(false), 2000); }); // app.js says "progress changed"

/* ---------- 6. profile page ---------- */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = (s, time) => { const d = new Date(s); return isNaN(d) ? "Not available" : d.toLocaleString(undefined, time ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "long" }); };
const hasPassword = u => u.providerData.some(p => p.providerId === "password");
const methods = u => u.providerData.map(p => p.providerId === "google.com" ? "Google" : p.providerId === "password" ? "Email and password" : p.providerId).join(" and ") || "Unknown";
function langStats(l) {
  const list = l === "en" ? DEFAULT_WORDS : DEFAULT_KO, loc = readLocal(l); let known = 0, practice = 0;
  for (const w of list) { const s = loc.status[w.id]; if (s === "known") known++; else if (s === "practice") practice++; }
  const d = loc.daily || {}, p = loc.prog || {};
  return { name: l === "en" ? "English" : "Korean", total: list.length, known, practice, streak: p.streak || 0, best: p.best || 0,
    daily: d.date ? (d.date === dayKey() ? `Today: ${d.score}/${d.total}` : `${d.date}: ${d.score}/${d.total}`) : "Not played yet" };
}
function renderProfile() {
  const box = $("#pf-body"); if (!box) return; const u = auth && auth.currentUser;
  if (!u) { box.innerHTML = '<div class="pf-card"><h2>You are not signed in</h2><p class="muted">Sign in to see your profile.</p><button class="btn green" id="pf-signin">Sign in</button></div>'; return; }
  const name = u.displayName || (u.email || "").split("@")[0] || "Account", pic = avatar || u.photoURL;
  const stats = LANGS.map(langStats);
  box.innerHTML = `<div class="pf-grid">
    <section class="pf-card pf-hero">
      <div class="pf-av" ${pic ? `style="background-image:url('${esc(pic)}')"` : ""}>${pic ? "" : esc(name.charAt(0).toUpperCase())}</div>
      <div class="pf-who"><h1>${esc(name)}</h1><p class="muted">${esc(u.email || "")}</p>
        <div class="pf-tags"><span class="tag">${esc(methods(u))}</span><span class="tag ${u.emailVerified ? "known" : ""}">${u.emailVerified ? "Email verified" : "Email not verified"}</span></div>
        <div class="row left"><button class="btn" data-act="photo">Change photo</button>${pic ? '<button class="btn" data-act="rmphoto">Remove photo</button>' : ""}</div>
        <p class="muted pf-hint" id="pf-photomsg" role="status"></p></div>
    </section>
    <section class="pf-card"><h2>Account details</h2>
      <dl class="pf-dl"><div><dt>Name</dt><dd>${esc(u.displayName || "Not set")}</dd></div><div><dt>Email</dt><dd>${esc(u.email || "")}</dd></div><div><dt>Sign-in method</dt><dd>${esc(methods(u))}</dd></div><div><dt>Joined</dt><dd>${esc(fmt(u.metadata.creationTime))}</dd></div><div><dt>Last sign-in</dt><dd>${esc(fmt(u.metadata.lastSignInTime, true))}</dd></div></dl>
      <form id="pf-nameform" class="pf-form" novalidate><label>Change your name<input id="pf-name" type="text" maxlength="40" value="${esc(u.displayName || "")}" autocomplete="name"></label><button class="btn green" type="submit">Save name</button><p class="pf-msg" id="pf-namemsg" role="status" hidden></p></form>
    </section>
    <section class="pf-card"><h2>Password</h2>
      ${hasPassword(u) ? `<form id="pf-passform" class="pf-form" novalidate><label>Current password<input id="pf-cur" type="password" autocomplete="current-password"></label><label>New password<input id="pf-new" type="password" autocomplete="new-password" minlength="6"></label><label>Confirm new password<input id="pf-new2" type="password" autocomplete="new-password"></label><button class="btn green" type="submit">Change password</button><p class="pf-msg" id="pf-passmsg" role="status" hidden></p></form>`
        : '<p class="muted">You sign in with Google, so you have no password here. You can change your Google password in your Google account.</p>'}
    </section>
    <section class="pf-card pf-wide"><h2>Learning stats</h2>
      <div class="pf-langs">${stats.map(s => `<div class="pf-lang"><h3>${s.name}</h3><div class="pf-big">${s.known}<small> / ${s.total} known</small></div><div class="pf-bar"><i style="width:${s.total ? s.known / s.total * 100 : 0}%"></i></div>
        <ul class="pf-list"><li><b>${s.practice}</b> need practice</li><li><b>${s.streak}</b> day streak</li><li><b>${s.best}%</b> best quiz</li><li>Daily challenge: <b>${esc(s.daily)}</b></li></ul></div>`).join("")}</div>
      <p class="pf-sync ${syncInfo.state}" role="status">${esc(syncInfo.text || "Saving your progress to your account…")}</p>
    </section>
    <section class="pf-card pf-wide pf-danger"><h2>Account actions</h2><div class="row left"><button class="btn" data-act="signout">Sign out</button><button class="btn coral" data-act="delete">Delete my account</button></div></section>
  </div>`;
}
window.renderProfile = renderProfile;
function refreshProfile() { const p = $("#v-profile"); if (p && !p.hidden) renderProfile(); }
const pmsg = (id, text, good) => { const m = $(id); if (!m) return; m.textContent = text; m.hidden = !text; m.classList.toggle("good", !!good); };

function resizePhoto(file) { // makes a small square picture (160 x 160) so it is cheap to save
  return new Promise((ok, no) => { const r = new FileReader(); r.onerror = no; r.onload = () => { const im = new Image(); im.onerror = no; im.onload = () => {
    const c = document.createElement("canvas"), n = 160; c.width = c.height = n; const s = Math.min(im.width, im.height), x = (im.width - s) / 2, y = (im.height - s) / 2;
    c.getContext("2d").drawImage(im, x, y, s, s, 0, 0, n, n); ok(c.toDataURL("image/jpeg", .82)); }; im.src = r.result; }; r.readAsDataURL(file); });
}
async function saveAvatar(url) {
  const u = auth.currentUser; await FS.setDoc(FS.doc(db, "users", u.uid), { profile: { avatar: url } }, { merge: true });
  avatar = url; showUser(u); renderProfile();
}
$("#pf-file").onchange = async e => {
  const f = e.target.files[0]; e.target.value = ""; if (!f) return;
  if (!/^image\//.test(f.type)) { pmsg("#pf-photomsg", "Please choose a picture file."); return; }
  try { pmsg("#pf-photomsg", "Saving your photo…"); await saveAvatar(await resizePhoto(f)); pmsg("#pf-photomsg", "Photo saved.", true); }
  catch (err) { console.warn(err); pmsg("#pf-photomsg", "The photo could not be saved. Make sure Firestore is created and its rules are published."); }
};

$("#pf-body").onclick = async e => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.id === "pf-signin") { openDialog("in"); return; }
  const act = b.dataset.act; if (!act || !auth) return;
  if (act === "photo") $("#pf-file").click();
  if (act === "rmphoto") { try { await saveAvatar(""); } catch { pmsg("#pf-photomsg", "Could not remove the photo. Please try again."); } }
  if (act === "signout") { try { await F.signOut(auth); say("Signed out"); } catch { say("Could not sign out. Try again."); } }
  if (act === "delete") openDelete();
};
$("#pf-body").onsubmit = async e => {
  e.preventDefault(); const u = auth.currentUser; if (!u) return;
  if (e.target.id === "pf-nameform") {
    const n = $("#pf-name").value.trim(); if (!n) { pmsg("#pf-namemsg", "Please type a name."); return; }
    try { await F.updateProfile(u, { displayName: n }); showUser(u); renderProfile(); say("Name saved"); } catch (err) { pmsg("#pf-namemsg", friendly(err)); }
  }
  if (e.target.id === "pf-passform") {
    const cur = $("#pf-cur").value, nw = $("#pf-new").value, n2 = $("#pf-new2").value;
    if (!cur || !nw) { pmsg("#pf-passmsg", "Please fill in both passwords."); return; }
    if (nw.length < 6) { pmsg("#pf-passmsg", "Use a new password with at least 6 characters."); return; }
    if (nw !== n2) { pmsg("#pf-passmsg", "The two new passwords are not the same."); return; }
    try { await F.reauthenticateWithCredential(u, F.EmailAuthProvider.credential(u.email, cur)); await F.updatePassword(u, nw); e.target.reset(); pmsg("#pf-passmsg", "Password changed.", true); }
    catch (err) { pmsg("#pf-passmsg", friendly(err)); }
  }
};

/* delete account */
const ddlg = $("#deldlg");
function openDelete() {
  const u = auth.currentUser; if (!u) return; $("#del-pass-l").hidden = !hasPassword(u); $("#del-form").reset(); pmsg("#del-msg", ""); ddlg.showModal();
}
$("#del-x").onclick = $("#del-cancel").onclick = () => ddlg.close();
$("#del-form").onsubmit = async e => {
  e.preventDefault(); const u = auth.currentUser; if (!u) return;
  if ($("#del-confirm").value.trim() !== "DELETE") { pmsg("#del-msg", "Type DELETE (capital letters) to confirm."); return; }
  try {
    if (hasPassword(u)) { const p = $("#del-pass").value; if (!p) { pmsg("#del-msg", "Please type your password."); return; } await F.reauthenticateWithCredential(u, F.EmailAuthProvider.credential(u.email, p)); }
    else await F.reauthenticateWithPopup(u, new F.GoogleAuthProvider());
    try { await FS.deleteDoc(FS.doc(db, "users", u.uid)); } catch (err) { console.warn(err); } // remove saved progress first
    await F.deleteUser(u); ddlg.close(); say("Your account was deleted."); show("home");
  } catch (err) { pmsg("#del-msg", friendly(err) || "Could not delete the account."); }
};

/* ---------- 7. react to sign in and sign out ---------- */
if (auth) {
  let first = true;
  F.onAuthStateChanged(auth, u => {
    showUser(u);
    if (u) { sync(true); if (!first) say("Signed in as " + (u.displayName || u.email)); }
    else { avatar = ""; syncInfo = { state: "", text: "" }; const p = $("#v-profile"); if (p && !p.hidden) show("home"); }
    refreshProfile(); first = false;
  });
  F.getRedirectResult(auth).catch(() => {}); // finishes a Google sign-in that used the redirect
}