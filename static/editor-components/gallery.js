CMS.registerEditorComponent({
    id: "custom_gallery",
    label: "Gallery",
    fields: [
        {
            label: "Gallery Images",
            name: "galleryImages",
            widget: "list",
            summary: "{{fields.image}}",
            field: {
                label: "Image",
                name: "image",
                widget: "image",
            },
        },
        {
            label: "Image Classes",
            name: "imageClasses",
            widget: "list",
            summary: "{{fields.class}}",
            field: {
                label: "Class",
                name: "class",
                widget: "select",
                multiple: true,
                options: [
                    { label: "grid-w50", value: "grid-w50" },
                    { label: "md:grid-w33", value: "md:grid-w33" },
                    { label: "xl:grid-w25", value: "xl:grid-w25" },
                    { label: "No Class", value: "" }, // Optional: Add an option for no class
                ],
            },
        },
    ],
    pattern: /{{< gallery >}}([^]*?){{< \/gallery >}}/,
    fromBlock: function(match) {
        return {}; // Return an empty object since we are not parsing specific data from the block
    },
    toBlock: function(obj) {
        return `{{< gallery >}}\n{{< /gallery >}}`; // Return the block structure without specific data
    },
    toPreview: function(obj) {
        const images = obj.galleryImages.map((image, index) => {
            const classes = obj.imageClasses[index].length > 0 ? ` class="${obj.imageClasses[index].join(' ')}"` : '';
            return `<img src="${image}"${classes} />`;
        }).join('');
        return `<div class="gallery-preview">${images}</div>`;
    },
});
