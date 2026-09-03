---
name: shortcodes-reference
description: Reference for all Blowfish theme shortcodes (Hugo). Consult before writing or editing articles, guides, cheatsheets, tools, or resources so formatting uses the theme's built-in components instead of raw HTML or invented syntax.
---

# Blowfish Shortcode Reference

Source: https://blowfish.page/docs/shortcodes/ — consult the live page if a shortcode's behavior seems to have changed since this was written.

In addition to Hugo's default shortcodes, Blowfish ships the extras below. Use `{{< shortcode >}}` syntax for shortcodes whose content is plain text/HTML, and `{{% shortcode %}}` when nested Markdown must render inside.

## Quick index

Accordion · Admonition · Alert · Ansible Galaxy Card · Article · Badge · Button · Carousel · Chart · Code Importer · Codeberg Card · CTA button · Email · Feature grid · Figure · Forgejo Card · Gallery · Gist · Gitea Card · GitHub Card · GitLab Card · Hugging Face Card · Icon · KaTeX · Keyword · Lead · List · LTR/RTL · Markdown Importer · Mermaid · Stats · Steps · Swatches · Tabs · Timeline · TypeIt · Video · Youtube Lite

---

## Accordion

Collapsible panel group. Wrap `accordionItem` blocks inside `accordion`.

`accordion` params: `mode` (`collapse` = only one open at a time, default; or `open` = multiple can be open), `separated` (true/false, show each item as its own card, default false).

`accordionItem` params: `title` (required), `open` (bool, default open), `header` (alias for title), `icon`, `align` (`left`/`center`/`right`).

```md
{{< accordion mode="open" separated=true >}}
  {{< accordionItem title="Markdown example" icon="code" open=true >}}
  Supports **bold**, lists, `inline code`.
  {{< /accordionItem >}}

  {{< accordionItem title="Shortcode example" md=false >}}
  {{< alert >}}This is an inline alert.{{< /alert >}}
  {{< /accordionItem >}}
{{< /accordion >}}
```

## Admonition

GitHub/Obsidian-style callout using Markdown blockquote syntax (not a `{{< >}}` shortcode) — more portable across platforms.

```md
> [!TIP]
> A tip callout.

> [!TIP]+ Custom Title
> A collapsible callout with a custom title.
{icon="twitter"}
```

Optional `+`/`-` after the type toggles collapsible/folded state (Obsidian-only support for the sign). Valid types (case-insensitive): GitHub — `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`; Obsidian — `note`, `abstract`, `info`, `todo`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example`, `quote`.

## Alert

Stylized callout box for content you don't want the reader to miss. Markdown-formatted content inside.

Params: `icon` (default `triangle-exclamation`), `iconColor`, `cardColor`, `textColor` (hex or CSS color name; theme picks sane defaults).

```md
{{< alert >}}**Warning!** This action is destructive!{{< /alert >}}

{{< alert "twitter" >}}Follow along on Twitter.{{< /alert >}}

{{< alert icon="fire" cardColor="#e63946" iconColor="#1d3557" textColor="#f1faee" >}}
This is an error!
{{< /alert >}}
```

## Ansible Galaxy Card

Renders a live-fetched card for an Ansible Galaxy role or collection.

Params (set exactly one): `role` (`namespace.name`), `collection` (`namespace.name`).

```md
{{< ansible role="geerlingguy.docker" >}}
{{< ansible collection="community.general" >}}
```

Fetched at build time via Hugo's remote-resource fetch — rebuild the site to refresh stats.

## Article

Embeds another article's card/preview into the current page. Won't render if it references its own parent page.

Params: `link` (required — the target's `.RelPermalink`; include a subpath prefix if the site is served from a subfolder), `showSummary` (bool, falls back to site default), `compactSummary` (bool, default false).

```md
{{< article link="/docs/welcome/" showSummary=true compactSummary=true >}}
```

## Badge

Small styled badge for metadata/labels.

```md
{{< badge >}}New article!{{< /badge >}}
```

## Button

Styled button for a primary call to action.

Params: `pageRef` (internal page reference, resolves language/trailing-slash-aware URL — takes precedence over `href`), `href`, `target`, `rel`.

```md
{{< button href="#button" target="_self" >}}Call to action{{< /button >}}
{{< button pageRef="docs/getting-started" >}}Get started{{< /button >}}
```

## Carousel

Interactive image slider; images render full-width at a chosen aspect ratio.

Params: `images` (required — regex/glob matching image names or URLs), `captions` (optional list of `key:caption` pairs; key = filename for local images or full URL for remote — supports Markdown), `aspectRatio` (default `16-9`), `interval` (autoscroll ms, default `2000`).

```md
{{< carousel images="gallery/*" aspectRatio="21-9" interval="2500" >}}

{{< carousel images="gallery/*" captions="{01.jpg:First image with *formatting*,02.jpg:Second with a [link](https://example.com)}" >}}
```

## Chart

Embeds a Chart.js chart from structured config data placed inside the shortcode. Supports any Chart.js chart type — see the official Chart.js docs for the config schema.

```md
{{< chart >}}
type: 'bar',
data: {
  labels: ['Tomato', 'Blueberry', 'Banana', 'Lime', 'Orange'],
  datasets: [{ label: '# of votes', data: [12, 19, 3, 5, 3] }]
}
{{< /chart >}}
```

## Code Importer

Pulls in code from an external URL at build time instead of copy-pasting it.

Params: `url` (required), `type` (syntax-highlighting language), `startLine` / `endLine` (optional line range).

```md
{{< codeimporter url="https://raw.githubusercontent.com/.../file.go" type="go" >}}
{{< codeimporter url="https://raw.githubusercontent.com/.../hugo.toml" type="toml" startLine="11" endLine="18" >}}
```

## Codeberg Card

Live-fetched repo card via the Codeberg API (stars/forks).

Params: `repo` (`username/repo`).

```md
{{< codeberg repo="forgejo/forgejo" >}}
```

## CTA button

Accessible call-to-action button for docs/landing pages.

Params: `url` (default `#`), `label` (default `Learn more`), `style` (`primary` default, or `outline`).

```md
{{< cta url="/docs/installation/" label="Start building" >}}
{{< cta url="/docs/configuration/" label="Explore configuration" style="outline" >}}
```

## Email

Obfuscated `mailto:` link to deter scrapers.

```md
{{< email email="mailto:hello@test.com" text="text" subject="Reply to awesome article" >}}
```

## Feature grid

Responsive grid of feature callouts. `feature-grid` is the container; add one `feature` per item.

`feature-grid` params: `columns` (`3` default or `4`).
`feature` params: `icon` (default `wand-magic-sparkles`), `title` (Markdown supported), `url` (optional link), `label` (default `Learn more`).

```md
{{< feature-grid columns="3" >}}
{{< feature icon="wand-magic-sparkles" title="Make it yours" url="/docs/configuration/" >}}
Start from a thoughtful default, then adjust every detail.
{{< /feature >}}
{{< feature icon="heart" title="Built for people" >}}
Accessible defaults, responsive layouts, dark mode included.
{{< /feature >}}
{{< /feature-grid >}}
```

## Figure

Blowfish's enhanced image shortcode — replaces default Hugo `figure` with Hugo Pipes optimization/responsive scaling for page-bundle resources. External URLs/static assets are passed through unprocessed.

Params: `src` (required — lookup order: page resource → `assets/` → `static/`), `alt`, `caption` (Markdown), `class`, `figureClass` (classes on the `<figure>` wrapper, handy for galleries), `href` (link target for the image), `target`, `nozoom` (disable zoom-on-click, useful with `href`), `default` (`true` reverts to stock Hugo figure syntax).

Standard Markdown image syntax `![alt](src "caption")` is auto-converted to use this shortcode.

```md
{{< figure
    src="abstract.jpg"
    alt="Abstract purple artwork"
    caption="Photo by [Jr Korpa](https://unsplash.com/@jrkorpa)"
>}}
```

## Forgejo Card

Live-fetched repo card for a Forgejo instance.

Params: `repo` (`username/repo`), `server` (instance URL).

```md
{{< forgejo server="https://v11.next.forgejo.org" repo="a/mastodon" >}}
```

## Gallery

Responsive multi-image layout with varied column widths, built from plain `<img>` tags.

Set width per image via `class="grid-wXX"` (10–100% in 5% steps, plus 33%/66% for thirds). Tailwind responsive prefixes work too (e.g. `md:grid-w33`). For captions, use `figure` shortcodes inside the gallery instead of raw `<img>` tags, setting the width via `figureClass` and text via `caption`.

```md
{{< gallery >}}
  <img src="gallery/01.jpg" class="grid-w33" />
  <img src="gallery/02.jpg" class="grid-w33" />
  <img src="gallery/03.jpg" class="grid-w33" />
{{< /gallery >}}

{{< gallery >}}
  {{< figure src="gallery/01.jpg" alt="Gallery image 1" caption="First caption" figureClass="grid-w33" >}}
{{< /gallery >}}
```

## Gist

Embeds a GitHub Gist.

Params (positional): `[0]` GitHub username, `[1]` Gist ID, `[2]` optional filename within the Gist.

```md
{{< gist "octocat" "6cad326836d38bd3a7ae" >}}
{{< gist "rauchg" "2052694" "README.md" >}}
```

## Gitea Card

Live-fetched repo card via a Gitea instance's API.

Params: `repo` (`username/repo`), `server` (instance URL).

```md
{{< gitea server="https://git.fsfe.org" repo="FSFE/fsfe-website" >}}
```

## GitHub Card

Live-fetched repo card (stars/forks) for a GitHub repo.

Params: `repo` (`username/repo`), `showThumbnail` (optional bool).

```md
{{< github repo="nunocoracao/blowfish" showThumbnail=true >}}
```

## GitLab Card

Live-fetched project card for GitLab (or a compatible self-hosted instance). Can't show primary language, unlike the GitHub card.

Params: `projectID` (numeric GitLab project ID), `baseURL` (optional, default `https://gitlab.com/` — any instance exposing `api/v4/projects/` works).

```md
{{< gitlab projectID="278964" >}}
```

## Hugging Face Card

Live-fetched card for a Hugging Face model or dataset (likes, downloads, description).

Params: `model` (`username/model`) OR `dataset` (`username/dataset`) — use only one.

```md
{{< huggingface model="google-bert/bert-base-uncased" >}}
{{< huggingface dataset="stanfordnlp/imdb" >}}
```

## Icon

Renders an inline SVG icon scaled to the surrounding text size.

```md
{{< icon "github" >}}
```

Built-in icon names cover social/links/misc use cases — check the theme's icon samples page for the full list. Custom icons: drop an SVG into `assets/icons/` and reference it by filename (without `.svg`). Icons are also available in partials via the icon partial.

## Icons (project custom shortcode)

This repo also includes a local custom shortcode at `layouts/shortcodes/icons.html` for rendering library-specific icons directly inside content. This is not a core Blowfish shortcode, but it is supported for this project.

Use either of these valid forms:

```md
{{< icons "github" "bootstrap" >}}
{{< icons name="github" library="bootstrap" >}}
```

Supported libraries are: `bootstrap`, `fontawesome`, `heroicons`, and `feather`.

Important: do not mix positional and named arguments in the same shortcode call. For example, `{{< icons "github" library="bootstrap" >}}` is invalid in Hugo. Prefer one style consistently for the page.

## KaTeX

Renders math notation via KaTeX. Include the shortcode once per page; it applies to all math on that page. Inline math uses `\( ... \)`, block math uses `$$ ... $$`.

```md
{{< katex >}}
\(f(a,b,c) = (a^2+b^2+c^2)^3\)
```

See KaTeX's supported-functions reference for syntax.

## Keyword

Highlights an important word/phrase; `keywordList` groups several `keyword` items together.

Params (on `keyword`): `icon` (optional).

```md
{{< keyword >}} *Super* skill {{< /keyword >}}

{{< keywordList >}}
{{< keyword icon="github" >}} Lorem ipsum dolor. {{< /keyword >}}
{{< keyword icon="code" >}} **Important** skill {{< /keyword >}}
{{< /keywordList >}}
```

## Lead

Emphasized intro paragraph, typically used to open an article.

```md
{{< lead >}}
When life gives you lemons, make lemonade.
{{< /lead >}}
```

## List

Displays a list of recent articles, optionally filtered. Never lists its own parent page (but that page still counts toward the limit).

Params: `limit` (required), `title` (default `Recent`), `cardView` (bool, default false), `where` (field to filter on, e.g. `Type`), `value` (value to match against `where`).

```md
{{< list limit=2 >}}
{{< list title="Samples" cardView=true limit=6 where="Type" value="sample" >}}
```

## LTR/RTL

`ltr` / `rtl` shortcodes let you mix text direction inside otherwise RTL or LTR content. Use `{{% %}}` delimiters (not `{{< >}}`) so nested Markdown renders normally.

```md
- This is a markdown list.
- Default LTR direction.
{{% rtl %}}
- هذه القائمة باللغة العربية
- من اليمين الى اليسار
{{% /rtl %}}
```

## Markdown Importer

Pulls in a Markdown file from an external URL at build time.

Params: `url` (required).

```md
{{< mdimporter url="https://raw.githubusercontent.com/user/repo/main/README.md" >}}
```

## Mermaid

Renders Mermaid diagrams (flowcharts, sequence diagrams, etc.) from text syntax inside the shortcode. See the official Mermaid docs for diagram syntax.

```md
{{< mermaid >}}
graph LR;
A[Lemons]-->B[Lemonade];
B-->C[Profit]
{{< /mermaid >}}
```

## Stats

Grid of highlighted metrics. `stats` is the container; each `stat` is one metric.

`stats` params: `columns` (`3` default, or `4`).
`stat` params: `value`, `label`.

```md
{{< stats >}}
{{< stat value="40+" label="Shortcodes" >}}Compose pages without bespoke templates.{{< /stat >}}
{{< stat value="100%" label="Portable" >}}Keep your content in Markdown.{{< /stat >}}
{{< /stats >}}
```

## Steps

Numbered step sequence for onboarding/tutorials/roadmaps. `steps` is the container; each `step` is one item.

`step` params: `number`, `title`.

```md
{{< steps >}}
{{< step number="1" title="Configure the theme" >}}Choose a colour scheme and homepage layout.{{< /step >}}
{{< step number="2" title="Write your content" >}}Use standard Markdown and shortcodes.{{< /step >}}
{{< /steps >}}
```

## Swatches

Shows up to three color swatches from hex codes — useful for showcasing a palette.

```md
{{< swatches "#64748b" "#3b82f6" "#06b6d4" >}}
```

## Tabs

Tabbed content, e.g. per-platform install instructions. `tabs` is the container; each `tab` is one pane.

`tabs` params: `group` (optional — tabs sharing a group name switch in sync across the page), `default` (label of the tab active by default).
`tab` params: `label` (required), `icon` (optional), `md` (bool, default true — set `false` if content is already HTML).

```md
{{< tabs >}}
  {{< tab label="Windows" >}}
  ```pwsh
  winget install -e --id Microsoft.VisualStudioCode
  ```
  {{< /tab >}}
  {{< tab label="macOS" >}}
  ```bash
  brew install --cask visual-studio-code
  ```
  {{< /tab >}}
{{< /tabs >}}
```

Nested shortcodes (e.g. an `accordion` inside a `tab`) are supported without double-rendering issues.

Synced tab groups:

```md
{{< tabs group="lang" default="Python" >}}
  {{< tab label="JavaScript" icon="code" >}}...{{< /tab >}}
  {{< tab label="Python" icon="sun" >}}...{{< /tab >}}
{{< /tabs >}}
```

## Timeline

Visual timeline (e.g. work history, project milestones). `timeline` is the container; `timelineItem` defines each entry.

`timelineItem` params: `md` (render content as Markdown, bool), `icon`, `header`, `badge` (top-right badge text), `subheader`.

```md
{{< timeline >}}
{{< timelineItem icon="github" header="header" badge="badge test" subheader="subheader" >}}
Entry content here — Markdown or nested shortcodes supported.
{{< /timelineItem >}}
{{< /timeline >}}
```

## TypeIt

Typewriter-effect text animation (via the TypeIt JS library), exposed as a shortcode subset.

Params: `tag` (HTML tag to render into), `classList` (CSS classes), `initialString`, `speed` (ms per step), `lifeLike` (bool, irregular typing pace), `startDelay` (ms), `breakLines` (bool — stack lines vs. delete/replace), `waitUntilVisible` (bool, default true — start only when scrolled into view), `loop` (bool).

```md
{{< typeit tag=h1 lifeLike=true >}}
Lorem ipsum dolor sit amet,
consectetur adipiscing elit.
{{< /typeit >}}
```

## Video

Embeds a local or external video with a responsive player and optional caption.

Params: `src` (required — local lookup: page resource → `assets/` → `static/`), `poster` (optional; falls back to a same-name image in the page bundle), `caption` (Markdown), `autoplay`, `loop`, `muted`, `controls` (default true), `playsinline` (default true), `preload` (`metadata` default / `none` / `auto`), `start`, `end` (seconds), `ratio` (`16/9` default, `4/3`, `1/1`, or custom `W/H`), `fit` (`contain` default / `cover` / `fill`).

```md
{{< video
    src="video.webm"
    poster="poster.jpg"
    caption="**Public domain demo**"
    loop=true
    muted=true
>}}
```

## Youtube Lite

Lightweight YouTube embed via `lite-youtube-embed`.

Params: `id` (required — video ID), `label`, `params` (YouTube player parameters, `&`-joined, e.g. `start=130&end=10&controls=0`).

```md
{{< youtubeLite id="SgXhGb-7QbU" label="Blowfish-tools demo" params="start=130" >}}
```
