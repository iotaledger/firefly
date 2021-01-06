<script>
    import { onMount } from 'svelte'
    import Chart from 'chart.js'

    let canvas

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
                const ctx = this._chart.ctx
                const vm = this._view

                let left, right, top, bottom, signX, signY, borderSkipped
                let borderWidth = vm.borderWidth

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

                Chart.helpers.drawRoundedTopRectangle(ctx, left, top - barRadius + 1, barWidth, bottom - prevTop, barRadius)

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
        createRoundedBarChart()

        const ctx = canvas

        const myChart = new Chart(ctx, {
            type: 'roundedBar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Incoming',
                        backgroundColor: '#108CFF',
                        barThickness: 7,
                        data: [12, 8, 13, 7, 8, 10],
                    },
                    {
                        label: 'Outgoing',
                        backgroundColor: '#0FC1B7',
                        barThickness: 7,
                        data: [8, 6, 11, 4, 9, 6],
                    },
                ],
            },
            options: {
                barRoundness: 1,
                responsive: true,
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
                            ticks: {
                                beginAtZero: true,
                                autoSkip: true,
                                maxTicksLimit: 4,
                            },
                        },
                    ],
                },
            },
        })
    }

    onMount(createChart)
</script>

<div class="chart-container" style="position: relative; height: 100%;"><canvas bind:this={canvas} /></div>
