---
applyTo: "**"
---

# Project General Coding Standards & AI Guidance

## Project Overview
- Name: 4rm0Byte
- Description: My Personal Blogging Website build using Hugo , Blowfish theme and Decap CMS.
- Hugo + Decap blog
- Theme: [Blowfish](https://github.com/nunocoracao/blowfish)
- Local dev: `npm run dev`
- Production: `npm run prod`
- Build: `npm run build`
- Local URL: `http://localhost:1313`
- CMS Admin: `http://localhost:1313/admin`
- CMS API: `http://localhost:8081/api/v1`
- GitHub: [4rm0Byte Repository](https://github.com/Armoghan-Blogs/4rm0Byte)

---

## Goals
- Build a fast, secure, and maintainable website from scratch.
- Implement best practices for web development (HTML5, CSS3, JavaScript, accessibility).
- SEO optimization (meta tags, structured data, sitemap, robots.txt).
- Ensure accessibility for all users (WCAG compliance).
- Responsive design for all devices (mobile-first approach).
- Use Hugo modules and Decap CMS effectively for content management.
- Keep the site modular to allow future feature additions.

---

## AI / Assistant Instructions
- Only modify files in `content`, `layouts`, `config`, `data`, `assets`, `static` and Hugo site structure if necessary to improve the project.
- Suggest categorized improvements for:
  - **Hugo / Go modules**
  - **Markdown / Frontmatter**
  - **CSS / Tailwind / Blowfish theme customizations**
  - **JS / Node scripts**
- Provide guidance without breaking existing npm scripts.
- Prefer official documentation or project references first (Hugo Docs, Decap Docs, Blowfish Docs).
- Suggest project file structure improvements if needed.
- Recommend helpful VS Code extensions, tasks, snippets, or launch configurations as the project grows.
- Suggest automation for repetitive tasks (build, deploy, dev server, lint, formatting).
- Suggest **tasks, snippets, extensions, and launch configs**.

---

## Recommended Initial Folder / File Structure
- `/content/` → Markdown posts, pages
- `/layouts/` → Hugo templates & partials
- `/assets/` → CSS, JS, images
- `/static/` → Static files (favicon, fonts, etc.)
- `/themes/blowfish/` → Blowfish theme, customize via `/layouts/partials/`
- `.vscode/` → Workspace settings, launch, tasks, extensions
- `config.toml` / `config.yaml` → Site configuration
- `package.json` → Node scripts & dependencies
- `go.mod` / `go.sum` → Hugo module dependencies

---

## Recommended Workflow
1. **Start project locally:**
  - `npm run dev` → Hugo dev server
  - `npm run decap-dev` → CMS admin interface
  - Open `http://localhost:1313` for live preview
2. **Build site:**
  - `npm run build` → Production-ready site
3. **Add new content:**
  - Markdown files in `/content/`
  - Update frontmatter (title, date, tags, draft)
4. **Customizations:**
  - Extend Blowfish theme with `/layouts/partials/` or `/assets/`
  - Tailwind / CSS tweaks in `/assets/css/`
5. **Version control:**
  - Commit changes to GitHub
  - Push to remote for backup & CI/CD

---

## CI/CD & Deployment
- Automate build and deployment using GitHub Actions (or preferred CI/CD).
- Run `npm run build` before deploying to production.
- Include tests or validation for broken links, SEO metadata, and accessibility.
- Optionally, deploy to Netlify, Vercel, or a VPS.

---

## Best Practices
- Use `.vscode/tasks.json` for repeatable build/dev tasks.
- Keep `.vscode/settings.json` synced with team.
- Use snippets for Hugo shortcodes & Markdown formatting (`snippets.code-snippets`).
- Spellcheck Markdown posts using Code Spell Checker extension.
- Organize assets, layouts, and templates modularly for easy maintenance.
- Document major theme modifications to Blowfish in `/docs/` or `/README.md`.

---

## Versioning & Dependencies
- Pin Hugo, Node, npm versions using `.nvmrc` and `.hugo-version` files.
- Use `go.mod` for Hugo module dependencies.
- Keep `package.json` dependencies up-to-date but avoid breaking changes.
- Document version updates in `CHANGELOG.md`.

---

## Design System & Styling Guidelines
- Use consistent **Tailwind utility classes**.
- Follow **Blowfish theme conventions** for typography, spacing, and color.
- Follow **Decap CMS conventions** for content structure and frontmatter.
- Keep reusable components in `/layouts/partials/`.

---

## Analytics & Monitoring
- Integrate analytics (Google Analytics, Plausible, etc.).
- Monitor site performance (Lighthouse, WebPageTest).
- Log build/deploy errors.
- Optionally, use Netlify for deployments.

---

## Tasks & Snippets Reference Table

| Category                     | Name / Command                                      | Description |
|-------------------------------|----------------------------------------------------|-------------|
| **NPM Scripts**               | `npm run dev`                                      | Start Hugo dev server (build drafts, future, expired content, with watch & logging) |
|                               | `npm run prod`                                     | Start Hugo server for production environment |
|                               | `npm run build`                                    | Build the site for production, minify assets, clean destination directory |
|                               | `npm start`                                       | Run Hugo dev + Decap CMS dev concurrently |
|                               | `npm run decap-dev`                                | Start Decap CMS dev server locally |
|                               | `npm install`                                     | Install Node dependencies |
|                               | `npm run update`                                   | Update Node dependencies |
|                               | `npm run depcheck`                                 | Check for unused dependencies |
|                               | `npm run clean-logs`                               | Delete Hugo build lock & all `.log` files |
|                               | `npm run assets`                                   | Rebuild assets by cleaning `/assets/lib` and copying vendor files |
|                               | `npm run hbuild`                                   | Build Hugo site to custom directory (`../Armoghan-Blogs-Public`) |

| **VS Code Tasks**             | Label                                              | Description |
|-------------------------------|----------------------------------------------------|-------------|
| `Start Hugo and Decap CMS Dev Server` | Runs `npm start` for both Hugo and Decap CMS concurrently |
| `Hugo Dev Server`             | Runs `npm run dev`                                 | Start Hugo in development mode |
| `Hugo Production Server`      | Runs `npm run prod`                                | Start Hugo in production mode |
| `Decap CMS Dev Server`        | Runs `npm run decap-dev`                            | Start CMS admin interface locally |
| `Build`                       | Runs `npm run build`                                | Build production site |
| `Install`                     | Runs `npm install`                                  | Install Node dependencies |

> **Notes:**
> - Add new scripts or tasks here as project grows.
> - AI can use this table to suggest tasks, generate snippets, or run dev/build commands automatically.
> - Keep table updated to reflect **any custom scripts, snippets, or VS Code tasks** added later.

---

# Tasks & Automation Reference

This table summarizes **all available npm scripts, VS Code tasks, and Hugo/Markdown/Tailwind snippets** for automation, builds, and content creation. AI can use this as a **reference for any suggestions, automation, or code generation**.

---

## 1. NPM Scripts

| Script Name                     | Command / Trigger                                     | Description |
|---------------------------------|-----------------------------------------------------|-------------|
| `dev`                           | `hugo server --buildDrafts --buildFuture --buildExpired --gc --logLevel info --watch` | Start Hugo dev server with drafts, future & expired posts, and live watch |
| `prod`                          | `hugo server --buildDrafts --buildFuture --buildExpired --gc --logLevel info --watch -e production` | Start Hugo server in production environment |
| `start`                         | `concurrently "npm run dev" "npm run decap-dev"`    | Run Hugo dev + Decap CMS dev concurrently |
| `decap-dev`                     | `npx decap-server`                                  | Start Decap CMS development server |
| `build`                         | `hugo --gc --logLevel info --cleanDestinationDir --minify` | Build production-ready Hugo site |
| `install`                       | `npm install`                                       | Install all Node dependencies |
| `update`                        | `npm update`                                       | Update Node dependencies |
| `depcheck`                       | `depcheck`                                         | Check for unused dependencies |
| `clean-logs`                     | `rimraf hugo.build.lock && find . -name '*.log' -type f -delete` | Delete Hugo build lock and all log files |
| `hbuild`                        | `hugo -d ../Armoghan-Blogs-Public`                | Build Hugo site to custom output directory |

---

## 2. VS Code Tasks

| Task Label                                 | Runs Script / Command                                  | Description |
|--------------------------------------------|------------------------------------------------------|-------------|
| `Start Hugo and Decap CMS Dev Server`      | `npm start`                                         | Start both Hugo and Decap CMS development servers concurrently |
| `Hugo Dev Server`                           | `npm run dev`                                       | Start Hugo dev server |
| `Hugo Production Server`                    | `npm run prod`                                      | Start Hugo server in production mode |
| `Decap CMS Dev Server`                       | `npm run decap-dev`                                 | Start Decap CMS dev server |
| `Build`                                     | `npm run build`                                     | Build production-ready Hugo site |
| `Install`                                   | `npm install`                                       | Install Node dependencies |

---

## Notes for AI / Automation
- AI can **call any npm script or VS Code task** as part of development or build automation.
- AI can **suggest creating new snippets** or templates based on Hugo, Markdown, Tailwind, or HTML.
- When suggesting automation:
  - Use `tasks.json` for repeatable commands.
  - Use snippets for Markdown, Hugo shortcodes, and Tailwind utility classes.
  - Avoid breaking existing scripts.
- Keep table updated whenever new scripts, tasks, or snippets are added to the project.

---

## Usage Example for AI
- Suggest running: `npm run dev` → start Hugo dev server
- Suggest generating a new post snippet: `hugoFrontmatter` + `mdHeader`
- Suggest creating Tailwind layout snippet: `twGrid` or `twFlex`
- Suggest deploying build using: `npm run build`

---

## References
- Hugo Docs: [https://gohugo.io/documentation/](https://gohugo.io/documentation/)
- Decap CMS Docs: [https://decapcms.org/docs/](https://decapcms.org/docs/)
- Blowfish Docs: [https://blowfish.page/docs/](https://blowfish.page/docs/)
- Markdown Guide: [https://www.markdownguide.org/](https://www.markdownguide.org/)
- Tailwind CSS Docs: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- SEO & Accessibility: [https://developer.mozilla.org/en-US/docs/Learn/Accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility)

---

## Notes for AI / Contributors
- Assume this project is **just starting**, all content, templates, and workflows will be created from scratch.
- Always reference official documentation first.
- Suggest modular, scalable solutions suitable for long-term maintenance.
- Prioritize **correct structure, automation, and performance**.
- Include relevant **code snippets, configurations, or tasks** for immediate use.

---
