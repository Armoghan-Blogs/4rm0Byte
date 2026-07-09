CMS.registerEditorComponent({
    id: "custom_timeline",
    label: "Timeline",
    fields: [
        {
            name: "items",
            label: "Timeline Items",
            widget: "list",
            field: {
                label: "Timeline Item",
                name: "item",
                widget: "object",
                fields: [
                    {
                        name: "icon",
                        label: "Icon",
                        widget: "select",
                        options: [
                            { label: "Amazon", value: "amazon" },
                            { label: "Apple", value: "apple" },
                            { label: "Bars", value: "bars" },
                            { label: "Bell", value: "bell" },
                            { label: "Blogger", value: "blogger" },
                            { label: "Blue Sky", value: "bluesky" },
                            { label: "Bomb", value: "bomb" },
                            { label: "Bug", value: "bug" },
                            { label: "Check", value: "check" },
                            { label: "Chevron Down", value: "chevron-down" },
                            { label: "Circle Info", value: "circle-info" },
                            { label: "Codepen", value: "codepen" },
                            { label: "Code", value: "code" },
                            { label: "Comment", value: "comment" },
                            { label: "Dev", value: "dev" },
                            { label: "Discord", value: "discord" },
                            { label: "Discourse", value: "discourse" },
                            { label: "Docker", value: "docker" },
                            { label: "Download", value: "download" },
                            { label: "Dribbble", value: "dribbble" },
                            { label: "Edit", value: "edit" },
                            { label: "Email", value: "email" },
                            { label: "Envelope", value: "envelope" },
                            { label: "Expand", value: "expand" },
                            { label: "Eye", value: "eye" },
                            { label: "Facebook", value: "facebook" },
                            { label: "Fire", value: "fire" },
                            { label: "Flickr", value: "flickr" },
                            { label: "Fork", value: "fork" },
                            { label: "Foursquare", value: "foursquare" },
                            { label: "Ghost", value: "ghost" },
                            { label: "GitHub", value: "github" },
                            { label: "GitLab", value: "gitlab" },
                            { label: "Globe", value: "globe" },
                            { label: "Goodreads", value: "goodreads" },
                            { label: "Google", value: "google" },
                            { label: "Graduation Cap", value: "graduation-cap" },
                            { label: "Hacker News", value: "hackernews" },
                            { label: "Hashnode", value: "hashnode" },
                            { label: "Heart Empty", value: "heart-empty" },
                            { label: "Heart", value: "heart" },
                            { label: "Image", value: "image" },
                            { label: "Instagram", value: "instagram" },
                            { label: "Keybase", value: "keybase" },
                            { label: "Kickstarter", value: "kickstarter" },
                            { label: "Ko-fi", value: "ko-fi" },
                            { label: "Lastfm", value: "lastfm" },
                            { label: "Lightbulb", value: "lightbulb" },
                            { label: "LinkedIn", value: "linkedin" },
                            { label: "Link", value: "link" },
                            { label: "List", value: "list" },
                            { label: "Location Dot", value: "location-dot" },
                            { label: "Lock", value: "lock" },
                            { label: "Mastodon", value: "mastodon" },
                            { label: "Medium", value: "medium" },
                            { label: "Microsoft", value: "microsoft" },
                            { label: "Moon", value: "moon" },
                            { label: "Mug Hot", value: "mug-hot" },
                            { label: "Music", value: "music" },
                            { label: "Orcid", value: "orcid" },
                            { label: "Patreon", value: "patreon" },
                            { label: "Paypal", value: "paypal" },
                            { label: "Pencil", value: "pencil" },
                            { label: "PGP Key", value: "pgpkey" },
                            { label: "Phone", value: "phone" },
                            { label: "Pinterest", value: "pinterest" },
                            { label: "Poo", value: "poo" },
                            { label: "Reddit", value: "reddit" },
                            { label: "ResearchGate", value: "researchgate" },
                            { label: "RSS Square", value: "rss-square" },
                            { label: "RSS", value: "rss" },
                            { label: "Scale Balanced", value: "scale-balanced" },
                            { label: "Search", value: "search" },
                            { label: "Shield", value: "shield" },
                            { label: "Skull Crossbones", value: "skull-crossbones" },
                            { label: "Slack", value: "slack" },
                            { label: "Snapchat", value: "snapchat" },
                            { label: "SoundCloud", value: "soundcloud" },
                            { label: "Stack Overflow", value: "stack-overflow" },
                            { label: "Star", value: "star" },
                            { label: "Steam", value: "steam" },
                            { label: "Stripe", value: "stripe" },
                            { label: "Substack", value: "substack" },
                            { label: "Sun", value: "sun" },
                            { label: "Tag", value: "tag" },
                            { label: "Telegram", value: "telegram" },
                            { label: "TikTok", value: "tiktok" },
                            { label: "Triangle Exclamation", value: "triangle-exclamation" },
                            { label: "Tumblr", value: "tumblr" },
                            { label: "Twitch", value: "twitch" },
                            { label: "Twitter", value: "twitter" },
                            { label: "Wand Magic Sparkles", value: "wand-magic-sparkles" },
                            { label: "WhatsApp", value: "whatsapp" },
                            { label: "Xing", value: "xing" },
                            { label: "X Mark", value: "xmark" },
                            { label: "X Twitter", value: "x-twitter" },
                            { label: "YouTube", value: "youtube" },
                                ],
                                default: "fire",
                    },
                    {
                        name: "header",
                        label: "Header",
                        widget: "string",
                        required: true
                    },
                    {
                        name: "badge",
                        label: "Badge",
                        widget: "string",
                        required: true
                    },
                    {
                        name: "subheader",
                        label: "Subheader",
                        widget: "string",
                        required: true
                    },
                    {
                        name: "content",
                        label: "Content",
                        widget: "markdown",
                        required: true,
                        default: "Timeline item content" // Default content for the timeline item
                    }
                ]
            }
        }
    ],
    pattern: /{{< timeline >}}([^]*?){{< \/timeline >}}/,
    fromBlock: function(match) {
        const items = match[1].match(/{{< timelineItem([^]*?){{< \/timelineItem >}}/g);
        const parsedItems = items.map(item => {
            const iconMatch = item.match(/icon="([^"]+)"/);
            const headerMatch = item.match(/header="([^"]+)"/);
            const badgeMatch = item.match(/badge="([^"]+)"/);
            const subheaderMatch = item.match(/subheader="([^"]+)"/);
            const contentMatch = item.match(/{{< timelineItem[^>]*>([^]+?){{< \/timelineItem >}}/);

            return {
                icon: iconMatch ? iconMatch[1] : "",
                header: headerMatch ? headerMatch[1] : "",
                badge: badgeMatch ? badgeMatch[1] : "",
                subheader: subheaderMatch ? subheaderMatch[1] : "",
                content: contentMatch ? contentMatch[1].trim() : ""
            };
        });

        return {
            items: parsedItems
        };
    },
    toBlock: function(obj) {
        const itemBlocks = obj.items.map(item => {
            return `
{{< timelineItem icon="${item.icon}" header="${item.header}" badge="${item.badge}" subheader="${item.subheader}" >}}
${item.content}
{{< /timelineItem >}}
            `;
        });

        return `{{< timeline >}}
${itemBlocks.join('')}
{{< /timeline >}}`;
    },
    toPreview: function(obj) {
        const itemsHTML = obj.items.map(item => {
            return `
<div class="timeline-item">
    <div class="timeline-icon">${item.icon}</div>
    <div class="timeline-content">
        <div class="timeline-header">${item.header}</div>
        <div class="timeline-badge">${item.badge}</div>
        <div class="timeline-subheader">${item.subheader}</div>
        <div class="timeline-body">${item.content}</div>
    </div>
</div>
            `;
        });

        return `<div class="timeline">${itemsHTML.join('')}</div>`;
    },
});
