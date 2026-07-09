CMS.registerEditorComponent({
    id: "custom_swatches",
    label: "Swatches",
    fields: [
        {
            name: "colors",
            label: "Colors",
            widget: "list",
            default: ["#64748b", "#3b82f6", "#06b6d4"], // Default color swatches
            field: {
                label: "Color",
                widget: "string",
                required: true
            }
        }
    ],
    pattern: /{{< swatches "(.+?)" "(.+?)" "(.+?)" >}}/,
    fromBlock: function(match) {
        return {
            colors: [match[1], match[2], match[3]] // Extract colors from the matched pattern
        };
    },
    toBlock: function(obj) {
        return `{{< swatches "${obj.colors[0]}" "${obj.colors[1]}" "${obj.colors[2]}" >}}`;
    },
    toPreview: function(obj) {
        const swatchesHTML = obj.colors.map(color => `<div style="background-color: ${color}; width: 50px; height: 50px; margin-right: 5px; display: inline-block;"></div>`).join('');
        return `<div>${swatchesHTML}</div>`;
    },
});
