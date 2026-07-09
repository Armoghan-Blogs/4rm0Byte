CMS.registerEditorComponent({
    id: "custom_chart",
    label: "Chart",
    fields: [
        {
            name: "chartData",
            label: "Chart Data",
            widget: "text",
            required: true,
            default: `{
  type: 'bar',
  data: {
    labels: ['Tomato', 'Blueberry', 'Banana', 'Lime', 'Orange'],
    datasets: [{
      label: '# of votes',
      data: [12, 19, 3, 5, 3],
    }]
  }
}` // Default chart data
        }
    ],
    pattern: /{{< chart >}}([^]*?){{< \/chart >}}/,
    fromBlock: function(match) {
        return {
            chartData: match[1].trim() // Trim whitespace from the chart data
        };
    },
    toBlock: function(obj) {
        return `{{< chart >}}\n${obj.chartData}\n{{< /chart >}}`;
    },
    toPreview: function(obj) {
        // This is just a placeholder for the preview
        return `<div class="chart-preview">${obj.chartData}</div>`;
    },
});
