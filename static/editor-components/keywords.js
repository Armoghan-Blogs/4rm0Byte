CMS.registerEditorComponent({
    id: "keyword",
    label: "Keyword",
    fields: [
        {
            name: "keywordText",
            label: "Keyword Text",
            widget: "string",
            default: "Super skill", // Default keyword text
        }
    ],
    pattern: /{{< keyword >}}([^]*?){{< \/keyword >}}/,
    fromBlock: function(match) {
        return { keywordText: match[1].trim() };
    },
    toBlock: function(obj) {
        return `{{< keyword >}}\n${obj.keywordText}\n{{< /keyword >}}`;
    },
    toPreview: function(obj) {
        return `<div class="keyword-preview">${obj.keywordText}</div>`;
    },
});
