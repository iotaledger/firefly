<script>
    import { onMount } from "svelte";
    import Chart from "chart.js";

    function createChart() {
        const ctx = document.getElementById('line-chart');
        const context = ctx.getContext('2d');

        const gradient = context.createLinearGradient(
            context.canvas.width / 2,
            0,
            context.canvas.width / 2,
            context.canvas.height / 1.2
        );

        gradient.addColorStop(0, '#DAE7FF');
        gradient.addColorStop(1, 'rgba(238, 242, 250, 0)');

        const myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: ['25 oct', '26 oct', '26 oct', '27 oct', '28 oct', '29 oct'],
                datasets: [
                    {
                        backgroundColor: gradient,
                        borderColor: '#108cff',
                        borderWidth: 2,
                        // Hide data points on line
                        pointRadius: 0,
                        data: [8, 15, 17, 18, 8, 13, 8]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    // Hide label
                    display: false
                },
                scales: {
                    xAxes: [{
                        offset: true,
                        gridLines: {
                            display: false
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            autoSkip: true,
                            maxTicksLimit: 5
                        },
                    }]
                },
            }
        });
    }

    onMount(createChart);
</script>

<div class="chart-container" style="position: relative; height: 28.5vh;">
    <canvas id="line-chart"></canvas>
</div>
