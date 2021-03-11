<script lang="typescript">
    import Chart from 'chart.js'
    import { convertHexToRGBA } from 'shared/lib/helpers'
    import tailwindConfig from 'shared/tailwind.config.js'
    import { afterUpdate, onMount } from 'svelte'
    import resolveConfig from 'tailwindcss/resolveConfig'

    export let labels = []
    export let datasets = []
    export let xMaxTicks = 7
    export let yMaxTicks = 6
    export let formatYAxis = (value) => Number(value.toString())
    export let color = 'blue' // TODO: each profile has a different color
    export let beginAtZero = false
    export let inlineStyle = 'height: calc(50vh - 130px);'

    let canvas
    let chart

    const fullConfig = resolveConfig(tailwindConfig)

    onMount(createChart)

    afterUpdate(reinitialise)

    function createChart() {
        const ctx = canvas
        const context = ctx.getContext('2d')

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: datasets.map((dataset) => {
                    const gradient = context.createLinearGradient(
                        context.canvas.width / 2,
                        0,
                        context.canvas.width / 2,
                        context.canvas.height / 1.2
                    )
                    const themeColor = fullConfig.theme.colors[dataset.color || color]
                    gradient.addColorStop(0, convertHexToRGBA(themeColor['400'], 40))
                    gradient.addColorStop(1, convertHexToRGBA(themeColor['400'], 0))
                    return {
                        backgroundColor: gradient,
                        borderColor: themeColor['300'],
                        borderWidth: 2,
                        pointBackgroundColor: themeColor['300'],
                        pointRadius: 0,
                        hoverRadius: 4,
                        ...dataset,
                    }
                }),
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    // Hide label
                    display: false,
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: fullConfig.theme.colors.gray['900'],
                    xPadding: 12,
                    yPadding: 12,
                    displayColors: false,
                    titleFontSize: 12,
                    bodyFontSize: 11,
                    titleFontFamily: 'DM Sans',
                    bodyFontFamily: 'DM Sans',
                    bodyFontColor: fullConfig.theme.colors[color]['200'],
                    callbacks: {
                        title: function ([tooltipItem]) {
                            let dataset = datasets[tooltipItem.datasetIndex]
                            if (dataset && dataset.tooltips) {
                                return dataset.tooltips[tooltipItem.index]?.title ?? ''
                            }
                            return ''
                        },
                        label: function (tooltipItem) {
                            let dataset = datasets[tooltipItem.datasetIndex]
                            if (dataset && dataset.tooltips) {
                                return dataset.tooltips[tooltipItem.index]?.label ?? ''
                            }
                            return ''
                        },
                    },
                },
                hover: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: false,
                            },
                            ticks: {
                                autoSkip: true,
                                maxRotation: 0,
                                minRotation: 0,
                                maxTicksLimit: xMaxTicks,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: yMaxTicks,
                                beginAtZero,
                                callback: function (value, index, values) {
                                    return formatYAxis(value)
                                },
                            },
                        },
                    ],
                },
            },
        })
    }

    function reinitialise() {
        chart.destroy()
        createChart()
    }
</script>

<div class="relative" style={inlineStyle}><canvas bind:this={canvas} width="600" height="250" /></div>
