CMS.registerEditorComponent({
    id: "custom_rtl",
    label: "RTL Text",
    fields: [
        {
            name: "content",
            label: "RTL Content",
            widget: "markdown",
            required: true,
            default: "- هذه القائمة باللغة العربية\n- من اليمين الى اليسار" // Default RTL content
        }
    ],
    pattern: /{{% rtl %}}([^]*?){{% \/rtl %}}/,
    fromBlock: function(match) {
        return {
            content: match[1].trim() // Trim whitespace from the content
        };
    },
    toBlock: function(obj) {
        return `{{% rtl %}}\n${obj.content}\n{{% /rtl %}}`;
    },
    toPreview: function(obj) {
        return `<div dir="rtl" style="text-align: right;">${obj.content}</div>`;
    },
});
