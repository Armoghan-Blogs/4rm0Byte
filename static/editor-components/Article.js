CMS.registerEditorComponent({
    id: "custom_article",
    label: "Article",
    fields: [
        {
            name: "link",
            label: "Article Link",
            widget: "string",
            required: true,
            default: "/docs/welcome/" 
        }
    ],
    pattern: /{{< article link="([^"]+)" >}}/,
    fromBlock: function(match) {
        return {
            link: match[1]
        };
    },
    toBlock: function(obj) {
        return `{{< article link="${obj.link}" >}}`;
    },
    toPreview: function(obj) {
        return `<a href="${obj.link}">Read more</a>`;
    },
});
