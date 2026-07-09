CMS.registerEditorComponent({
    id: "custom_mermaid",
    label: "Mermaid Diagram",
    fields: [
        {
            name: "content",
            label: "Mermaid Content",
            widget: "code",
            language: "markdown",
            required: true,
            default: "graph LR;\nA[Lemons]-->B[Lemonade];\nB-->C[Profit];" // Default Mermaid content
        }
    ],
    pattern: /{{< mermaid >}}([^]*?){{< \/mermaid >}}/,
    fromBlock: function(match) {
        return {
            content: match[1].trim() // Trim whitespace from the content
        };
    },
    toBlock: function(obj) {
        return `{{< mermaid >}}\n${obj.content}\n{{< /mermaid >}}`;
    },
    toPreview: function(obj) {
        return `<div class="mermaid">${obj.content}</div>`;
    },
});
