CMS.registerEditorComponent({
    id: "custom_github",
    label: "GitHub Repository",
    fields: [
        {
            label: "Repository",
            name: "repo",
            widget: "string",
            default: "armoghan-ul-mohmin/armoghan-ul-mohmin", // Default repository value
        }
    ],
    pattern: /{{< github repo="([^"]+)" >}}/,
    fromBlock: function(match) {
        return { repo: match[1] };
    },
    toBlock: function(obj) {
        return `{{< github repo="${obj.repo}" >}}`;
    },
    toPreview: function(obj) {
        const { repo } = obj;
        return `<div class="github-preview">
            <p>GitHub Repository: ${repo}</p>
            <!-- Add styling or additional content as needed -->
        </div>`;
    },
});
