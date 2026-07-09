CMS.registerEditorComponent({
    id: "custom_badge",
    label: "Badge",
    fields: [
        {
            name: "content",
            label: "Badge Content",
            widget: "string",
            required: true,
            default: "New article!" // Default badge content
        }
    ],
    pattern: /{{< badge >}}([^]*?){{< \/badge >}}/,
    fromBlock: function(match) {
        return {
            content: match[1].trim() // Trim whitespace from the content
        };
    },
    toBlock: function(obj) {
        return `{{< badge >}}\n${obj.content}\n{{< /badge >}}`;
    },
    toPreview: function(obj) {
        return `<span class="badge">${obj.content}</span>`;
    },
});
