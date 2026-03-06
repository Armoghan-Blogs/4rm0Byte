# Contributing to 4rm0Byte 🚀

Thank you for your interest in contributing to **4rm0Byte** contributions are welcome! This document outlines how to report issues, propose features, and submit changes so maintainers can review and merge them efficiently.

## Quick links

- Local setup: `fnm` + Node, Go modules, Hugo modules
- Issue reporting: open an issue with reproduction steps
- Pull requests: fork → branch → PR to `main`

---

## Quick start (local)

1. Install and use Node via `fnm`:

```bash
fnm install 22.22.1
fnm use 22.22.1
```

2. Install JS dependencies:

```bash
npm install
# or
pnpm install
```

3. Prepare Go modules and Hugo modules:

```bash
go mod tidy
hugo mod get -u
```

4. Run the dev server:

```bash
hugo server -D
# or
npm run dev
```

If you encounter module cache issues:

```bash
go clean -modcache
hugo mod clean
hugo mod get -u
```

---

## Reporting issues

When opening an issue, include:

- A short, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Hugo/Go/Node versions)
- Logs, error messages, or screenshots

Use labels like `bug`, `enhancement`, or `question` when appropriate.

---

## Suggesting features

- Open an issue describing the feature, rationale, and any alternatives.
- For larger changes, sketch a short design or provide a minimal prototype.

---

## Pull request process

Recommended workflow:

1. Fork the repo and create a branch (`feat/x`, `fix/x`, `docs/x`).
2. Keep changes small and focused; prefer multiple small PRs over one large PR.
3. Run tests and linters locally before pushing.
4. Create a PR against `main` with a clear description and checklist.

PR description checklist:

- What and why: short summary of the change and motivation.
- Related issue number (if any).
- How to test the change locally.
- Screenshots for UI changes.

Maintainers may request changes, rebase, or squash commits before merging.

---

## Commit messages

Use clear, conventional commit messages. Examples:

- `feat: add fnm setup instructions`
- `fix: resolve hugo module import`
- `docs: update contributing guide`

---

## License for contributions

By submitting a pull request, you agree that your contributions will be licensed under the project MIT license (see the `LICENSE` file).

---

## Code of Conduct

Please follow a respectful and constructive tone. Add a `CODE_OF_CONDUCT.md` file to the repo if you'd like to formalize rules maintainers will enforce it where necessary. To report abusive behavior, contact the repository owner or GitHub support.

---

## Maintainers

Maintainers review PRs and issues. Major changes may be discussed before acceptance. If you'd like to help maintain, open an issue expressing interest.

---

## Thank you

Thanks for helping make **4rm0Byte** better. If you want, I can also add PR/Issue templates and a starter GitHub Actions workflow tell me which you'd like and I will add them.
