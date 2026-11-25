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
let F = null, auth = null;
try {
  const [app, fa] = await Promise.all([import(CDN + "firebase-app.js"), import(CDN + "firebase-auth.js")]);
  F = fa; auth = fa.getAuth(app.initializeApp(firebaseConfig));
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
    "auth/operation-not-allowed": "This sign-in method is turned off in Firebase."
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
$("#auth-out").onclick = async () => { setMenu(false); try { await F.signOut(auth); say("Signed out"); } catch (e) { say("Could not sign out. Try again."); } };

/* ---------- 4. show who is signed in ---------- */
function showUser(u) {
  $("#auth-btn").hidden = !!u; acct.hidden = !u; setMenu(false);
  if (!u) return;
  const name = u.displayName || (u.email || "").split("@")[0] || "Account", av = $("#acct-av");
  $("#acct-name").textContent = name.split(" ")[0]; $("#acct-dn").textContent = name; $("#acct-em").textContent = u.email || "";
  if (u.photoURL) { av.textContent = ""; av.style.backgroundImage = `url("${u.photoURL}")`; } else { av.style.backgroundImage = ""; av.textContent = name.charAt(0).toUpperCase(); }
}
if (auth) {
  let first = true;
  F.onAuthStateChanged(auth, u => { showUser(u); if (u && !first) say("Signed in as " + (u.displayName || u.email)); first = false; });
  F.getRedirectResult(auth).catch(() => {}); // finishes a Google sign-in that used the redirect
}