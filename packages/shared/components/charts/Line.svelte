<script>
    import { onMount, afterUpdate } from 'svelte'
    import resolveConfig from 'tailwindcss/resolveConfig'
    import tailwindConfig from 'shared/tailwind.config.js'
    import { chartTimeframe, HistoryDataProps, chartCurrency } from 'shared/lib/marketData'
    import { convertHexToRGBA } from 'shared/lib/helpers'
    import Chart from 'chart.js'

    let canvas
    let chart

    export let labels
    export let data
    export let color = 'blue' // TODO: each profile has a different color

    const fullConfig = resolveConfig(tailwindConfig)

    onMount(() => {
        formatLabels()
        createChart()
    })

    afterUpdate(() => {
        formatLabels()
        reinitialise()
    })

    const formatLabels = () => {
        switch ($chartTimeframe) {
            case HistoryDataProps.ONE_HOUR:
            case HistoryDataProps.TWENTY_FOUR_HOURS:
                return labels.map((label) =>
                    label.toLocaleString('default', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                )
            case HistoryDataProps.SEVEN_DAYS:
                let formattedLabels = labels.map((label) => label.toLocaleString('default', { month: 'short', day: 'numeric' }))
                let _displayedLabels = []
                let _blacklistedLabels = []
                return formattedLabels.map((label, index) => {
                    if (index === 0 && labels.filter((l) => l === label).length < 4) {
                        _blacklistedLabels.push(label)
                    }
                    if (_displayedLabels.includes(label) || _blacklistedLabels.includes(label)) {
                        return ''
                    } else {
                        _displayedLabels.push(label)
                        return label
                    }
                })
            case HistoryDataProps.ONE_MONTH:
                return labels.map((label) => label.toLocaleString('default', { month: 'short', day: 'numeric' }))
        }
    }

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
                labels: formatLabels(),
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
                            return `${tooltipItem.value} ${$chartCurrency.toUpperCase()}`
                        },
                        label: function (tooltipItem) {
                            return labels[tooltipItem.index].toLocaleString([], {
                                year: 'numeric',
                                month: 'short',
                                day: '2-digit',
                                weekday: 'long',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: 'false',
                            })
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
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
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

<div class="relative" style="height: calc(50vh - 160px);"><canvas bind:this={canvas} width="600" height="250" /></div>
