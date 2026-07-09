CMS.registerEditorComponent({
    id: "custom_carousel",
    label: "Carousel",
    fields: [
        {
            name: "images",
            label: "Image Path",
            widget: "string",
            required: true,
            default: "gallery/*" // Default image path
        },
        {
            name: "aspectRatio",
            label: "Aspect Ratio",
            widget: "string",
            required: true,
            default: "21-9" // Default aspect ratio
        },
        {
            name: "interval",
            label: "Slide Interval (ms)",
            widget: "number",
            required: true,
            default: 2500 // Default slide interval in milliseconds
        }
    ],
    pattern: /{{< carousel images="([^"]+)" aspectRatio="([^"]+)" interval="([^"]+)" >}}/,
    fromBlock: function(match) {
        return {
            images: match[1],
            aspectRatio: match[2],
            interval: parseInt(match[3]) // Convert interval to integer
        };
    },
    toBlock: function(obj) {
        return `{{< carousel images="${obj.images}" aspectRatio="${obj.aspectRatio}" interval="${obj.interval}" >}}`;
    },
    toPreview: function(obj) {
        // This is just a placeholder for the preview
        return `<div class="carousel" data-images="${obj.images}" data-aspect-ratio="${obj.aspectRatio}" data-interval="${obj.interval}">Carousel Preview</div>`;
    },
});
