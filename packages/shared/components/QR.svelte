<script lang="typescript">
    import QRCode from 'qr.js/lib/QRCode'
    import { appSettings } from '@core/app'

    export let data
    export let size = 150
    export let classes

    let qr
    let cells

    $: darkModeEnabled = $appSettings.darkMode
    $: data, create()

    function create() {
        try {
            qr = new QRCode(-1, 1)
            qr.addData(data)
            qr.make()
            cells = qr.modules
        } catch (e) {
            console.error(e)
        }
    }
</script>

{#key data}
    {#if cells}
        <svg width={size} height={size} viewBox={`0 0 ${cells.length} ${cells.length}`} class={classes}>
            {#each cells as row, rowIndex}
                {#each row as cell, cellIndex}
                    <rect
                        height={1}
                        key={cellIndex}
                        style="fill: {cell ? (darkModeEnabled ? '#ffffff' : '#25395F') : 'none'};"
                        width={1}
                        x={cellIndex}
                        y={rowIndex}
                    />
                {/each}
            {/each}
        </svg>
    {/if}
{/key}

<style>
    svg {
        display: block;
        position: relative;
        margin: 0 auto;
    }
</style>
