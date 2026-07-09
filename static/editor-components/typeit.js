CMS.registerEditorComponent({
    id: "custom_typeit",
    label: "Typeit",
    fields: [
        {
            name: "tag",
            label: "Tag",
            widget: "select",
            options: [
                { label: "Heading 1", value: "h1" },
                { label: "Heading 2", value: "h2" },
                { label: "Heading 3", value: "h3" },
                { label: "Heading 4", value: "h4" },
                { label: "Heading 5", value: "h5" },
                { label: "Heading 6", value: "h6" },
                    ],
            default: "h2",
            required: true,
        },
        {
            name: "speed",
            label: "Speed",
            widget: "number",
            required: true,
            default: 50 // Default speed for Typeit (characters per second)
        },
        {
            name: "breakLines",
            label: "Break Lines",
            widget: "boolean",
            required: false,
            default: false // Default option for breaking lines in Typeit
        },
        {
            name: "loop",
            label: "Loop",
            widget: "boolean",
            required: false,
            default: true // Default option for looping in Typeit
        },
        {
            name: "content",
            label: "Typeit Content",
            widget: "markdown",
            required: true,
            default: "Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit." // Default Typeit content
        }
    ],
    pattern: /{{< typeit\s+tag="([^"]+)"\s+speed=(\d+)\s+breakLines=(true|false)\s+loop=(true|false) >}}([^]*?){{< \/typeit >}}/,
    fromBlock: function(match) {
        return {
            tag: match[1],
            speed: parseInt(match[2], 10),
            breakLines: match[3] === "true",
            loop: match[4] === "true",
            content: match[5].trim()
        };
    },
    toBlock: function(obj) {
        return `{{< typeit tag="${obj.tag}" speed=${obj.speed} breakLines=${obj.breakLines} loop=${obj.loop} >}}\n${obj.content}\n{{< /typeit >}}`;
    },
    toPreview: function(obj) {
        return `<${obj.tag} class="typeit">${obj.content}</${obj.tag}>`;
    },
});
