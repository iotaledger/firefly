<script>
    import { onMount, afterUpdate } from 'svelte'
    import resolveConfig from 'tailwindcss/resolveConfig'
    import tailwindConfig from 'shared/tailwind.config.js'
    import { convertHexToRGBA } from 'shared/lib/helpers'
    import Chart from 'chart.js'

    export let labels = []
    export let data = []
    export let tooltips = []
    export let color = 'blue' // TODO: each profile has a different color

    let canvas
    let chart

    const fullConfig = resolveConfig(tailwindConfig)

    onMount(() => {
        createChart()
    })

    afterUpdate(() => {
        reinitialise()
    })

    function createChart() {
        const ctx = canvas
        const context = ctx.getContext('2d')

        const gradient = context.createLinearGradient(
            context.canvas.width / 2,
            0,
            context.canvas.width / 2,
            context.canvas.height / 1.2
        )

        gradient.addColorStop(0, convertHexToRGBA(fullConfig.theme.colors[color]['400'], 40))
        gradient.addColorStop(1, convertHexToRGBA(fullConfig.theme.colors[color]['400'], 0))

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        backgroundColor: gradient,
                        borderColor: fullConfig.theme.colors[color]['300'],
                        borderWidth: 2,
                        pointBackgroundColor: fullConfig.theme.colors[color]['300'],
                        pointRadius: 0,
                        hoverRadius: 4,
                        data,
                    },
                ],
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
                            return tooltips[tooltipItem.index] ? tooltips[tooltipItem.index].title : ''
                        },
                        label: function (tooltipItem) {
                            return tooltips[tooltipItem.index].label
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
                            },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                                autoSkip: true,
                                maxTicksLimit: 6,
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

<div class="relative" style="height: calc(50vh - 130px);"><canvas bind:this={canvas} width="600" height="250" /></div>
