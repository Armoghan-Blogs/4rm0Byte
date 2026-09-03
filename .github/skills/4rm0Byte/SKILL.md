---
name: 4rm0byte
description: Setup, configure and manage this repository. setup-methord, updates, configuration files, folder-structure.
---

# 4rm0byte
4rm0Byte is a personal blog and portfolio website build using [Hugo static site generator](https://gohugo.io/) and [Blowfish theme]( https://github.com/nunocoracao/blowfish).

- Requires Hugo **extended** edition, within the version range declared in the `package.json` file under `engines`. (check that file — the range is a rolling window that tracks recent Hugo releases).
- Requires Node.js, within the version range declared in the `package.json` file under `engines`. (check that file — the range is a rolling window that tracks recent Hugo releases).
- Required npm package manager, within the version range declared in the `package.json` file under `engines`. (check that file — the range is a rolling window that tracks recent Hugo releases).
- Requires Go-lang, within the version range declared in the `go.mod` file under `go`. (check that file — the range is a rolling window that tracks recent Hugo releases).
- Required Blowfish theme, within the version range declared in the `config/_default/module.toml` file under `imports`. (check that file — the range is a rolling window that tracks recent Hugo releases).

## Theme Installing/Updating

1. **Theme Installation:**
  `hugo mod init github.com/<user>/<repo>` then in `config/_default/module.toml`:
  ```toml
    [[imports]]
    path = "github.com/nunocoracao/blowfish/v2"
  ```
2. **Theme Updating:**
  `hugo mod get -u` (inspects `module.toml` + `go.mod`)

## Configuration

All config lives in the site's `config/_default/` (reference: https://blowfish.page/docs/configuration/):

- `hugo.toml` — core Hugo settings, theme/module import, taxonomies, related-content config.
- `params.toml` — theme behavior. Key areas: `colorScheme`; `defaultAppearance`/`autoSwitchAppearance` (dark mode); `defaultBackgroundImage` + `backgroundCanvas` (site-wide fixed backdrop); `[header] layout` (`basic`, `fixed`, `fixed-fill`, `fixed-gradient`, `fixed-fill-blur`, `floating`) and `mobileMenuStyle` (`fullscreen`/`dropdown`); `[homepage] layout` (`page`, `profile`, `hero`, `card`, `background`, `landing`, `custom`) + `layoutSwitcher`; `[article]`, `[list]`, `[taxonomy]`, `[term]` display flags (hero styles, TOC, reading time/progress, breadcrumbs, `cardView`, `featureImageHover`, …); `[footer]`; search; analytics; comments; Firebase (views/likes); `[comments]`; enable/disable comments, comment provider, comment provider config; `[newsletter]`; enable/disable newsletter, newsletter provider, newsletter provider config; `[DecapCMS]`; enable/disable DecapCMS, DecapCMS provider, DecapCMS provider config;
- `languages.<code>.toml` — site title, author profile (name, image, headline, bio, `links` social icons). One file per language for multilingual sites.
- `menus.<code>.toml` — `[[main]]`, `[[subnavigation]]`, and `[[footer]]` entries (`name`, `pageRef`/`url`, `weight`, optional `pre` icon).
- `markup.toml` — Goldmark config; keep `unsafe = true` (the theme relies on HTML in Markdown).
- `module.toml` — Hugo module imports and versioning.

Front matter overrides most section params per page. Reference table: https://blowfish.page/docs/front-matter/

## Feature → docs map

Point users (and yourself) at the specific page:

- Getting started & colour schemes: https://blowfish.page/docs/getting-started/
- Homepage layouts (incl. `landing` hero with `heroCaption`/`heroLead`/`heroButtons`/`heroImage` front matter): https://blowfish.page/docs/homepage-layout/
- Front matter reference: https://blowfish.page/docs/front-matter/
- All 40+ shortcodes with examples: https://blowfish.page/docs/shortcodes/
- Content examples (article features in action): https://blowfish.page/docs/content-examples/
- Series of articles: https://blowfish.page/docs/series/
- Multi-author setup (`data/authors/*.json` + `authors` taxonomy): https://blowfish.page/docs/multi-author/
- Thumbnails & feature images: https://blowfish.page/docs/thumbnails/
- Partials (analytics, comments, extend-head/extend-footer hooks): https://blowfish.page/docs/partials/
- Advanced customisation (fonts, custom schemes, overrides, npm build): https://blowfish.page/docs/advanced-customisation/
- Firebase views/likes: https://blowfish.page/docs/firebase-views/
- Hosting & deployment (Netlify, Vercel, GitHub Pages, …): https://blowfish.page/docs/hosting-deployment/

## Architecture (how to find things)

Understanding the folder structure and where to find things is crucial for managing and customizing the site effectively. The main directories and their purposes are as follows:

- **archetypes/**: Contains archetype templates for new content types. When you create a new content file, Hugo uses these templates to pre-fill the front matter.
- **assets/**: Holds css/, img/, js/, lib/, widgets/** and jsconfig files. This is where you can add custom styles, scripts, and images that will be processed by Hugo's asset pipeline.
- **config/_default/**: Contains the site configuration files, including `hugo.toml`, `params.toml`, `languages.<code>.toml`, `menus.<code>.toml`, and `markup.toml`. These files define the site's settings, theme parameters, language configurations, menu structures, and markup options.
- **content/**: Holds admin/, authors/, cheatsheets/, contact/, disclimer/, posts/, privacy-policy/, report/, resources/, tools/, tutorials/, writeups/, _index.md, _offline.md, about.md files. This is where all the site's content is stored, organized into folders representing different sections of the site. Each folder can contain Markdown files and subfolders for further organization.
- **data/**: Holds certifications.yaml, githubColors.json, sharing.json, skills.yaml files. This directory is used to store structured data for the site. Some of the files in here are used for the portfolio sections, while others provide configuration data for various features of the site.
- **i18n:** every user-facing string goes through `i18n/<lang>.yaml` lookups (`{{ i18n "key" }}`) — never hardcode text in templates. English is the fallback.
- **layouts/**: Holds _default/, admin/, contat/, partials/, report/, shortcodes/, offline.html, rpbots.txt files. This directory contains the templates overriding the theme's default templates. You can customize the look and feel of your site by modifying these templates or adding new ones.
- **static/**: Holds editor-components/, favicons/, files/, img/, lib/, Desktop1.png, Desktop2.png, Mobile1.png, Mobile2.png, site.webmanifest, sw.js files. This directory is for static assets that are served directly to the browser. It includes images, JavaScript files, CSS files, and other resources that do not need to be processed by Hugo.
- **_vendor/**: Holds the Blowfish theme and any other third-party modules. This directory is managed by Hugo's module system and should not be modified directly. Instead, use the `hugo mod` commands to manage dependencies.
- **.github/**: Holds GitHub-specific files, including workflows, issue templates, and this SKILL.md file. This directory is used for GitHub Actions workflows, issue and pull request templates, and other GitHub-related configurations.
- **.vscode**: Holds Visual Studio Code workspace settings. This directory contains configuration files for the VS Code editor, allowing you to customize your development environment for working on this project.
- **public/**: This is the output directory where Hugo generates the final static site. It contains the HTML, CSS, JavaScript, and other assets that are ready to be deployed to a web server. This directory is typically not checked into version control, as it is generated from the source files in the other directories. (Note: The `public/` directory is usually included in `.gitignore` to avoid committing generated files and also no need to edit/modify anything in this folder, as it is generated on every build. Only use this folder for debugging/testing purposes.)
- **resources**: This directory is used by Hugo to store processed resources, such as images that have been resized or optimized. It is managed by Hugo and should not be modified directly. Like the `public/` directory, it is typically included in `.gitignore` to avoid committing generated files. (Note: The `resources/` directory is usually included in `.gitignore` to avoid committing generated files and also no need to edit/modify anything in this folder, as it is generated on every build. Only use this folder for debugging/testing purposes.)
- **.editorconfig**: Defines coding styles and formatting rules for the project. This file helps maintain consistent code style across different editors and IDEs.
- **.gitignore**: Specifies files and directories that should be ignored by Git. This file helps prevent committing unnecessary or sensitive files to the repository.
- **.hintrc**: Configuration file for the `hintrc` tool, which is used to enforce coding standards and best practices in the project.
- **.nvmrc**: Specifies the Node.js version to be used with the project. This file allows developers to easily switch to the correct Node.js version when working on the project.
- **.prettierrc**: Configuration file for Prettier, a code formatting tool. This file defines the formatting rules and options to be applied to the project's codebase.
- **.prettierignore**: Specifies files and directories that should be ignored by Prettier, a code formatting tool. This file helps prevent formatting changes to certain files or directories.
- **go.mod**: Defines the Go module for the project, including dependencies and versioning. This file is used by the Go toolchain to manage the project's dependencies.
- **go.sum**: Contains checksums for the Go module dependencies. This file is used to verify the integrity of the dependencies and ensure that they have not been tampered with.
- **netlify.toml**: Configuration file for Netlify, a platform for deploying static sites. This file defines build settings, redirects, and other configurations specific to Netlify.
- **package.json**: Defines the Node.js project, including dependencies, scripts, and versioning. This file is used by npm to manage the project's dependencies and scripts.

## Development Workflow

Understanding the development workflow is essential for effectively managing and contributing to the project. The following steps outline the typical workflow for developing and maintaining the site:

1. **Setup Development Environment:**
  - Install the required versions of Hugo, Node.js, npm, and Go as specified in the `package.json` and `go.mod` files.
  - Clone the repository to your local machine.
  - Navigate to the project directory and run `npm install` to install any necessary Node.js dependencies.
  - Run `hugo mod get` to fetch the required Hugo modules, including the Blowfish theme.
  - Run `npm run dev` to start the development server. This will build the site and serve it locally, allowing you to view changes in real-time.
  - Make changes to the content, configuration, or templates as needed. Use the development server to preview your changes.
2. **Testing and Validation:**
  - Test the site locally to ensure that all changes are working as expected.
  - Validate the site's HTML, CSS, and JavaScript to ensure that it meets web standards and accessibility guidelines.
  - Use tools like `hugo server` to check for any build errors or warnings.
3. **Version Control:**
  - Use Git for version control. Commit your changes with clear and descriptive messages.
  - Push your changes to the remote repository on GitHub.

## Troubleshooting

If you encounter any issues during the development process, refer to the following common troubleshooting steps:

- **Check Dependencies:** Ensure that you have the correct versions of Hugo, Node.js, npm, and Go installed. Use `hugo version`, `node -v`, `npm -v`, and `go version` to verify.
- **Clear Cache:** If you experience unexpected behavior, try clearing the Hugo cache by running `hugo mod clean` and then `hugo mod get` to refresh the modules.
- **Review Configuration Files:** Double-check the configuration files in `config/_default/` for any syntax errors or misconfigurations.
- **Consult Documentation:** Refer to the Hugo and Blowfish theme documentation for guidance on specific features or configurations.
