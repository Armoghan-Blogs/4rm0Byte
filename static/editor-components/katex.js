CMS.registerEditorComponent({
    id: "katex",
    label: "KaTeX",
    fields: [
        {
            name: "equation",
            label: "Equation",
            widget: "text",
            default: "\\(f(a,b,c) = (a^2+b^2+c^2)^3\\)", // Default KaTeX equation
        }
    ],
    pattern: /{{< katex >}}([^]*?){{< \/katex >}}/,
    fromBlock: function(match) {
        return { equation: match[1].trim() };
    },
    toBlock: function(obj) {
        return `{{< katex >}}\n${obj.equation}\n{{< /katex >}}`;
    },
    toPreview: function(obj) {
        return `<div class="katex-preview">${obj.equation}</div>`;
    },
});
