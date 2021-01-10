<script>
    import { onMount, afterUpdate } from 'svelte'
    import Chart from 'chart.js'

    let canvas
    let chart

    export let labels
    export let data

    afterUpdate(reinitialise)

    function createChart() {
        const ctx = canvas
        const context = ctx.getContext('2d')

        const gradient = context.createLinearGradient(
            context.canvas.width / 2,
            0,
            context.canvas.width / 2,
            context.canvas.height / 1.2
        )

        gradient.addColorStop(0, '#DAE7FF')
        gradient.addColorStop(1, 'rgba(238, 242, 250, 0)')

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        backgroundColor: gradient,
                        borderColor: '#108cff',
                        borderWidth: 2,
                        // Hide data points on line
                        pointRadius: 0,
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
                scales: {
                    xAxes: [
                        {
                            offset: true,
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
                                callback: function (value, index, values) {
                                    return value.toFixed(3)
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

    onMount(createChart)
</script>

<div class="chart-container" style="position: relative; height: 28.5vh; width: 49vw"><canvas bind:this={canvas} /></div>
