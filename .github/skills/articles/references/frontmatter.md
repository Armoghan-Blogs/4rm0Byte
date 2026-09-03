---
name: frontmatter-reference
description: Complete list of Blowfish theme front matter parameters, their defaults, and what each controls. Consult when setting up front matter for a new article, guide, cheatsheet, tool, writeup, or resource, or when unsure whether a field exists or what it defaults to.
---

# Blowfish Front Matter Reference

Source: https://blowfish.page/docs/front-matter/ — Blowfish adds these on top of Hugo's own front matter fields. Any field left out of an article's front matter falls back to the site's base config, so only set a field when you want to override that default.

## Front matter fields

- *title*: The title of the article.
- *date*: The date the article was created or published.
- *summary*: A brief summary of the article.
- *description*: A more detailed description of the article.
- *featureimage*: The path/url of the feature image for the article.
- *showSummary*: Whether to show the summary of the article (true/false).
- *showTableOfContents*: Whether to show the table of contents (true/false).
- *showWordCount*: Whether to show the word count of the article (true/false).
- *showComments*: Whether to show comments section for the article (true/false).
- *showNewsletter*: Whether to show newsletter subscription option (true/false).
- *showDate*: Whether to show the date of the article (true/false).
- *showDateUpdated*: Whether to show the date the article was last updated (true/false).
- *showHeadingAnchors*: Whether to show heading anchors for the article (true/false).
- *showPagination*: Whether to show pagination for the article (true/false).
- *showReadingTime*: Whether to show the estimated reading time for the article (true/false).
- *showTaxonomies*: Whether to show taxonomies (tags, categories, series, keywords) for the article (true/false).
- *showViews*: Whether to show the number of views for the article (true/false).
- *showLikes*: Whether to show the number of likes for the article (true/false).
- *showBreadcrumbs*: Whether to show breadcrumbs for the article (true/false).
- *showEdit*: Whether to show the edit option for the article (true/false).
- *showRelatedContent*: Whether to show related content for the article (true/false).
- *showDateOnlyInArticle*: Whether to show the date only in the article (true/false).
- *replyByEmail*: Whether to allow replies by email for the article (true/false).
- *tags*: A list of tags associated with the article.
- *categories*: A list of categories associated with the article.
- *keywords*: A list of keywords associated with the article for SEO purposes.
- *series*: A list of series associated with the article.
- *series_order*: The order of the article in the series (if applicable).
- *author*: The author of the article.
- *showAuthorBottom*: Whether to show the author information at the bottom of the article (true/false).
- *draft*: Whether the article is a draft (true/false).
- *showZenMode*: Whether to show the Zen mode for the article (true/false).
- *externalUrl*: The external URL for the article (For external posts only).

## Content & metadata

| Field | Default | What it does |
|---|---|---|
| `title` | — | The article's name. |
| `description` | — | Text description used in HTML metadata (SEO). |
| `summary` | Auto-generated from `summaryLength` | Markdown summary text shown when `showSummary` is on. |
| `externalUrl` | — | For posts that live on a third-party site. Setting this skips generating a content page; links point straight to the external URL. Use for **resources**. |
| `robots` | — | Robots meta directive for this page (e.g. `noindex`). See Google's robots meta tag docs for valid values. |
| `slug` | — | Overrides the auto-generated URL slug (standard Hugo field). |
| `draft` | `false` | Excludes the page from the build when `true`. |
| `xml` | `true` (unless excluded by site's `sitemap.excludedKinds`) | Whether the page is included in `sitemap.xml`. |
| `excludeFromSearch` | `false` | When `true`, hides the page from both the sitemap and the site's search index (`index.json`). |

## Taxonomies

| Field | Default | What it does |
|---|---|---|
| `tags` | — | List of tags. |
| `categories` | — | List of categories. |
| `keywords` | — | SEO keyword list. |
| `series` | — | Series the article belongs to (recommended: one per article). |
| `series_order` | — | Position within the series. |
| `seriesOpened` | `article.seriesOpened` | Whether the series module displays expanded by default. |

## Authors

| Field | Default | What it does |
|---|---|---|
| `author` | — | Simple single-author field. |
| `authors` | — | Array for the multi-author feature; overrides `showAuthor` when set. |
| `showAuthor` | `article.showAuthor` | Show the author box in the footer. |
| `showAuthorBottom` | `article.showAuthorBottom` | Move the author box to the bottom of the page instead of the top. |
| `showAuthorsBadges` | `article.showAuthorsBadges` | Show author taxonomy badges in the article/list header (needs multi-author + `authors` taxonomy set up). |

## Hero / feature image

| Field | Default | What it does |
|---|---|---|
| `featureimage` | — | Path/URL to the feature image. |
| `featureimagecaption` | — | Caption for the feature image (only shown with `heroStyle: big`). |
| `showHero` | `article.showHero` | Show the thumbnail as a hero image on the article page. |
| `heroStyle` | `article.heroStyle` | One of `basic`, `big`, `background`, `thumbAndBackground`. |
| `imagePosition` | — | CSS `object-position` value for the feature image (see MDN for valid values). |
| `layoutBackgroundBlur` | `true` | Blurs the background image on scroll (for `heroStyle: background`). |
| `layoutBackgroundHeaderSpace` | `true` | Adds spacing between the header and body. |

## Display toggles

| Field | Default | What it does |
|---|---|---|
| `showSummary` | `list.showSummary` | Show the summary on list pages. |
| `showTableOfContents` | `article.showTableOfContents` | Show the ToC. |
| `showWordCount` | `article.showWordCount` | Show word count. |
| `showReadingTime` | `article.showReadingTime` | Show estimated reading time. |
| `showReadingProgress` | `article.showReadingProgress` | Show a reading-progress bar. |
| `showDate` | `article.showDate` | Show the `date` field. |
| `showDateUpdated` | `article.showDateUpdated` | Show the `lastmod` field. |
| `showHeadingAnchors` | `article.showHeadingAnchors` | Show anchor links next to headings. |
| `showPagination` | `article.showPagination` | Show next/previous article links. |
| `invertPagination` | `article.invertPagination` | Flip the direction of next/previous links. |
| `showTaxonomies` | `article.showTaxonomies` | Show tags/categories/keywords/series on the article. |
| `showBreadcrumbs` | `article.showBreadcrumbs` / `list.showBreadcrumbs` | Show breadcrumb navigation. |
| `showEdit` | `article.showEdit` | Show an "edit this page" link. |
| `editURL` | `article.editURL` | URL the edit link points to. |
| `editAppendPath` | `article.editAppendPath` | Whether the current article's path is appended to `editURL`. |
| `showComments` | `article.showComments` | Include the comments partial after the article footer. |
| `showViews` | `article.showViews` | Show view counts (requires Firebase integration). |
| `showLikes` | `article.showLikes` | Show like counts (requires Firebase integration). |
| `sharingLinks` | `article.sharingLinks` | Which social sharing links to show at the end of the article; `false` hides them. |
| `replyByEmail` | — | Allow email replies to the article. |
| `showZenMode` | — | Enable distraction-free reading mode. |
| `groupByYear` | `list.groupByYear` | Group articles by year on list pages. |
| `menu` | — | `main` or `footer` — adds a link to this article in that menu. |
| `externalLinkForceNewTab` | `article.externalLinkForceNewTab` | Force external Markdown links to open in a new tab. |

## Notes for this skill

- **Resources** should always set `externalUrl` (no local content page gets generated for them).
- Fields not listed here but seen in older examples (e.g. plain `date`, `lastmod`) are standard Hugo front matter, not Blowfish-specific — they still work normally.
- When a boolean field is omitted, it inherits from the theme's `config/_default/params.toml` — don't set it unless you're intentionally overriding the site default for this one article.
