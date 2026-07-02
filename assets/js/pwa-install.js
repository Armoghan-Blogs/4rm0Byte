let deferredPrompt = null;

const STORAGE_KEY = "pwa-install-dismissed";
const DAYS_TO_WAIT = 30;

const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

function canShowAgain() {
  const last = Number(localStorage.getItem(STORAGE_KEY) || 0);

  if (!last) return true;

  return Date.now() - last > DAYS_TO_WAIT * 7 * 60 * 60 * 1000;
}

function dismissPrompt() {
  localStorage.setItem(STORAGE_KEY, Date.now().toString());

  document.getElementById("pwa-install-overlay")?.remove();
}

function showInstallPrompt() {
  if (!deferredPrompt) return;

  if (isStandalone) return;

  if (!canShowAgain()) return;

  if (document.getElementById("pwa-install-overlay")) return;

  const overlay = document.createElement("div");

  overlay.id = "pwa-install-overlay";

  overlay.innerHTML = `
    <div id="pwa-install-card">

        <h2>Install 4rm0Byte</h2>

        <p>
            Install 4rm0Byte on your device for a better experience. You can access it directly from your home screen or app drawer.
        </p>

        <div class="buttons">

            <button id="pwa-install-btn">
                Install
            </button>

            <button id="pwa-later-btn">
                Maybe Later
            </button>

        </div>

    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("pwa-install-btn").addEventListener("click", installPWA);

  document.getElementById("pwa-later-btn").addEventListener("click", dismissPrompt);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      dismissPrompt();
    }
  });
}

async function installPWA() {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();

  const { outcome } = await deferredPrompt.userChoice;

  deferredPrompt = null;

  document.getElementById("pwa-install-overlay")?.remove();

  if (outcome === "dismissed") {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();

  deferredPrompt = e;

  setTimeout(showInstallPrompt, 500);
});

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;

  document.getElementById("pwa-install-overlay")?.remove();

  localStorage.removeItem(STORAGE_KEY);

  console.log("PWA Installed");
});

const style = document.createElement("style");

style.textContent = `
#pwa-install-overlay{
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.6);
    display:flex;
    justify-content:center;
    align-items:center;
    z-index:999999;
    animation:fadeIn .25s;
    backdrop-filter:blur(6px);
}

#pwa-install-card{
    width:min(420px,90vw);
    background:#111827;
    color:white;
    border-radius:18px;
    padding:24px;
    box-shadow:0 20px 60px rgba(0,0,0,.45);
    animation:slideUp .35s ease;
    font-family:system-ui;
}

#pwa-install-card h2{
    margin:0;
    margin-bottom:10px;
}

#pwa-install-card p{
    line-height:1.6;
    opacity:.8;
}

#pwa-install-card .buttons{
    margin-top:24px;
    display:flex;
    gap:12px;
    justify-content:flex-end;
}

#pwa-install-btn{
    cursor:pointer;
    border:none;
    padding:10px 18px;
    border-radius:10px;
    background:#3b82f6;
    color:white;
    font-weight:600;
}

#pwa-install-btn:hover{
    background:#2563eb;
}

#pwa-later-btn{
    cursor:pointer;
    border:none;
    padding:10px 18px;
    border-radius:10px;
    background:#2d3748;
    color:white;
}

#pwa-later-btn:hover{
    background:#4a5568;
}

@keyframes fadeIn{
    from{opacity:0;}
    to{opacity:1;}
}

@keyframes slideUp{
    from{
        opacity:0;
        transform:translateY(30px);
    }
    to{
        opacity:1;
        transform:translateY(0);
    }
}
`;

document.head.appendChild(style);
