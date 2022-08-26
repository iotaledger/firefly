<script lang="typescript">
    import Chart from 'chart.js'
    import { AccountColor } from '@lib/typings/color'
    import tailwindConfig from 'shared/tailwind.config.js'
    import { afterUpdate, onMount } from 'svelte'
    import resolveConfig from 'tailwindcss/resolveConfig'

    export let labels = []
    export let datasets = []
    export let color = AccountColor.Blue.toString()
    export let inlineStyle = 'height: calc(50vh - 140px);'
    export let formatYAxis = (value: unknown): number => Number(value.toString())

    let canvas
    let chart

    const fullConfig = resolveConfig(tailwindConfig)

    function createRoundedBarChart() {
        // Source: https://stackoverflow.com/a/43281198/6682995
        Chart.helpers.drawRoundedTopRectangle = function (ctx, x, y, width, height, radius) {
            ctx.beginPath()
            ctx.moveTo(x + radius, y)
            ctx.lineTo(x + width - radius, y)
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
            ctx.lineTo(x + width, y + height)
            ctx.lineTo(x, y + height)
            ctx.lineTo(x, y + radius)
            ctx.quadraticCurveTo(x, y, x + radius, y)
            ctx.closePath()
        }

        Chart.elements.RoundedTopRectangle = Chart.elements.Rectangle.extend({
            draw: function () {
                const { ctx } = this._chart
                const vm = this._view

                let left, right, top, bottom, signX, signY, borderSkipped
                let { borderWidth } = vm

                if (!vm.horizontal) {
                    left = vm.x - vm.width / 2
                    right = vm.x + vm.width / 2
                    top = vm.y
                    bottom = vm.base
                    signX = 1
                    signY = bottom > top ? 1 : -1
                    borderSkipped = vm.borderSkipped || 'bottom'
                } else {
                    left = vm.base
                    right = vm.x
                    top = vm.y - vm.height / 2
                    bottom = vm.y + vm.height / 2
                    signX = right > left ? 1 : -1
                    signY = 1
                    borderSkipped = vm.borderSkipped || 'left'
                }

                if (borderWidth) {
                    const barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom))
                    borderWidth = borderWidth > barSize ? barSize : borderWidth
                    const halfStroke = borderWidth / 2

                    const borderLeft = left + (borderSkipped !== 'left' ? halfStroke * signX : 0)
                    const borderRight = right + (borderSkipped !== 'right' ? -halfStroke * signX : 0)
                    const borderTop = top + (borderSkipped !== 'top' ? halfStroke * signY : 0)
                    const borderBottom = bottom + (borderSkipped !== 'bottom' ? -halfStroke * signY : 0)

                    if (borderLeft !== borderRight) {
                        top = borderTop
                        bottom = borderBottom
                    }

                    if (borderTop !== borderBottom) {
                        left = borderLeft
                        right = borderRight
                    }
                }

                const barWidth = Math.abs(left - right)
                const roundness = this._chart.config.options.barRoundness || 0.5
                const radius = barWidth * roundness * 0.5

                const prevTop = top

                top = prevTop + radius
                const barRadius = top - prevTop

                ctx.beginPath()
                ctx.fillStyle = vm.backgroundColor
                ctx.strokeStyle = vm.borderColor
                ctx.lineWidth = borderWidth

                Chart.helpers.drawRoundedTopRectangle(
                    ctx,
                    left,
                    top - barRadius + 1,
                    barWidth,
                    bottom - prevTop,
                    barRadius
                )

                ctx.fill()
                if (borderWidth) {
                    ctx.stroke()
                }

                top = prevTop
            },
        })

        Chart.defaults.roundedBar = Chart.helpers.clone(Chart.defaults.bar)

        Chart.controllers.roundedBar = Chart.controllers.bar.extend({
            dataElementType: Chart.elements.RoundedTopRectangle,
        })
    }

    function createChart() {
        const ctx = canvas
        chart = new Chart(ctx, {
            type: 'roundedBar',
            data: {
                labels,
                datasets: datasets.map((dataset) => ({
                    backgroundColor: fullConfig.theme.colors[dataset.color]?.['500'] || color,
                    hoverBackgroundColor: fullConfig.theme.colors[dataset.color]?.['500'] || color,
                    barThickness: 7,
                    ...dataset,
                })),
            },
            options: {
                animation: false,
                barRoundness: 1,
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 15,
                    },
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
                            gridLines: {
                                display: false,
                                drawBorder: false,
                            },
                            ticks: {
                                display: false,
                                beginAtZero: true,
                                autoSkip: true,
                                maxTicksLimit: 4,
                                callback: function (value, index, values) {
                                    return formatYAxis(value)
                                },
                            },
                        },
                    ],
                },
                tooltips: {
                    mode: 'point',
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
            },
        })
    }

    onMount(() => {
        createRoundedBarChart()
        createChart()
    })

    afterUpdate(reinitialise)

    function reinitialise() {
        chart.destroy()
        createChart()
    }
</script>

<div class="relative" style={inlineStyle}><canvas bind:this={canvas} width="600" height="450" /></div>
