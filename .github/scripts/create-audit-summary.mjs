// create-audit-summary.mjs
import fs from "node:fs";
import path from "node:path";

const REPORT_DIR = path.resolve(".github/seo-reports");

const DEPLOY_URL = process.env.DEPLOY_URL || "";
const COMMIT_SHA = process.env.COMMIT_SHA || "";
const RUN_NUMBER = process.env.RUN_NUMBER || "";

const readJson = (filename, fallback = null) => {
  const file = path.join(REPORT_DIR, filename);

  if (!fs.existsSync(file)) {
    return fallback;
  }

  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
};

const clampScore = (score) => {
  if (typeof score !== "number") {
    return null;
  }

  return Math.round(score * 100);
};

const lighthouseSummary = (filename) => {
  const report = readJson(filename);

  if (!report) {
    return {
      available: false,
    };
  }

  const categories = report.categories ?? {};
  const audits = report.audits ?? {};

  const seo = clampScore(categories.seo?.score);
  const accessibility = clampScore(categories.accessibility?.score);

  const failedAudits = Object.values(audits)
    .filter((audit) => {
      if (!audit) return false;

      if (audit.scoreDisplayMode === "notApplicable") {
        return false;
      }

      return typeof audit.score === "number" && audit.score < 1;
    })
    .map((audit) => ({
      id: audit.id,
      title: audit.title,
      score: audit.score,
      displayMode: audit.scoreDisplayMode,
    }));

  return {
    available: true,
    url: report.finalUrl ?? null,
    fetchTime: report.fetchTime ?? null,
    seo,
    accessibility,
    failedAudits,
  };
};

const pa11ySummary = (filename) => {
  const report = readJson(filename);

  if (!Array.isArray(report)) {
    return {
      available: false,
      errors: 0,
      warnings: 0,
      notices: 0,
      total: 0,
      issues: [],
    };
  }

  const errors = report.filter((item) => item.type === "error").length;
  const warnings = report.filter((item) => item.type === "warning").length;
  const notices = report.filter((item) => item.type === "notice").length;

  const issues = report.slice(0, 10).map((item) => ({
    type: item.type,
    message: item.message,
    selector: item.selector,
    code: item.code,
  }));

  return {
    available: true,
    errors,
    warnings,
    notices,
    total: report.length,
    issues,
  };
};

const axeSummary = (filename) => {
  const report = readJson(filename);

  if (!report) {
    return {
      available: false,
      violations: 0,
      incomplete: 0,
      passes: 0,
      inapplicable: 0,
      impact: {},
      issues: [],
    };
  }

  const violations = Array.isArray(report.violations)
    ? report.violations
    : [];

  const incomplete = Array.isArray(report.incomplete)
    ? report.incomplete
    : [];

  const passes = Array.isArray(report.passes)
    ? report.passes
    : [];

  const inapplicable = Array.isArray(report.inapplicable)
    ? report.inapplicable
    : [];

  const impact = {};

  for (const violation of violations) {
    const level = violation.impact || "unknown";
    impact[level] = (impact[level] || 0) + 1;
  }

  const issues = violations.slice(0, 10).map((item) => ({
    id: item.id,
    impact: item.impact,
    help: item.help,
    helpUrl: item.helpUrl,
    nodes: item.nodes?.length ?? 0,
  }));

  return {
    available: true,
    violations: violations.length,
    incomplete: incomplete.length,
    passes: passes.length,
    inapplicable: inapplicable.length,
    impact,
    issues,
  };
};

const lighthouseOffline = lighthouseSummary("lighthouse-offline.json");
const lighthouseOnline = lighthouseSummary("lighthouse-online.json");

const pa11yOffline = pa11ySummary("pa11y-offline.json");
const pa11yOnline = pa11ySummary("pa11y-online.json");

const axeOffline = axeSummary("axe-offline.json");
const axeOnline = axeSummary("axe-online.json");

const difference = (online, offline) => {
  if (
    typeof online !== "number" ||
    typeof offline !== "number"
  ) {
    return null;
  }

  return online - offline;
};

const summary = {
  generatedAt: new Date().toISOString(),

  run: {
    number: RUN_NUMBER,
    commit: COMMIT_SHA,
  },

  urls: {
    production: "https://4rm0byte.netlify.app",
    temporary: DEPLOY_URL,
    local: "http://127.0.0.1:4173",
  },

  lighthouse: {
    offline: lighthouseOffline,
    online: lighthouseOnline,

    difference: {
      seo: difference(
        lighthouseOnline.seo,
        lighthouseOffline.seo
      ),

      accessibility: difference(
        lighthouseOnline.accessibility,
        lighthouseOffline.accessibility
      ),
    },
  },

  pa11y: {
    offline: pa11yOffline,
    online: pa11yOnline,

    difference: {
      errors:
        pa11yOnline.errors - pa11yOffline.errors,

      warnings:
        pa11yOnline.warnings - pa11yOffline.warnings,

      total:
        pa11yOnline.total - pa11yOffline.total,
    },
  },

  axe: {
    offline: axeOffline,
    online: axeOnline,

    difference: {
      violations:
        axeOnline.violations - axeOffline.violations,

      incomplete:
        axeOnline.incomplete - axeOffline.incomplete,

      passes:
        axeOnline.passes - axeOffline.passes,
    },
  },
};

fs.writeFileSync(
  path.join(REPORT_DIR, "audit-summary.json"),
  JSON.stringify(summary, null, 2)
);

console.log(
  JSON.stringify(summary, null, 2)
);
