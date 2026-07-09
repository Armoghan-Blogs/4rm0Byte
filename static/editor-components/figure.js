CMS.registerEditorComponent({
    id: "custom_figure",
    label: "Figure",
    fields: [
        {
            name: "src",
            label: "Image Source",
            widget: "image",
            required: true,
            default: "" // Default image source
        },
        {
            name: "alt",
            label: "Alt Text",
            widget: "string",
            required: true,
            default: "" // Default alt text
        },
        {
            name: "caption",
            label: "Caption",
            widget: "string",
            required: true,
            default: "" // Default caption text
        },
        {
            name: "captionLink",
            label: "Caption Link",
            widget: "string",
            required: false,
            default: "" // Default caption link
        }
    ],
    pattern: /{{< figure src="([^"]+)" alt="([^"]+)" caption="([^"]+)" captionLink="([^"]+)?" >}}/,
    fromBlock: function(match) {
        return {
            src: match[1],
            alt: match[2],
            caption: match[3],
            captionLink: match[4] || '' // Use empty string if captionLink is not present
        };
    },
    toBlock: function(obj) {
        return `{{< figure src="${obj.src}" alt="${obj.alt}" caption="${obj.caption}" captionLink="${obj.captionLink}" >}}`;
    },
    toPreview: function(obj) {
        const link = obj.captionLink ? `href="${obj.captionLink}" target="_blank"` : ''; // Add link attributes if captionLink is present
        const caption = obj.captionLink ? `<a ${link}>${obj.caption}</a>` : obj.caption; // Wrap caption in anchor tag if captionLink is present
        return `<figure>
            <img src="${obj.src}" alt="${obj.alt}">
            <figcaption>${caption}</figcaption>
        </figure>`;
    },
});
