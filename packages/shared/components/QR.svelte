<script>
    import { onMount } from 'svelte'
    import QRCode from 'qrcode'

    export let value

    let qr = null

    onMount(async () => {
        qr = await QRCode.toString(value, {
            type: 'svg',
            width: 190,
            height: 190,
            color: {
                dark: '#000',
                light: '#fff',
            },
        })
    })
</script>

<style>
    qr {
        display: block;
        position: relative;
        margin: 0 auto;
    }
</style>

<qr>
    {@html qr}
</qr>
