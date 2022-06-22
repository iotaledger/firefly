<script lang="typescript">
    import Chart from 'chart.js'
    import { appSettings } from '@lib/appSettings'
    import { convertHexToRGBA } from '@lib/helpers'
    import tailwindConfig from 'shared/tailwind.config.js'
    import { afterUpdate, onMount } from 'svelte'
    import resolveConfig from 'tailwindcss/resolveConfig'
    import { AccountColor } from '@lib/typings/color'

    export let labels = []
    export let datasets = []
    export let xMaxTicks = 7
    export let yMaxTicks = 6
    export let formatYAxis = (value: unknown): number => Number(value.toString())
    export let color = AccountColor.Blue.toString()
    export let beginAtZero = false
    export let inlineStyle = 'height: calc(50vh - 140px);'

    let canvas
    let chart

    $: darkModeEnabled = $appSettings.darkMode

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
                    const gradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, context.canvas.height)
                    gradient.addColorStop(0, convertHexToRGBA(color, 30))
                    gradient.addColorStop(1, convertHexToRGBA(color, 0))
                    return {
                        backgroundColor: gradient,
                        borderColor: color,
                        borderWidth: 1.5,
                        pointBackgroundColor: color,
                        pointBorderColor: color,
                        pointRadius: 0,
                        hoverRadius: 4,
                        ...dataset,
                    }
                }),
            },
            options: {
                animation: false,
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
                    titleFontFamily: 'Inter',
                    bodyFontFamily: 'Inter',
                    bodyFontColor: fullConfig.theme.colors.gray['200'],
                    callbacks: {
                        title: function ([tooltipItem]) {
                            const dataset = datasets[tooltipItem.datasetIndex]
                            if (dataset && dataset.tooltips) {
                                return dataset.tooltips[tooltipItem.index]?.title ?? ''
                            }
                            return ''
                        },
                        label: function (tooltipItem) {
                            const dataset = datasets[tooltipItem.datasetIndex]
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
                                padding: 7,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                color: darkModeEnabled
                                    ? fullConfig.theme.colors.gray['700']
                                    : fullConfig.theme.colors.gray['100'],
                                zeroLineColor: darkModeEnabled
                                    ? fullConfig.theme.colors.gray['700']
                                    : fullConfig.theme.colors.gray['100'],
                                drawBorder: false,
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: yMaxTicks,
                                beginAtZero,
                                padding: 7,
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
