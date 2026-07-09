CMS.registerEditorComponent({
    id: "custom_lead",
    label: "Lead",
    fields: [
        {
            name: "content",
            label: "Lead Content",
            widget: "string",
            required: true,
            default: "Default lead content" // Default lead content
        }
    ],
    pattern: /{{< lead >}}([^]*?){{< \/lead >}}/,
    fromBlock: function(match) {
        return {
            content: match[1].trim() // Trim whitespace from the content
        };
    },
    toBlock: function(obj) {
        return `{{< lead >}}\n${obj.content}\n{{< /lead >}}`;
    },
    toPreview: function(obj) {
        return `<div class="lead">${obj.content}</div>`;
    },
});
