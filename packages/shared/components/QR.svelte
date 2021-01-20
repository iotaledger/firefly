<script>
    import { onMount } from 'svelte'
    import QRCode from 'qr.js/lib/QRCode'

    export let data

    let qr
    let cells

    onMount(() => {
        try {
            qr = new QRCode(-1, 1)
            qr.addData(data)
            qr.make()
            cells = qr.modules
        } catch (e) {
            console.error(e)
        }
    })
</script>

<style>
    svg {
        display: block;
        position: relative;
        margin: 0 auto;
    }
</style>

{#if cells}
    <svg width="150" height="150" viewBox={`0 0 ${cells.length} ${cells.length}`}>
        {#each cells as row, rowIndex}
            {#each row as cell, cellIndex}
                <rect
                    height={1}
                    key={cellIndex}
                    style="fill: {cell ? '#000000' : 'none'};"
                    width={1}
                    x={cellIndex}
                    y={rowIndex} />
            {/each}
        {/each}
    </svg>
{/if}
