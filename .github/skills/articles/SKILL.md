---
name: articles
description: Generate high-quality articles, guides, cheatsheets, tools, writeups, and resources for a Hugo + Blowfish + Decap CMS site, with correct front matter, shortcodes, and per-type voice and structure. Use whenever asked to write, draft, or edit a blog post, tutorial, cheatsheet, tool review, CTF/technical writeup, or curated resource for this site.
---

# Articles/Tutorials/Cheatsheets/Tools/Writeups

This skill produces content for a Hugo site running the Blowfish theme with Decap CMS. Content is well-researched, original, and optimized for SEO — but tone and structure differ by content type (see below); don't apply one generic "professional and authoritative" voice to everything.

## Front Matter

Blowfish adds many fields on top of Hugo's defaults. Check `references/frontmatter.md` for the complete, accurate field list, defaults, and descriptions before writing front matter for a new post — don't guess at field names or invent ones that sound plausible.

**Baseline front matter (all types):**

```yaml
title: "Post Title"
date: 2024-06-01
description: "1-2 sentence summary used in HTML meta, ~120-160 characters."
summary: "Markdown summary shown on list pages when showSummary is enabled."
featureimage: "cover.jpg"
tags:
  - relevant-tag
categories:
  - relevant-category
keywords:
  - actual search terms a reader would use
author: "Armoghan"
draft: false
```

Add on top of this only the fields you're intentionally overriding from site defaults — see `references/frontmatter.md` for what's available (hero style, series, authors, display toggles, etc).

**Resources always add:**

```yaml
externalUrl: "https://the-original-source.com"
```

No local content body is needed for resources beyond the one-paragraph description — `externalUrl` prevents a content page from being generated and points readers straight to the source.

## Types of Posts & Path Mapping

| Type | Path | What it is |
|---|---|---|
| Articles | `/content/posts` | Well-researched, informative pieces on a specific topic. |
| Guides | `/content/tutorials` | Step-by-step instructions for a task or skill. |
| Cheatsheets | `/content/cheatsheets` | Dense, scannable reference material. |
| Tools | `/content/tools` | Reviews/introductions to a tool, software, or app. |
| Writeups | `/content/writeups` | CTF writeups, research papers, technical deep-dives. |
| Resources | `/content/resources` | Curated links to external content — mostly external posts. |

## Post Type Selection

When creating a new post, choose the type that best matches the content's purpose and structure. Don't default to "article" for everything — each type has its own voice, length, and structure expectations (see below). If a post doesn't fit any of these types, consider whether it belongs on this site at all.

## Post Folder Structure

Each post type has its own folder under `/content/`, which helps organize the site's content and makes it easier to manage and maintain. Every new post will be created as below:

/content
  / post-type
    / New-Post
      index.md
      featured.[png,jpg,gif]

The `index.md` file contains the front matter and body content, while the featured image is stored alongside it. This structure allows Hugo to treat each post as a page bundle, enabling better image handling and optimization.

## Voice & Style by Type

Don't default to one tone for everything — match the type:

- **Articles**: Professional but conversational. Can have a point of view. Avoid academic stiffness.
- **Guides**: Direct, imperative ("Run this," "Set this value") — instructional, not narrative.
- **Cheatsheets**: Near-zero voice. Just information density. No intros, no "let's explore," minimal connective prose between entries.
- **Tools**: Opinionated. State what's good, what's mediocre, and who it's actually for — a tools post that's purely neutral description isn't useful to a reader deciding whether to use it.
- **Writeups**: First-person and narrative is fine and often better ("I tried X, it failed because Y, so I pivoted to Z"). Technical documentation-style writeups can be more neutral/procedural instead — match whichever the subject calls for.
- **Resources**: Minimal — one paragraph max per resource explaining what it is and why it's worth the click.

### Avoid AI-sounding tells

Regardless of type, avoid:
- Stock openers: "In today's digital landscape," "In the ever-evolving world of X," "Let's dive in"
- Throat-clearing: "It's important to note that," "It's worth mentioning"
- Inflated verbs: "unlock," "unleash," "elevate," "supercharge," "revolutionize"
- Reflexive triplets: "robust, scalable, and efficient" / "fast, easy, and reliable" — pick the one adjective that's actually true, not three that sound thorough
- A closing paragraph that just restates the intro in different words
- Overuse of em dashes as a tic rather than a deliberate choice
- Headings that are questions when a statement would be more direct ("What Is X?" repeated for every section)

## Length & Depth Targets

- **Articles**: ~1,200–2,000 words. Shorter if the topic is genuinely simple — don't pad to hit a number.
- **Guides**: No fixed word count — length follows step count and complexity, not a target.
- **Cheatsheets**: No prose minimum. Optimize for scan speed, not length.
- **Tools**: Long enough to cover features, usage, and a real verdict — usually 800–1,500 words.
- **Writeups**: As long as the walkthrough genuinely needs. A TL;DR/summary at the top is mandatory regardless of length so skimmers get value immediately.
- **Resources**: A few sentences per entry. This type has no minimum — it's a pointer, not an essay.

## Content Structure by Type

- **Articles**: Hook → context/background → main sections (H2 per subtopic) → practical takeaway or conclusion. Use `lead` for the opening hook.
- **Guides**: Prerequisites/what you'll need → steps (`steps` shortcode for short sequences, plain H2s when each step needs substantial explanation) → verification/troubleshooting → next steps.
- **Cheatsheets**: Group by category with H2s. Use tables or `accordion` for dense reference info. One line per item where possible.
- **Tools**: What it is/does → key features → how to use/install it → pros/cons or when to reach for it vs. alternatives → verdict. `feature-grid` or comparison tables work well here.
- **Writeups**: Summary/TL;DR up top (`lead`) → chronological walkthrough. For CTF: recon → approach → exploitation → lessons learned. For technical writeups: problem → investigation → root cause → fix.
- **Resources**: Title, one-paragraph description of what it is and why it's worth linking, `externalUrl` set. No full body content needed.

## Important Notes

- Don't use a generic "professional and authoritative" voice for everything — match the type (see above).
- Don't pad content to hit a word count — if the topic is simple, keep it simple. If it needs depth, provide it. Don't add filler just to reach a number.
- Always add references links from wikepedia or other authoritative sources when making factual claims, especially in articles and writeups. This improves credibility and helps readers verify information.
- Always add internal links to other relevant content on the site when it genuinely helps the reader. Don't force a link just to check a box — if nothing relevant exists yet, leave it out.
- Keep the tone consistent with the type of content being written.
- Avoid AI-sounding tells (see above) — they make content feel generic and untrustworthy.
- Always add links from wikepedia to technical terms or concepts that may not be familiar to all readers. This helps provide context and improves the educational value of the content.
- Ensure that all content is accurate and up-to-date.

## Images & Assets

- Prefer Hugo page bundles: `content/posts/my-post/index.md` with the feature image alongside it (e.g. `cover.jpg` in the same folder) referenced as `featureimage: "cover.jpg"`. This lets Blowfish's `figure` shortcode apply Hugo Pipes optimization and responsive scaling automatically.
- If instead pulling from a flat `/static/images/...` path or an external URL, that's fine too, but it bypasses Hugo's image processing — use page-bundle images by default unless there's a reason not to.
- Always set descriptive alt text — via `figure`'s `alt` param or Markdown alt text — that describes the image content, not just repeats the caption.
- Feature image aspect ratio should suit `heroStyle` (see `references/frontmatter.md`): `big` and `background` styles want wider/taller images than `basic`.

## Internal Linking

- Before writing, check existing content under the relevant `/content/` path for related posts worth linking — don't rely on memory of what "should" exist.
- Use the `article` shortcode (renders a full preview card) for a strong, prominent related-content callout; use a plain Markdown link for a lighter inline reference.
- Aim for at least one genuine internal link per 800–1,000 words of body content — but never force one that doesn't actually serve the reader. A missing link is better than an irrelevant one.

## Code Blocks

- Always tag the language for syntax highlighting (` ```python `, ` ```bash `, etc.) — never leave a code fence untagged.
- For code sourced from an actual repo (not written fresh for the post), prefer the `codeimporter` shortcode over pasting a stale copy, so it stays in sync with the source.
- Break up long code dumps with explanatory prose between logical sections rather than posting one giant unbroken block — especially in guides and writeups, where the reader needs to follow *why*, not just copy-paste.

## Shortcodes

Check `references/shortcodes.md` for the full list of available Blowfish shortcodes and their syntax before writing content that needs a callout, embed, tabs, gallery, diagram, etc. Use these instead of raw HTML or invented formatting.

## Icons

Blowfish ships a built-in FontAwesome-based icon set, usable via `{{< icon "name" >}}` or as the `icon` parameter on shortcodes like `alert`, `accordionItem`, `timelineItem`, `feature`, and `tab`. Check `references/icons.md` for the full list of valid names, grouped by use case. Never invent an icon name — if nothing fits, skip the icon.

This project also includes a custom local shortcode called `icons`, defined in `layouts/shortcodes/icons.html`. It is intended for cases where you want to explicitly load a library-specific icon set and render a class-based icon directly in content. Use it only when you intentionally want a library-specified icon, and prefer the built-in Blowfish `icon` shortcode when the standard icon names already cover the need.

Valid usage:

```md
{{< icons "github" "bootstrap" >}}
{{< icons name="github" library="bootstrap" >}}
```

Supported libraries: `bootstrap`, `fontawesome`, `heroicons`, and `feather`. Do not mix positional and named arguments in the same call. If a library name is missing or unsupported, the shortcode should fail loudly instead of silently rendering a broken icon.

## Diagrams & Math

- Use **Mermaid** (`{{< mermaid >}}...{{< /mermaid >}}`) for flowcharts, sequence diagrams, class/state diagrams. Match the diagram type to the content: sequence diagrams for API/protocol writeups, flowcharts for decision logic in guides, class diagrams for architecture articles.
- Use **KaTeX** (`{{< katex >}}` once per page, then `\( ... \)` inline or `$$ ... $$` block) for mathematical notation — relevant mainly for writeups/articles with technical/academic content.

## SEO Checklist

Before finalizing any article, guide, cheatsheet, tool, or writeup, verify:

- `description` is set and reads naturally as a summary (~120–160 characters)
- `keywords` reflects actual search terms a reader would use, not generic restatements of the title
- `tags` and `categories` match existing site taxonomy — don't invent a new tag when an existing one already covers the topic
- The `title` and first H2 aren't identical — the H2 should add information, not repeat the title
- Headings form a logical hierarchy: one H1 (via `title`), H2s for major sections, H3s nested under the right H2, no skipped levels
- Every image has real alt text
- At least one genuine internal link is present where relevant (see Internal Linking above)

## Draft & Review Workflow

1. Write the full draft first, front matter included.
2. Re-read it against the **SEO Checklist** and the relevant **Content Structure** entry above.
3. Flag anything that couldn't be satisfied naturally (e.g., "no good internal link exists for this yet") rather than forcing a bad link or a padded section just to check a box.
4. Do a final pass for the AI-sounding tells listed under Voice & Style before presenting the draft.

## Final Takeaway

The best content is clear, useful, and worth returning to. A strong Hugo + Blowfish + Decap CMS workflow supports that by keeping content structured, scalable, and easy to maintain. After following the above guidance, you should be able to produce high-quality articles, guides, cheatsheets, tools, writeups, and resources that meet the site's standards and serve the reader effectively.

## Reporting

After writing the posts you will always report the following to the user:

1. Title of the post in H1.
2. Path to the post (e.g., `/content/posts/my-post/index.md`)
3. Word count of the post.
4. Number of images in the post.
5. Number of internal links in the post.
6. Number of external links in the post.
7. Reading time of the post (in minutes).
8. SEO checklist status (pass/fail) with notes on any failed items.
9. Any other relevant notes or recommendations for improvement.
10. A summary of the post's content and purpose, highlighting its value to the reader.

## Content Review

When reviewing content, check for:
- Clarity and coherence of the message
- Grammar and spelling errors
- Consistency in style and tone
- Proper use of technical terms
- Adequate coverage of the topic
- Effectiveness of the content in achieving its purpose
