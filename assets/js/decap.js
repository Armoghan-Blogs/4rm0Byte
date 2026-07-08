import CMS from "decap-cms-app";
import CreateSelect from "../widgets/Create-Select";

CMS.registerWidget(CreateSelect.Widget());

CMS.init();

CMS.registerEventListener({
  name: "preSave",
  handler: ({ entry }) => {
    const data = entry.get("data");

    const image = data.get("featureimage"); // <-- change if needed

    if (!image) return;

    let filename = "";

    // Case 1: string path
    if (typeof image === "string") {
      filename = image.split("/").pop();
    }

    // Case 2: file object (upload)
    else if (image && image.name) {
      filename = image.name;
    }

    // Case 3: unknown type (fail safe)
    else {
      console.warn("Unknown image format:", image);
      return;
    }

    console.log("Checking filename:", filename); // DEBUG

    const isValid = /^featured\.(png|jpg|jpeg|svg)$/i.test(filename);

    if (!isValid) {
      throw new Error(
        `Invalid filename: "${filename}"\n\nMust be: featured.png|jpg|jpeg|svg`
      );
    }
  },
});

const SELECTORS = [
  '[class*="SettingsWrapper"]',
  '[class*="ToolbarSectionMeta"]'
];

const createToggleButton = () => {
  const btn = document.createElement("button");
  btn.className = "theme-toggle-btn";

  const sunIcon = `
  <svg viewBox="0 0 512 512">
    <path d="M256 159.1c-53.02 0-95.1 42.98-95.1 95.1S202.1 351.1 256 351.1s95.1-42.98 95.1-95.1S309 159.1 256 159.1zM509.3 347L446.1 255.1l63.15-91.01c6.332-9.125 1.104-21.74-9.826-23.72l-109-19.7l-19.7-109c-1.975-10.93-14.59-16.16-23.72-9.824L256 65.89L164.1 2.736c-9.125-6.332-21.74-1.107-23.72 9.824L121.6 121.6L12.56 141.3C1.633 143.2-3.596 155.9 2.736 164.1L65.89 256l-63.15 91.01c-6.332 9.125-1.105 21.74 9.824 23.72l109 19.7l19.7 109c1.975 10.93 14.59 16.16 23.72 9.824L256 446.1l91.01 63.15c9.127 6.334 21.75 1.107 23.72-9.822l19.7-109l109-19.7C510.4 368.8 515.6 356.1 509.3 347zM256 383.1c-70.69 0-127.1-57.31-127.1-127.1c0-70.69 57.31-127.1 127.1-127.1s127.1 57.3 127.1 127.1C383.1 326.7 326.7 383.1 256 383.1z"/>
  </svg>`;

  const moonIcon = `
  <svg viewBox="0 0 512 512">
    <path d="M32 256c0-123.8 100.3-224 223.8-224c11.36 0 29.7 1.668 40.9 3.746c9.616 1.777 11.75 14.63 3.279 19.44C245 86.5 211.2 144.6 211.2 207.8c0 109.7 99.71 193 208.3 172.3c9.561-1.805 16.28 9.324 10.11 16.95C387.9 448.6 324.8 480 255.8 480C132.1 480 32 379.6 32 256z"/>
  </svg>`;

  const updateIcon = () => {
    const isDark = document.documentElement.classList.contains("dark");
    btn.innerHTML = isDark ? sunIcon : moonIcon;
  };

  btn.onclick = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("decap-theme", isDark ? "dark" : "light");
    updateIcon();
  };

  // Load saved theme
  const saved = localStorage.getItem("decap-theme");
  if (saved === "dark") {
    document.documentElement.classList.add("dark");
  }

  updateIcon();

  return btn;
};

// Load saved theme ONCE
const saved = localStorage.getItem("decap-theme");
if (saved === "dark") {
  document.documentElement.classList.add("dark");
}

// Inject into all matching places
const injectButtons = () => {
  SELECTORS.forEach(selector => {
    const elements = document.querySelectorAll(selector);

    elements.forEach(el => {
      if (el.querySelector(".theme-toggle-btn")) return;

      const btn = createToggleButton();
      el.appendChild(btn);
    });
  });
};

// Watch for Decap re-renders
const observer = new MutationObserver(() => {
  injectButtons();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initial run
injectButtons();
