<script lang="typescript">
    import QRCode from 'qr.js/lib/QRCode'
    import { appSettings } from 'shared/lib/appSettings'

    export let data
    export let size = 150

    let cells

    const createCells = (): void => {
        try {
            const qr = new QRCode(-1, 1)

            /**
             * "For presentation, lowercase is usually preferable, but
             * inside QR codes uppercase SHOULD be used, as those permit
             * the use of alphanumeric mode, which is 45% more compact than
             * the normal byte mode." - BIP-0173
             */
            const qrData = typeof data === 'string' ? data.toUpperCase() : data
            qr.addData(qrData)
            qr.make()

            /* eslint-disable no-console */
            console.log('CREATE CELLS: ', qr.modules)

            cells = qr.modules
        } catch (err) {
            console.error(err)
        }
    }

    $: data, createCells()
</script>

<style>
    svg {
        display: block;
        position: relative;
        margin: 0 auto;
    }
</style>

{#key data}
    {#if cells}
        <svg width={size} height={size} viewBox={`0 0 ${cells.length} ${cells.length}`}>
            {#each cells as row, rowIndex}
                {#each row as cell, cellIndex}
                    <rect
                        height={1}
                        key={cellIndex}
                        style="fill: {cell ? ($appSettings.darkMode ? '#ffffff' : '#000000') : 'none'};"
                        width={1}
                        x={cellIndex}
                        y={rowIndex} />
                {/each}
            {/each}
        </svg>
    {/if}
{/key}
