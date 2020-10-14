<script>
    import { onMount } from "svelte";
    import Chart from "chart.js";

    Chart.defaults.global.defaultFontFamily = 'DM Sans'

    function createChart() {
        // draws a rectangle with a rounded top
        Chart.helpers.drawRoundedTopRectangle = function(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            // top right corner
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            // bottom right	corner
            ctx.lineTo(x + width, y + height);
            // bottom left corner
            ctx.lineTo(x, y + height);
            // top left
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        };

        Chart.elements.RoundedTopRectangle = Chart.elements.Rectangle.extend({
            draw: function() {
                var ctx = this._chart.ctx;
                var vm = this._view;
                var left, right, top, bottom, signX, signY, borderSkipped;
                var borderWidth = vm.borderWidth;

                if (!vm.horizontal) {
                    // bar
                    left = vm.x - vm.width / 2;
                    right = vm.x + vm.width / 2;
                    top = vm.y;
                    bottom = vm.base;
                    signX = 1;
                    signY = bottom > top? 1: -1;
                    borderSkipped = vm.borderSkipped || 'bottom';
                } else {
                    // horizontal bar
                    left = vm.base;
                    right = vm.x;
                    top = vm.y - vm.height / 2;
                    bottom = vm.y + vm.height / 2;
                    signX = right > left? 1: -1;
                    signY = 1;
                    borderSkipped = vm.borderSkipped || 'left';
                }

                // Canvas doesn't allow us to stroke inside the width so we can
                // adjust the sizes to fit if we're setting a stroke on the line
                if (borderWidth) {
                    // borderWidth shold be less than bar width and bar height.
                    var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
                    borderWidth = borderWidth > barSize? barSize: borderWidth;
                    var halfStroke = borderWidth / 2;
                    // Adjust borderWidth when bar top position is near vm.base(zero).
                    var borderLeft = left + (borderSkipped !== 'left'? halfStroke * signX: 0);
                    var borderRight = right + (borderSkipped !== 'right'? -halfStroke * signX: 0);
                    var borderTop = top + (borderSkipped !== 'top'? halfStroke * signY: 0);
                    var borderBottom = bottom + (borderSkipped !== 'bottom'? -halfStroke * signY: 0);
                    // not become a vertical line?
                    if (borderLeft !== borderRight) {
                        top = borderTop;
                        bottom = borderBottom;
                    }
                    // not become a horizontal line?
                    if (borderTop !== borderBottom) {
                        left = borderLeft;
                        right = borderRight;
                    }
                }

                // calculate the bar width and roundess
                var barWidth = Math.abs(left - right);
                var roundness = this._chart.config.options.barRoundness || 0.5;
                var radius = barWidth * roundness * 0.5;

                // keep track of the original top of the bar
                var prevTop = top;

                // move the top down so there is room to draw the rounded top
                top = prevTop + radius;
                var barRadius = top - prevTop;

                ctx.beginPath();
                ctx.fillStyle = vm.backgroundColor;
                ctx.strokeStyle = vm.borderColor;
                ctx.lineWidth = borderWidth;

                // draw the rounded top rectangle
                Chart.helpers.drawRoundedTopRectangle(ctx, left, (top - barRadius + 1), barWidth, bottom - prevTop, barRadius);

                ctx.fill();
                if (borderWidth) {
                    ctx.stroke();
                }

                // restore the original top value so tooltips and scales still work
                top = prevTop;
            },
        });

        Chart.defaults.roundedBar = Chart.helpers.clone(Chart.defaults.bar);

        Chart.controllers.roundedBar = Chart.controllers.bar.extend({
            dataElementType: Chart.elements.RoundedTopRectangle
        });

        const ctx = document.getElementById("bar-chart");

        const myChart = new Chart(ctx, {
            type: "roundedBar",
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Incoming',
                    backgroundColor: '#3e95cd',
                    barThickness: 8,
                    data: [
                        12,
                        8,
                        13,
                        7,
                        8,
                        10
                    ]
                }, {
                    label: 'Outgoing',
                    backgroundColor: '#3cba9f',
                    barThickness: 8,
                    data: [
                        8,
                        6,
                        11,
                        4,
                        9,
                        6
                    ]
                }]
            },
            options: {
                barRoundness: 1,
                responsive: true,
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 15
                    }
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
                            maxTicksLimit: 4
                        },
                    }]
                },
            }
        });
    }

    onMount(createChart);
</script>


<canvas id="bar-chart" style="width:100%;height:100%;"></canvas>

