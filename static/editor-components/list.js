CMS.registerEditorComponent({
    id: "custom_list",
    label: "List",
    fields: [
        {
            name: "title",
            label: "Title",
            widget: "string",
            required: true,
            default: "Samples" // Default title
        },
        {
            name: "cardView",
            label: "Card View",
            widget: "boolean",
            required: false,
            default: true // Default card view option
        },
        {
            name: "limit",
            label: "Limit",
            widget: "select",
            options: [
                "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
                "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
                "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
                "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
                "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"
            ],
            required: true,
            default: 5 // Default limit value for Samples list
        },
        {
            name: "where",
            label: "Where",
            widget: "string",
            default: "type",
            required: false
        },
        {
            name: "value",
            label: "Value",
            widget: "string",
            default: "sample",
            required: false
        }
    ],
    pattern: /{{< list title="(.+?)" cardView=(true|false) limit=(\d+) where="(.+?)" value="(.+?)" >}}/,
    fromBlock: function(match) {
        return {
            title: match[1],
            cardView: match[2] === "true",
            limit: parseInt(match[3], 10),
            where: match[4],
            value: match[5]
        };
    },
    toBlock: function(obj) {
        return `{{< list title="${obj.title}" cardView=${obj.cardView} limit=${obj.limit} where="${obj.where}" value="${obj.value}" >}}`;
    },
    toPreview: function(obj) {
        return `<ul class="${obj.cardView ? 'card-view' : ''}" data-limit="${obj.limit}" data-where="${obj.where}" data-value="${obj.value}">${obj.title}</ul>`;
    },
});
