CMS.registerEditorComponent({
    id: "youtube_lite",
    label: "YouTube Lite",
    fields: [
        {
            name: "id",
            label: "YouTube Video ID",
            widget: "string",
            required: true,
            pattern: [
                /^[\w-]{11}$/,
                "YouTube Video ID must be 11 characters long and can contain letters, numbers, hyphens, and underscores."
            ],
            hint: "Enter the YouTube video ID (11 characters) from the video URL."
        },
        {
            name: "label",
            label: "Label",
            widget: "string",
            required: true,
            default: "YouTube Video" // Default label
        }
    ],
    pattern: /{{< youtubeLite id="([^"]+)" label="([^"]+)" >}}/,
    fromBlock: function(match) {
        return {
            id: match[1],
            label: match[2]
        };
    },
    toBlock: function(obj) {
        return `{{< youtubeLite id="${obj.id}" label="${obj.label}" >}}`;
    },
    toPreview: function(obj) {
        return `<div class="youtube-lite">
            <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/${obj.id}"
                title="${obj.label}"
                frameborder="0"
                allowfullscreen
            ></iframe>
            <p>${obj.label}</p>
        </div>`;
    },
});
