---
name: icons-reference
description: Full list of built-in Blowfish icon names (FontAwesome 6-based) usable with the icon shortcode {{< icon "name" >}} or the icon partial. Consult when adding an icon to an accordion, timeline, feature grid, stat, tab, alert, or inline in text, so you use a real icon name instead of guessing.
---

# Blowfish Icon Reference

Source: https://blowfish.page/samples/icons/

Blowfish ships built-in support for a set of FontAwesome 6 icons, usable via:

```md
{{< icon "github" >}}
```

...or via the icon partial in template code. The icon inherits the surrounding text's size and color.

## Project-specific custom icon shortcode

This project also includes a custom local shortcode in `layouts/shortcodes/icons.html` for library-specific icons. It is useful when you want to render a library-based icon class directly inside content and load the matching CSS at the same time.

Valid usage:

```md
{{< icons "github" "bootstrap" >}}
{{< icons name="github" library="bootstrap" >}}
```

Supported libraries: `bootstrap`, `fontawesome`, `heroicons`, and `feather`.

Do not mix positional and named arguments in the same call. For example, `{{< icons "github" library="bootstrap" >}}` is invalid Hugo syntax.

**Custom icons:** drop an SVG into `assets/icons/` in the project root and reference it by filename (without `.svg`). Every path in the SVG needs `fill="currentColor"` so it picks up theme colors correctly.

## Full built-in icon list

`a11y`, `amazon`, `ansible`, `apple`, `bars`, `bell`, `blogger`, `bluesky`, `bomb`, `bug`, `check`, `chevron-down`, `circle-info`, `circle-question`, `cloud-moon`, `cloud`, `code`, `codeberg`, `codepen`, `comment`, `dev`, `discord`, `discourse`, `docker`, `download`, `dribbble`, `edit`, `email`, `envelope`, `expand`, `eye`, `facebook`, `fediverse`, `file-lines`, `fire`, `flickr`, `forgejo`, `fork`, `foursquare`, `ghost`, `gitea`, `github`, `github_gist`, `gitlab`, `globe`, `goodreads`, `google-scholar`, `google`, `graduation-cap`, `hackernews`, `hashnode`, `heart-empty`, `heart`, `image`, `instagram`, `itch-io`, `keybase`, `keyoxide`, `kickstarter`, `ko-fi`, `language`, `lastfm`, `lightbulb`, `line`, `link`, `linkedin`, `list-check`, `list-ol`, `list`, `location-dot`, `lock`, `mastodon`, `matrix`, `medium`, `microsoft`, `moon`, `mug-hot`, `music`, `orcid`, `patreon`, `paypal`, `peertube`, `pencil`, `pgpkey`, `phone`, `pinterest`, `pixelfed`, `poo`, `printables`, `quote-left`, `reddit`, `researchgate`, `rss-square`, `rss`, `scale-balanced`, `search`, `shield`, `shirt`, `signal`, `skull-crossbones`, `slack`, `snapchat`, `soundcloud`, `spotify`, `stack-overflow`, `star`, `steam`, `strava`, `stripe`, `substack`, `sun`, `tag`, `telegram`, `threads`, `tiktok`, `triangle-exclamation`, `tumblr`, `twitch`, `twitter`, `untappd`, `wand-magic-sparkles`, `whatsapp`, `worktree`, `x-twitter`, `xing`, `xmark`, `youtube`

## Grouped by common use

**Social/platform links:** `amazon`, `apple`, `blogger`, `bluesky`, `codeberg`, `codepen`, `dev`, `discord`, `discourse`, `dribbble`, `facebook`, `fediverse`, `flickr`, `forgejo`, `foursquare`, `ghost`, `gitea`, `github`, `github_gist`, `gitlab`, `goodreads`, `google-scholar`, `google`, `hackernews`, `hashnode`, `instagram`, `itch-io`, `keybase`, `keyoxide`, `kickstarter`, `ko-fi`, `lastfm`, `line`, `linkedin`, `mastodon`, `matrix`, `medium`, `microsoft`, `orcid`, `patreon`, `paypal`, `peertube`, `pinterest`, `pixelfed`, `printables`, `reddit`, `researchgate`, `signal`, `slack`, `snapchat`, `soundcloud`, `spotify`, `stack-overflow`, `steam`, `strava`, `stripe`, `substack`, `telegram`, `threads`, `tiktok`, `tumblr`, `twitch`, `twitter`, `untappd`, `whatsapp`, `x-twitter`, `xing`, `youtube`

**UI/interface:** `bars`, `bell`, `check`, `chevron-down`, `circle-info`, `circle-question`, `comment`, `download`, `edit`, `envelope`, `expand`, `eye`, `link`, `list-check`, `list-ol`, `list`, `lock`, `pencil`, `phone`, `quote-left`, `search`, `tag`, `xmark`

**Docs/technical (good for cheatsheets, tools, writeups):** `a11y`, `ansible`, `bug`, `code`, `docker`, `file-lines`, `fork`, `github_gist`, `graduation-cap`, `language`, `list-check`, `scale-balanced`, `shield`, `worktree`

**Tone/attention (good for alerts, admonitions, callouts):** `bomb`, `fire`, `lightbulb`, `poo`, `skull-crossbones`, `triangle-exclamation`, `wand-magic-sparkles`

**Misc/decorative:** `cloud-moon`, `cloud`, `globe`, `heart-empty`, `heart`, `image`, `location-dot`, `moon`, `mug-hot`, `music`, `pgpkey`, `shirt`, `star`, `sun`

## Notes for this skill

- Use these names with the `icon` shortcode itself, and with the `icon` parameter on other shortcodes that support one — `accordionItem`, `alert`, `timelineItem`, `feature`, `tab`.
- Don't invent icon names. If nothing here fits, either skip the icon or add a custom SVG to `assets/icons/` instead of guessing.
