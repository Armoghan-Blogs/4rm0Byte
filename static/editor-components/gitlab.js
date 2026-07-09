CMS.registerEditorComponent({
    id: "custom_gitlab",
    label: "GitLab Project",
    fields: [
        {
            label: "Project ID",
            name: "projectID",
            widget: "string",
            default: "278964", // Default project ID value
        }
    ],
    pattern: /{{< gitlab projectID="([^"]+)" >}}/,
    fromBlock: function(match) {
        return { projectID: match[1] };
    },
    toBlock: function(obj) {
        return `{{< gitlab projectID="${obj.projectID}" >}}`;
    },
    toPreview: function(obj) {
        const { projectID } = obj;
        return `<div class="gitlab-preview">
            <p>GitLab Project ID: ${projectID}</p>
            <!-- Add styling or additional content as needed -->
        </div>`;
    },
});
