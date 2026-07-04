/**
 * ============================================================================
 * PWA Report
 * ============================================================================
 * Displays information about:
 *
 *  • PWA installation status
 *  • Total cache storage
 *  • Browser storage usage
 *  • PWA install popup cooldown
 *  • Total cached assets
 *  • Duplicate cached assets
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*                                Configuration                               */
/* -------------------------------------------------------------------------- */

const INSTALL_COOLDOWN_DAYS = 30;
const STORAGE_KEY = "pwa-install-dismissed";

/* -------------------------------------------------------------------------- */
/*                                DOM Elements                                */
/* -------------------------------------------------------------------------- */

let elements;
let pwaActions;
let toastTimeout;

document.addEventListener("DOMContentLoaded", () => {
  elements = {
    pwaStatus: document.getElementById("pwa-status"),
    cacheStorage: document.getElementById("cache-storage"),
    browserStorage: document.getElementById("browser-storage"),
    pwaCooldown: document.getElementById("pwa-cooldown"),
    cachedAssets: document.getElementById("cached-assets"),
    duplicateCachedAssets: document.getElementById("duplicate-cached-assets"),
  };

  pwaActions = {
    resetInstallPopup: document.getElementById("reset-pwa-install"),
    deleteDuplicateAssets: document.getElementById("delete-duplicate-assets"),
    deleteAllAssets: document.getElementById("delete-all-assets"),
    removeRuntimeAssets: document.getElementById("remove-runtime-assets"),
    resetServiceWorker: document.getElementById("reset-service-worker"),
    clearCacheStorage: document.getElementById("clear-cache-storage"),
  };

  registerButtonEvents();
  initializePwaReport();
});

/* -------------------------------------------------------------------------- */
/*                              Utility Functions                             */
/* -------------------------------------------------------------------------- */

/**
 * Convert bytes into a readable format.
 *
 * @param {number} bytes
 * @returns {string}
 */
function formatBytes(bytes) {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unit = 0;

  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit++;
  }

  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unit]}`;
}

/* -------------------------------------------------------------------------- */
/*                           PWA Installation Status                          */
/* -------------------------------------------------------------------------- */

/**
 * Returns true if the application is running
 * as an installed Progressive Web App.
 */
function isPwaInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

/**
 * Update the installation status card.
 */
function updatePwaStatus() {
  elements.pwaStatus.textContent = isPwaInstalled() ? "Installed" : "Not Installed";
}

/* -------------------------------------------------------------------------- */
/*                              Cache Storage                                 */
/* -------------------------------------------------------------------------- */

/**
 * Calculate the total size of all caches.
 */
async function updateCacheStorage() {
  if (!("caches" in window)) {
    elements.cacheStorage.textContent = "Unsupported";
    return;
  }

  let totalBytes = 0;

  const cacheNames = await caches.keys();

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();

    for (const request of requests) {
      const response = await cache.match(request);

      if (!response) continue;

      try {
        totalBytes += (await response.clone().blob()).size;
      } catch {}
    }
  }

  elements.cacheStorage.textContent = formatBytes(totalBytes);
}

/* -------------------------------------------------------------------------- */
/*                             Browser Storage                                */
/* -------------------------------------------------------------------------- */

/**
 * Display the browser storage currently being used.
 */
async function updateBrowserStorage() {
  if (!navigator.storage?.estimate) {
    elements.browserStorage.textContent = "Unsupported";
    return;
  }

  const { usage } = await navigator.storage.estimate();

  elements.browserStorage.textContent = formatBytes(usage);
}

/* -------------------------------------------------------------------------- */
/*                          Install Popup Cooldown                            */
/* -------------------------------------------------------------------------- */

/**
 * Display the remaining cooldown before
 * the install popup can appear again.
 */
function updatePopupCooldown() {
  const lastDismissed = Number(localStorage.getItem(STORAGE_KEY) || 0);

  if (!lastDismissed) {
    elements.pwaCooldown.textContent = "Available Now";
    return;
  }

  const nextPopup = lastDismissed + INSTALL_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

  const remaining = nextPopup - Date.now();

  if (remaining <= 0) {
    elements.pwaCooldown.textContent = "Available Now";
    return;
  }

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  elements.pwaCooldown.textContent = `${days}d ${hours}h ${minutes}m`;
}

/* -------------------------------------------------------------------------- */
/*                              Cached Assets                                 */
/* -------------------------------------------------------------------------- */

/**
 * Count every cached request.
 */
async function updateCachedAssets() {
  if (!("caches" in window)) {
    elements.cachedAssets.textContent = "Unsupported";
    return;
  }

  let totalAssets = 0;

  const cacheNames = await caches.keys();

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();

    totalAssets += requests.length;
  }

  elements.cachedAssets.textContent = totalAssets;
}

/* -------------------------------------------------------------------------- */
/*                        Duplicate Cached Assets                             */
/* -------------------------------------------------------------------------- */

/**
 * Count duplicate cached assets.
 */
async function updateDuplicateAssets() {
  if (!("caches" in window)) {
    elements.duplicateCachedAssets.textContent = "Unsupported";
    return;
  }

  const assets = new Map();
  let duplicates = 0;

  const cacheNames = await caches.keys();

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();

    for (const request of requests) {
      const url = new URL(request.url);

      const key = url.pathname.replace(/([.-])[0-9a-f]{6,}(?=\.(css|js)$|$)/gi, "$1").toLowerCase();

      if (assets.has(key)) {
        duplicates++;
      } else {
        assets.set(key, true);
      }
    }
  }

  elements.duplicateCachedAssets.textContent = duplicates;
}

/* -------------------------------------------------------------------------- */
/*                               Refresh Report                               */
/* -------------------------------------------------------------------------- */

/**
 * Refresh every statistic displayed on the page.
 */
async function refreshReport() {
  updatePwaStatus();
  updatePopupCooldown();

  await Promise.all([
    updateCacheStorage(),
    updateBrowserStorage(),
    updateCachedAssets(),
    updateDuplicateAssets(),
  ]);
}

/* -------------------------------------------------------------------------- */
/*                              Button Actions                                */
/* -------------------------------------------------------------------------- */

/**
 * Reset the install popup cooldown.
 */
function resetInstallPrompt() {
  localStorage.removeItem(STORAGE_KEY);

  updatePopupCooldown();

  console.info("Install popup cooldown reset.");
}

/**
 * Delete every cache created by the Service Worker.
 */
async function clearCacheStorage() {
  if (!("caches" in window)) return;

  const cacheNames = await caches.keys();

  await Promise.all(cacheNames.map((name) => caches.delete(name)));

  console.info("Cache storage cleared.");

  await refreshReport();
}

/**
 * Remove duplicate CSS / JS assets.
 */
async function deleteDuplicateAssets() {
  if (!("caches" in window)) return;

  const seen = new Set();

  const cacheNames = await caches.keys();

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();

    for (const request of requests) {
      const url = new URL(request.url);

      const key = url.pathname.replace(/([.-])[0-9a-f]{6,}(?=\.(css|js)$|$)/gi, "$1").toLowerCase();

      if (seen.has(key)) {
        await cache.delete(request);
      } else {
        seen.add(key);
      }
    }
  }

  console.info("Duplicate assets removed.");

  await refreshReport();
}

/**
 * Delete every cached asset while preserving
 * the cache containers.
 */
async function deleteAllAssets() {
  if (!("caches" in window)) return;

  const cacheNames = await caches.keys();

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);

    const requests = await cache.keys();

    await Promise.all(requests.map((request) => cache.delete(request)));
  }

  console.info("All cached assets deleted.");

  await refreshReport();
}

/**
 * Remove only runtime caches.
 */
async function removeRuntimeAssets() {
  if (!("caches" in window)) return;

  const runtimeCaches = ["html-pages-v1", "json-v1", "xml-v1"];

  await Promise.all(runtimeCaches.map((name) => caches.delete(name)));

  console.info("Runtime caches removed.");

  await refreshReport();
}

/**
 * Unregister every Service Worker
 * then reload the page.
 */
async function resetServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();

  await Promise.all(registrations.map((registration) => registration.unregister()));

  console.info("Service Worker unregistered.");

  location.reload();
}

/* -------------------------------------------------------------------------- */
/*                              Event Listeners                               */
/* -------------------------------------------------------------------------- */

/**
 * Register all toolbar button events.
 */
function registerButtonEvents() {
  /* ---------------------------------------------------------------------- */
  /* Reset Install Prompt                                                   */
  /* ---------------------------------------------------------------------- */

  pwaActions.resetInstallPopup?.addEventListener("click", async () => {
    if (!(await confirmAction("Reset the PWA install popup cooldown?"))) return;

    resetInstallPrompt();

    showToast("success", "Install Prompt Reset", "The install popup can now appear again.");
  });

  /* ---------------------------------------------------------------------- */
  /* Clear Cache Storage                                                    */
  /* ---------------------------------------------------------------------- */

  pwaActions.clearCacheStorage?.addEventListener("click", async () => {
    if (!(await confirmAction("Delete every cached asset?"))) return;

    await clearCacheStorage();

    showToast("success", "Cache Cleared", "All cache storage has been removed.");
  });

  /* ---------------------------------------------------------------------- */
  /* Delete Duplicate Assets                                                */
  /* ---------------------------------------------------------------------- */

  pwaActions.deleteDuplicateAssets?.addEventListener("click", async () => {
    if (!(await confirmAction("Delete duplicate cached assets?"))) return;

    await deleteDuplicateAssets();

    showToast("success", "Duplicates Removed", "Duplicate cached assets have been deleted.");
  });

  /* ---------------------------------------------------------------------- */
  /* Delete All Cached Assets                                               */
  /* ---------------------------------------------------------------------- */

  pwaActions.deleteAllAssets?.addEventListener("click", async () => {
    if (!(await confirmAction("Delete ALL cached assets? This cannot be undone."))) return;

    await deleteAllAssets();

    showToast("success", "Assets Deleted", "Every cached asset has been removed.");
  });

  /* ---------------------------------------------------------------------- */
  /* Remove Runtime Assets                                                  */
  /* ---------------------------------------------------------------------- */

  pwaActions.removeRuntimeAssets?.addEventListener("click", async () => {
    if (!(await confirmAction("Delete only runtime caches?"))) return;

    await removeRuntimeAssets();

    showToast("success", "Runtime Cache Removed", "Runtime caches were deleted.");
  });

  /* ---------------------------------------------------------------------- */
  /* Reset Service Worker                                                   */
  /* ---------------------------------------------------------------------- */

  pwaActions.resetServiceWorker?.addEventListener("click", async () => {
    if (!(await confirmAction("Unregister the Service Worker and reload the page?"))) return;

    showToast("success", "Restarting...", "The page will reload in a moment.");

    setTimeout(async () => {
      await resetServiceWorker();
    }, 700);
  });
}

/* -------------------------------------------------------------------------- */
/*                              Toast Notifications                           */
/* -------------------------------------------------------------------------- */

/**
 * Display a toast notification.
 *
 * @param {"success"|"error"|"warning"|"info"} type
 * @param {string} title
 * @param {string} message
 */
function showToast(type, title, message) {
  const toast = document.getElementById("toast");
  const icon = document.getElementById("toast-icon");

  document.getElementById("toast-title").textContent = title;
  document.getElementById("toast-message").textContent = message;

  switch (type) {
    case "success":
      icon.innerHTML = "✅";
      break;

    case "error":
      icon.innerHTML = "❌";
      break;

    case "warning":
      icon.innerHTML = "⚠️";
      break;

    default:
      icon.innerHTML = "ℹ️";
  }

  clearTimeout(toastTimeout);

  toast.classList.remove("opacity-0", "translate-y-6");
  toast.classList.add("opacity-100", "translate-y-0");

  toastTimeout = setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-6");
  }, 3000);
}

/* -------------------------------------------------------------------------- */
/*                              Confirmation Modal                            */
/* -------------------------------------------------------------------------- */

function confirmAction(message) {
  return new Promise((resolve) => {
    const modal = document.getElementById("confirm-modal");
    const text = document.getElementById("confirm-text");

    const ok = document.getElementById("confirm-ok");
    const cancel = document.getElementById("confirm-cancel");

    text.textContent = message;

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    function cleanup(result) {
      modal.classList.remove("flex");
      modal.classList.add("hidden");

      ok.removeEventListener("click", okHandler);
      cancel.removeEventListener("click", cancelHandler);

      resolve(result);
    }

    function okHandler() {
      cleanup(true);
    }

    function cancelHandler() {
      cleanup(false);
    }

    ok.addEventListener("click", okHandler);
    cancel.addEventListener("click", cancelHandler);
  });
}

/* -------------------------------------------------------------------------- */
/*                               Initialization                               */
/* -------------------------------------------------------------------------- */

/**
 * Initialize the PWA report.
 */
async function initializePwaReport() {
  updatePwaStatus();
  updatePopupCooldown();

  await Promise.all([
    updateCacheStorage(),
    updateBrowserStorage(),
    updateCachedAssets(),
    updateDuplicateAssets(),
  ]);
}

/* -------------------------------------------------------------------------- */
/*                              Charts Functions                              */
/* -------------------------------------------------------------------------- */

(function () {
  var chartInstances = [];

  function clearCharts() {
    chartInstances.forEach(function (chart) {
      if (chart && typeof chart.destroy === "function") {
        chart.destroy();
      }
    });
    chartInstances = [];
  }

  function getChartLimit() {
    var select = document.getElementById("chartLimit");
    if (!select) {
      return 12;
    }

    var parsed = parseInt(select.value, 10);
    return Number.isFinite(parsed) ? parsed : 12;
  }

  function getViewportLimit(baseLimit) {
    if (window.matchMedia("(max-width: 767px)").matches) {
      return Math.min(baseLimit, 8);
    }

    if (window.matchMedia("(max-width: 1279px)").matches) {
      return Math.min(baseLimit, 12);
    }

    return baseLimit;
  }

  function isCompactView() {
    return window.matchMedia("(max-width: 767px)").matches;
  }

  function shortLabel(text, max) {
    if (typeof text !== "string") {
      return text;
    }

    if (text.length <= max) {
      return text;
    }

    return text.slice(0, max - 1) + "...";
  }
  function getModalData(payload) {
    function topRows(rows, max) {
      return (rows || []).slice(0, max).map(function (row) {
        return {
          label: row.name || row.label || "Unknown",
          value: row.count || 0,
        };
      });
    }

    return {
      health: {
        title: "Health Score Breakdown",
        text: "The score combines publishing consistency, taxonomy depth, and content readiness.",
        list: [
          { label: "Health Score", value: payload.healthScore || 0 },
          { label: "Published", value: payload.publishedPages || 0 },
          { label: "Drafts", value: payload.draftCount || 0 },
          { label: "Updated in 30 Days", value: payload.freshCount || 0 },
        ],
      },
      inventory: {
        title: "Content Inventory",
        text: "Current volume and organization status of your content library.",
        list: [
          { label: "Total Pages", value: payload.totalPages || 0 },
          { label: "Published", value: payload.publishedPages || 0 },
          { label: "Taxonomy Buckets", value: payload.taxonomyCoverage || 0 },
        ],
      },
      publishing: {
        title: "Publishing Snapshot",
        text: "How actively content is being pushed live and updated recently.",
        list: [
          { label: "Published", value: payload.publishedPages || 0 },
          { label: "Fresh in 30 Days", value: payload.freshCount || 0 },
          { label: "Average Read (min)", value: payload.avgReadingTime || 0 },
        ],
      },
      drafts: {
        title: "Draft Pipeline",
        text: "Draft counts indicate upcoming content and editorial backlog.",
        list: [
          { label: "Drafts", value: payload.draftCount || 0 },
          { label: "Published", value: payload.publishedPages || 0 },
        ],
      },
      words: {
        title: "Word Metrics",
        text: "Word totals show production volume and long-form investment.",
        list: [
          { label: "Total Words", value: payload.totalWords || 0 },
          { label: "Average Words", value: payload.avgWords || 0 },
          { label: "Average Read (min)", value: payload.avgReadingTime || 0 },
        ],
      },
      avgWords: {
        title: "Average Length Detail",
        text: "Average word count helps balance quick reads and deep dives.",
        list: [
          { label: "Average Words", value: payload.avgWords || 0 },
          { label: "Published", value: payload.publishedPages || 0 },
        ],
      },
      avgRead: {
        title: "Reading Time Detail",
        text: "Reading time reflects how demanding your content is for readers.",
        list: [
          { label: "Avg Reading Time (min)", value: payload.avgReadingTime || 0 },
          { label: "Total Words", value: payload.totalWords || 0 },
        ],
      },
      freshness: {
        title: "Freshness Detail",
        text: "This tracks how many published posts were updated recently.",
        list: [
          { label: "Updated in Last 30 Days", value: payload.freshCount || 0 },
          { label: "Published", value: payload.publishedPages || 0 },
        ],
      },
      trend: {
        title: "Publishing Trend Insight",
        text: "Monthly publishing trend helps detect momentum or stagnation.",
        list: topRows(payload.timeline, 10),
      },
      sections: {
        title: "Section Coverage Insight",
        text: "Distribution across sections highlights structural balance.",
        list: topRows(payload.sections, 10),
      },
      tags: {
        title: "Tags Coverage Insight",
        text: "Tag distribution reveals how tightly your topics cluster.",
        list: topRows(payload.tags, 12),
      },
      categories: {
        title: "Categories Coverage Insight",
        text: "Category balance helps maintain a readable site structure.",
        list: topRows(payload.categories, 12),
      },
      series: {
        title: "Series Coverage Insight",
        text: "Series usage shows long-running content initiatives.",
        list: topRows(payload.series, 12),
      },
      keywords: {
        title: "Keywords Coverage Insight",
        text: "Keyword distribution helps with search and discoverability.",
        list: topRows(payload.keywords, 12),
      },
      length: {
        title: "Length Profile Insight",
        text: "Length buckets show your mix of short, medium, and deep content.",
        list: topRows(payload.lengthBuckets, 6),
      },
    };
  }

  function buildDataset(rows, labelKey, fallbackLabel, fallbackValue, maxItems) {
    if (!rows || rows.length === 0) {
      return {
        labels: [fallbackLabel],
        values: [Math.max(1, fallbackValue || 1)],
      };
    }

    var prepared = rows.slice().sort(function (a, b) {
      return (b.count || 0) - (a.count || 0);
    });

    if (maxItems && prepared.length > maxItems) {
      prepared = prepared.slice(0, maxItems);
    }

    return {
      labels: prepared.map(function (item) {
        return item[labelKey] || "Unknown";
      }),
      values: prepared.map(function (item) {
        return Math.max(0, item.count || 0);
      }),
    };
  }

  function setupModal(payload) {
    var modal = document.getElementById("reportModal");
    var modalTitle = document.getElementById("reportModalTitle");
    var modalText = document.getElementById("reportModalText");
    var modalList = document.getElementById("reportModalList");
    var closeBtn = document.getElementById("reportModalClose");

    if (!modal || !modalTitle || !modalText || !modalList || !closeBtn) {
      return;
    }

    var modalData = getModalData(payload);

    function renderList(list) {
      modalList.innerHTML = "";
      (list || []).forEach(function (item) {
        var row = document.createElement("div");
        row.className =
          "flex items-center justify-between px-3 py-2 text-sm border rounded-lg border-neutral-200 dark:border-neutral-700";

        var label = document.createElement("span");
        label.className = "text-neutral-700 dark:text-neutral-200";
        label.textContent = item.label;

        var value = document.createElement("strong");
        value.className = "text-primary-600";
        value.textContent = String(item.value);

        row.appendChild(label);
        row.appendChild(value);
        modalList.appendChild(row);
      });
    }

    function openModal(key) {
      var data = modalData[key];
      if (!data) {
        return;
      }

      modalTitle.textContent = data.title;
      modalText.textContent = data.text;
      renderList(data.list || []);

      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.classList.add("report-modal-open");
    }

    function closeModal() {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.classList.remove("report-modal-open");
    }

    document.querySelectorAll(".metric-card-trigger, .modal-trigger").forEach(function (el) {
      el.addEventListener("click", function () {
        openModal(el.getAttribute("data-modal-key"));
      });

      el.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openModal(el.getAttribute("data-modal-key"));
        }
      });
    });

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
      }
    });
  }

  function showWarning() {
    var warn = document.getElementById("chartLoadWarning");
    if (warn) {
      warn.classList.remove("hidden");
    }
  }

  function chartBaseOptions(gridColor, axisColor, horizontal) {
    var compact = isCompactView();

    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 750 },
      resizeDelay: 120,
      indexAxis: horizontal ? "y" : "x",
      layout: {
        padding: {
          top: 4,
          right: compact ? 4 : 8,
          bottom: compact ? 4 : 8,
          left: compact ? 4 : 8,
        },
      },
      interaction: {
        mode: "nearest",
        axis: "xy",
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(15,23,42,0.9)",
          titleColor: "#f8fafc",
          bodyColor: "#e2e8f0",
          borderColor: "rgba(148,163,184,0.25)",
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          grid: { display: !horizontal, color: gridColor },
          ticks: {
            color: axisColor,
            autoSkip: true,
            maxRotation: horizontal ? 0 : compact ? 24 : 35,
            minRotation: 0,
            maxTicksLimit: horizontal ? (compact ? 8 : 12) : compact ? 6 : 10,
            font: {
              size: compact ? 10 : 11,
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: { color: gridColor },
          ticks: {
            color: axisColor,
            precision: 0,
            stepSize: 1,
            autoSkip: true,
            maxTicksLimit: horizontal ? (compact ? 12 : 18) : compact ? 6 : 8,
            font: {
              size: compact ? 10 : 11,
            },
            callback: function (value) {
              return horizontal ? shortLabel(String(value), compact ? 18 : 26) : value;
            },
          },
        },
      },
    };
  }

  function drawBarChart(canvasId, labels, values, color, gridColor, axisColor, label, horizontal) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) {
      return;
    }

    var chart = new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels.map(function (item) {
          return shortLabel(item, horizontal ? 32 : 16);
        }),
        datasets: [
          {
            label: label,
            data: values,
            backgroundColor: color,
            borderColor: color.replace("0.78", "1"),
            borderWidth: 1,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: chartBaseOptions(gridColor, axisColor, horizontal),
    });

    chartInstances.push(chart);
  }

  function initCharts(payload, Chart) {
    clearCharts();

    var isDark = document.documentElement.classList.contains("dark");
    var compact = isCompactView();
    var axisColor = isDark ? "#cbd5e1" : "#334155";
    var gridColor = isDark ? "rgba(148,163,184,0.28)" : "rgba(71,85,105,0.16)";
    var limit = getViewportLimit(getChartLimit());

    Chart.defaults.color = axisColor;
    Chart.defaults.font.family = "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif";
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.responsive = true;

    var publishedCount = payload.publishedPages || 1;

    var trend = buildDataset(payload.timeline, "label", "Current Month", publishedCount, 24);
    var sections = buildDataset(payload.sections, "name", "Unassigned Section", publishedCount, limit);
    var tags = buildDataset(payload.tags, "name", "No tags yet", publishedCount, limit);
    var categories = buildDataset(payload.categories, "name", "No categories yet", publishedCount, limit);
    var series = buildDataset(payload.series, "name", "No series yet", publishedCount, limit);
    var keywords = buildDataset(payload.keywords, "name", "No keywords yet", publishedCount, limit);
    var lengths = buildDataset(payload.lengthBuckets, "label", "No content yet", 1, 8);

    var trendCanvas = document.getElementById("trendChart");
    if (trendCanvas) {
      var trendChart = new Chart(trendCanvas, {
        type: "line",
        data: {
          labels: trend.labels,
          datasets: [
            {
              label: "Published",
              data: trend.values,
              borderColor: "#0ea5e9",
              backgroundColor: "rgba(14,165,233,0.2)",
              fill: true,
              pointRadius: trend.values.length <= 1 ? 7 : 3,
              pointHoverRadius: trend.values.length <= 1 ? 9 : 5,
              pointBackgroundColor: "#0284c7",
              pointBorderWidth: 2,
              pointBorderColor: isDark ? "#0f172a" : "#ffffff",
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          resizeDelay: 120,
          layout: {
            padding: {
              top: 4,
              right: compact ? 4 : 8,
              bottom: compact ? 4 : 8,
              left: compact ? 4 : 8,
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "rgba(15,23,42,0.9)",
              titleColor: "#f8fafc",
              bodyColor: "#e2e8f0",
            },
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: {
                color: axisColor,
                maxTicksLimit: compact ? 8 : 12,
                maxRotation: compact ? 22 : 0,
                callback: function (_value, index) {
                  return shortLabel(trend.labels[index], compact ? 7 : 9);
                },
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                stepSize: 1,
                maxTicksLimit: compact ? 6 : 9,
                font: {
                  size: compact ? 10 : 11,
                },
              },
              grid: { color: gridColor },
            },
          },
        },
      });

      chartInstances.push(trendChart);
    }

    var sectionCanvas = document.getElementById("sectionChart");
    if (sectionCanvas) {
      var sectionChart = new Chart(sectionCanvas, {
        type: "doughnut",
        data: {
          labels: sections.labels,
          datasets: [
            {
              data: sections.values,
              backgroundColor: [
                "#0ea5e9",
                "#14b8a6",
                "#22c55e",
                "#f59e0b",
                "#ef4444",
                "#a855f7",
                "#f97316",
                "#84cc16",
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          resizeDelay: 120,
          cutout: "58%",
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                usePointStyle: true,
                boxWidth: 10,
                padding: compact ? 8 : 10,
                font: {
                  size: compact ? 10 : 11,
                },
                color: axisColor,
                generateLabels: function (chart) {
                  var labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                  return labels.slice(0, compact ? 8 : 12);
                },
              },
            },
          },
        },
      });

      chartInstances.push(sectionChart);
    }

    drawBarChart(
      "tagsChart",
      tags.labels,
      tags.values,
      "rgba(245,158,11,0.78)",
      gridColor,
      axisColor,
      "Tags",
      true,
    );
    drawBarChart(
      "categoriesChart",
      categories.labels,
      categories.values,
      "rgba(6,182,212,0.78)",
      gridColor,
      axisColor,
      "Categories",
      true,
    );
    drawBarChart(
      "seriesChart",
      series.labels,
      series.values,
      "rgba(139,92,246,0.78)",
      gridColor,
      axisColor,
      "Series",
      true,
    );
    drawBarChart(
      "keywordsChart",
      keywords.labels,
      keywords.values,
      "rgba(217,70,239,0.78)",
      gridColor,
      axisColor,
      "Keywords",
      true,
    );

    var lengthCanvas = document.getElementById("lengthChart");
    if (lengthCanvas) {
      var lengthChart = new Chart(lengthCanvas, {
        type: "polarArea",
        data: {
          labels: lengths.labels,
          datasets: [
            {
              data: lengths.values,
              backgroundColor: [
                "rgba(14,165,233,0.65)",
                "rgba(34,197,94,0.65)",
                "rgba(168,85,247,0.62)",
                "rgba(239,68,68,0.58)",
              ],
              borderWidth: 1,
              borderColor: isDark ? "rgba(148,163,184,0.35)" : "rgba(100,116,139,0.35)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          resizeDelay: 120,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                usePointStyle: true,
                boxWidth: 10,
                padding: compact ? 8 : 12,
                font: {
                  size: compact ? 10 : 11,
                },
                color: axisColor,
              },
            },
          },
        },
      });

      chartInstances.push(lengthChart);
    }
  }

  function waitForChartAndInit(payload) {
    var attempts = 0;
    var maxAttempts = 80;
    var timer = setInterval(function () {
      attempts += 1;
      if (typeof window.Chart !== "undefined") {
        clearInterval(timer);
        initCharts(payload, window.Chart);
      } else if (attempts >= maxAttempts) {
        clearInterval(timer);
        showWarning();
      }
    }, 100);
  }

  function boot() {
    var payload = window.__REPORT_DATA__;
    if (!payload) {
      var payloadEl = document.getElementById("report-data");
      if (!payloadEl) {
        return;
      }

      try {
        payload = JSON.parse(payloadEl.textContent || "{}");
      } catch (_e) {
        return;
      }
    }

    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch (_e2) {
        return;
      }
    }

    setupModal(payload);
    waitForChartAndInit(payload);

    var limitSelect = document.getElementById("chartLimit");
    if (limitSelect) {
      limitSelect.addEventListener("change", function () {
        if (typeof window.Chart !== "undefined") {
          initCharts(payload, window.Chart);
        }
      });
    }

    var observer = new MutationObserver(function () {
      if (typeof window.Chart !== "undefined") {
        initCharts(payload, window.Chart);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    var resizeTimer;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (typeof window.Chart !== "undefined") {
          initCharts(payload, window.Chart);
        }
      }, 180);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();

function setupPagination(containerId, cardClass, prevBtnId, nextBtnId, currentPageId, perPage = 6) {
  const container = document.getElementById(containerId);
  const cards = Array.from(container.querySelectorAll(cardClass));
  const pages = Math.ceil(cards.length / perPage);
  let currentPage = 0;

  function showPage(page) {
    cards.forEach((card) => {
      card.classList.add("hidden");
      card.style.opacity = "0";
    });
    cards
      .filter((c) => parseInt(c.dataset.page) === page)
      .forEach((c, i) => {
        c.classList.remove("hidden");
        setTimeout(() => (c.style.opacity = "1"), i * 50);
      });
    document.getElementById(currentPageId).innerText = page + 1;
  }

  document.getElementById(prevBtnId).addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      showPage(currentPage);
    }
  });
  document.getElementById(nextBtnId).addEventListener("click", () => {
    if (currentPage < pages - 1) {
      currentPage++;
      showPage(currentPage);
    }
  });

  showPage(0);
}

// Initialize all sections
document.addEventListener("DOMContentLoaded", () => {
  setupPagination("tags-container", ".tag-card", "prev-page", "next-page", "current-page", 6);
  setupPagination(
    "categories-container",
    ".category-card",
    "prev-cat-page",
    "next-cat-page",
    "current-cat-page",
    6,
  );
  setupPagination(
    "series-container",
    ".series-card",
    "prev-series-page",
    "next-series-page",
    "current-series-page",
    6,
  );
  setupPagination(
    "keywords-container",
    ".keyword-card",
    "prev-keyword-page",
    "next-keyword-page",
    "current-keyword-page",
    6,
  );
});

/* -------------------------------------------------------------------------- */
/*                        ADVANCED CACHE UI FUNCTIONALITY                     */
/* -------------------------------------------------------------------------- */

/**
 * Get cache stats (files + size)
 */
async function getCacheStats(cacheName) {
  if (!("caches" in window)) return { files: 0, size: 0 };

  const cache = await caches.open(cacheName);
  const requests = await cache.keys();

  let totalSize = 0;

  for (const req of requests) {
    const res = await cache.match(req);
    if (!res) continue;

    try {
      totalSize += (await res.clone().blob()).size;
    } catch {}
  }

  return {
    files: requests.length,
    size: totalSize,
  };
}

/* -------------------------------------------------------------------------- */
/*                           UPDATE CACHE CARDS                               */
/* -------------------------------------------------------------------------- */

async function updateCacheCardsDynamic() {
  const container = document.querySelector("[data-cache-grid]");

  if (!container) return;

  container.innerHTML = "";

  const cacheNames = await caches.keys();

  for (const cacheName of cacheNames) {
    const stats = await getCacheStats(cacheName);

    const card = document.createElement("div");

    card.className =
      "relative p-6 transition-all duration-300 border rounded-xl border-neutral-200 dark:border-neutral-700 hover:shadow-lg hover:-translate-y-1";

    card.innerHTML = `
      <div class="absolute top-0 left-0 w-full h-1 bg-primary-500 rounded-t-xl"></div>

      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">${cacheName}</h3>
          <p class="text-xs text-neutral-500">Cache Storage</p>
        </div>

        <span class="px-2 py-1 text-xs rounded-full bg-neutral-200 dark:bg-neutral-700">
          Active
        </span>
      </div>

      <div class="grid grid-cols-2 gap-6 mt-6">
        <div>
          <p class="text-xs text-neutral-500">Files</p>
          <p class="text-2xl font-bold">${stats.files}</p>
        </div>

        <div>
          <p class="text-xs text-neutral-500">Size</p>
          <p class="text-2xl font-bold">${formatBytes(stats.size)}</p>
        </div>
      </div>

      <div class="flex gap-2 mt-6">
        <button class="view-btn flex-1 py-2 text-sm text-white rounded-lg bg-primary-600 hover:bg-primary-700">
          View
        </button>

        <button class="delete-btn flex-1 py-2 text-sm text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white">
          Delete
        </button>
      </div>
    `;

    // View button
    card.querySelector(".view-btn").addEventListener("click", () => {
      renderCacheExplorer(cacheName);
    });

    // Delete button
    card.querySelector(".delete-btn").addEventListener("click", async () => {
      if (!(await confirmAction(`Delete ${cacheName}?`))) return;

      await caches.delete(cacheName);

      showToast("success", "Deleted", `${cacheName} removed.`);
      updateCacheCardsDynamic();
      renderDuplicateAssets();
    });

    container.appendChild(card);
  }
}

/* -------------------------------------------------------------------------- */
/*                           CACHE EXPLORER                                   */
/* -------------------------------------------------------------------------- */

async function renderCacheExplorer(cacheName) {
  const container = document.getElementById("cache-explorer");
  const label = document.getElementById("selected-cache-name");

  container.innerHTML = "";
  label.textContent = cacheName;

  const cache = await caches.open(cacheName);
  const requests = await cache.keys();

  if (requests.length === 0) {
    container.innerHTML = `<div class="p-4 text-sm text-neutral-500">No files found.</div>`;
    return;
  }

  for (const req of requests) {
    const url = new URL(req.url);

    const row = document.createElement("div");
    row.className =
      "flex items-center justify-between px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800";

    row.innerHTML = `
      <span class="truncate">${url.pathname}</span>
      <button class="text-xs text-red-500 hover:underline">Delete</button>
    `;

    // delete single file
    row.querySelector("button").addEventListener("click", async () => {
      if (!(await confirmAction("Delete this file from cache?"))) return;

      const cache = await caches.open(cacheName);
      await cache.delete(req);

      showToast("success", "Deleted", "File removed from cache.");
      renderCacheExplorer(cacheName);
      updateCacheCards();
    });

    container.appendChild(row);
  }
}

/* -------------------------------------------------------------------------- */
/*                         VIEW BUTTON HANDLERS                               */
/* -------------------------------------------------------------------------- */

function registerExplorerButtons() {
  document.getElementById("view-css-cache")?.addEventListener("click", () => {
    renderCacheExplorer("assets-css-v1");
  });

  document.getElementById("view-js-cache")?.addEventListener("click", () => {
    renderCacheExplorer("assets-js-v1");
  });

  document.getElementById("view-image-cache")?.addEventListener("click", () => {
    renderCacheExplorer("images-v1");
  });
}

/* -------------------------------------------------------------------------- */
/*                         DELETE CACHE BUTTONS                               */
/* -------------------------------------------------------------------------- */

function registerDeleteButtons() {
  const map = [
    { id: "delete-css-cache", cache: "assets-css-v1" },
    { id: "delete-js-cache", cache: "assets-js-v1" },
    { id: "delete-image-cache", cache: "images-v1" },
  ];

  map.forEach(({ id, cache }) => {
    document.getElementById(id)?.addEventListener("click", async () => {
      if (!(await confirmAction(`Delete entire ${cache}?`))) return;

      await caches.delete(cache);

      showToast("success", "Deleted", `${cache} cleared.`);
      updateCacheCards();

      // reset explorer if viewing same cache
      const selected = document.getElementById("selected-cache-name");
      if (selected.textContent === cache) {
        document.getElementById("cache-explorer").innerHTML = "";
        selected.textContent = "Select a cache";
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/*                        DUPLICATE ASSETS UI                                 */
/* -------------------------------------------------------------------------- */

async function renderDuplicateAssets() {
  const container = document.getElementById("duplicate-assets-list");
  container.innerHTML = "";

  const map = new Map();
  const duplicates = [];

  const cacheNames = await caches.keys();

  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const requests = await cache.keys();

    for (const req of requests) {
      const url = new URL(req.url);

      const key = url.pathname.replace(/([.-])[0-9a-f]{6,}/gi, "$1").toLowerCase();

      if (map.has(key)) {
        duplicates.push({ key, request: req, cache: name });
      } else {
        map.set(key, true);
      }
    }
  }

  if (duplicates.length === 0) {
    container.innerHTML = `<div class="p-4 text-sm text-green-500">No duplicates 🎉</div>`;
    return;
  }

  duplicates.forEach(({ key, request, cache }) => {
    const row = document.createElement("div");

    row.className =
      "flex items-center justify-between px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800";

    row.innerHTML = `
      <span class="truncate">${key}</span>
      <button class="text-xs text-red-500 hover:underline">Delete</button>
    `;

    row.querySelector("button").addEventListener("click", async () => {
      if (!(await confirmAction("Delete this duplicate?"))) return;

      const c = await caches.open(cache);
      await c.delete(request);

      showToast("success", "Deleted", "Duplicate removed.");
      renderDuplicateAssets();
      updateCacheCards();
    });

    container.appendChild(row);
  });
}

/* -------------------------------------------------------------------------- */
/*                    DELETE ALL DUPLICATES BUTTON                            */
/* -------------------------------------------------------------------------- */

function registerDuplicateDeleteAll() {
  document.getElementById("delete-all-duplicates")?.addEventListener("click", async () => {
    if (!(await confirmAction("Delete ALL duplicate assets?"))) return;

    await deleteDuplicateAssets(); // your existing function

    showToast("success", "Cleaned", "All duplicates removed.");
    renderDuplicateAssets();
    updateCacheCards();
  });
}

/* -------------------------------------------------------------------------- */
/*                              INIT HOOK                                     */
/* -------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", async () => {
  await updateCacheCardsDynamic();
  registerExplorerButtons();
  registerDeleteButtons();
  registerDuplicateDeleteAll();
  renderDuplicateAssets();
});
