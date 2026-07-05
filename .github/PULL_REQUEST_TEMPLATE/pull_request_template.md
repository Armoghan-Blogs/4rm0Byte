<!--
  🛑 READ THIS CAREFULLY BEFORE SUBMITTING 🛑

  4rm0Byte is a personal repository managed strictly for individual workflows and
  blogging updates. As detailed in CONTRIBUTING.md, open public contributions are
  NOT accepted by default.

  Unsolicited features, personal stylistic choices, or non-essential refactors
  will be closed automatically without review. Thank you for respecting this boundary!
-->

# Contribution Gateway Check

Before completing this form, you **must** verify that this Pull Request meets the strict criteria for exceptional upstream inclusion.

- [ ] I have read and agree to follow the project's [CONTRIBUTING.md](../../CONTRIBUTING.md).
- [ ] This PR addresses an **exceptional, high-value case** that cannot be handled via a personal fork.

### Exception Category
*Please check the single most relevant box below:*
- [ ] **Critical Security Patch:** Fixes a vulnerability exposing the site, server, or user data.
- [ ] **Critical Bug Fix:** Resolves an issue that breaks local compilation, site builds, or deployment workflows.
- [ ] **Core Performance Optimization:** Offers measurable, high-impact improvements to build speeds or production asset sizes.
- [ ] **Major Documentation Correction:** Rectifies a glaring error, broken core link, or deep instructional confusion.

> **Note:** If none of the boxes above are checked, this Pull Request will be closed immediately.

---

# Pull Request Details

## 1. Context & Rationale

### Summary
*Provide a concise explanation of what this PR changes, why it is vital to the core repository, and why it cannot be deferred or isolated to a fork.*

### Root Cause / Impact
*If this is a bug fix or security patch, what exactly was failing, and how does this change resolve it?*

### Linked Issues
- Fixes # (insert issue number here, if applicable)

---

## 2. Technical Scope & Testing

### Type of Change
- [ ] Security fix
- [ ] Bugfix (non-breaking change fixing an ongoing issue)
- [ ] Performance tuning (speed, bundle size, dependency reduction)
- [ ] Critical documentation update

### Local Verification Steps
*Detail exactly how you tested these changes locally so they can be reproduced.*

1. Run the local server using: `npm run dev` / `npm run prod`
2. Navigate to: `http://localhost:1313/...`
3. Observe the following behavior:

### Environmental / Build Impact
*Does this change alter any configurations outside of layout files? (e.g., changes to `.nvmrc`, `package.json`, `go.mod`, or custom workflows?)*
- [ ] No impact outside layouts/content.
- [ ] Yes (Please detail below: e.g., updated Go modules, changed npm dependencies).

---

## 3. Visual & UI Changes (If Applicable)
*If your change impacts layout templates, markdown rendering styles, components, or Tailwind output classes, please provide visual evidence (Before vs. After).*

| Before | After |
| :--- | :--- |
| *Insert image/GIF here* | *Insert image/GIF here* |

---

## 4. Pre-Submission Quality Checklist
*You must perform these checks locally before requesting an upstream review:*

- [ ] **Formatting:** Code adheres to standard spacing rules defined in `.editorconfig`.
- [ ] **Linting & Style:** Passed cleanly through local formatting scripts or project equivalents).
- [ ] **Clean History:** No auto-generated production files (`public/` or `resources/`) are tracked or included in this branch diff.
- [ ] **Zero Secrets:** No private environmental tokens, local API credentials, server keys, or email configurations are accidentally exposed.
- [ ] **No Conflict:** The branch has been rebased against the latest `main` tracking branch without conflicts.

---
*By submitting this Pull Request, you acknowledge that its inclusion is entirely at the discretion of the repository maintainer.*
