CMS.registerEditorComponent({
    id: "custom_mdimporter",
    label: "Markdown Importer",
    fields: [
        {
            name: "url",
            label: "URL",
            widget: "string",
            pattern: ['^(https?|http):\/\/[^\s/$.?#].[^\s]*$', "Must be a valid URL"],
            required: true,
            default: "https://raw.githubusercontent.com/nunocoracao/nunocoracao/master/README.md" // Default URL
        }
    ],
    pattern: /{{< mdimporter url="(.+?)" >}}/,
    fromBlock: function(match) {
        return {
            url: match[1].trim() // Extract the URL from the matched pattern
        };
    },
    toBlock: function(obj) {
        return `{{< mdimporter url="${obj.url}" >}}`;
    },
    toPreview: function(obj) {
        return `<div class="md-importer-preview">Importing from: ${obj.url}</div>`;
    },
});
