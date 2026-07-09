CMS.registerEditorComponent({
    id: "custom_button",
    label: "Button",
    fields: [
        {
            name: "href",
            label: "Button Link",
            widget: "string",
            required: true,
            default: "#button" // Default link value
        },
        {
            name: "target",
            label: "Link Target",
            widget: "select",
            options: [
                { label: "Self", value: "_self" },
                { label: "Blank", value: "_blank" }
            ],
            default: "_self" // Default target value
        },
        {
            name: "content",
            label: "Button Text",
            widget: "string",
            required: true,
            default: "Call to action" // Default button text
        }
    ],
    pattern: /{{< button href="([^"]+)" target="([^"]+)" >}}([^]*?){{< \/button >}}/,
    fromBlock: function(match) {
        return {
            href: match[1],
            target: match[2],
            content: match[3].trim() // Trim whitespace from the content
        };
    },
    toBlock: function(obj) {
        return `{{< button href="${obj.href}" target="${obj.target}" >}}\n${obj.content}\n{{< /button >}}`;
    },
    toPreview: function(obj) {
        return `<a href="${obj.href}" target="${obj.target}" class="button">${obj.content}</a>`;
    },
});
