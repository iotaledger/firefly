<script>
    import { onMount } from "svelte";
    import Chart from "chart.js";

    Chart.defaults.global.elements.rectangle.borderWidth = 1;

    function createChart() {
        const ctx = document.getElementById("line-chart");

        const myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: ['25 oct', '26 oct', '26 oct', '27 oct', '28 oct', '29 oct'],
                datasets: [
                    {
                        backgroundColor: '#e1eaf9',
                        borderColor: '#108cff',
                        borderWidth: 2,
                        // Hide data points on line
                        pointRadius: 0,
                        data: [8, 15, 20, 20, 8, 13, 8]
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


<canvas id="line-chart"></canvas>

