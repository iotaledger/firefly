<script lang="typescript">
    import { default as QrCode } from 'qrious'
    import { appSettings } from '@core/app'
    import { onMount } from 'svelte'

    export let data: string
    export let classes: string = ''

    $: color = $appSettings.darkMode ? '#ffffff' : '#000000'

    const QRcode = new QrCode()
    let image = ''

    function generateQrCode(): void {
        QRcode.set({
            background: '#ffffff00',
            foreground: color,
            level: 'L',
            padding: 0,
            size: 200, // if this value is changed, the image gets some weird padding. Therefore we need to do the sizing with css
            value: data,
        })

        image = QRcode.toDataURL('image/png')
    }

    $: if (data) {
        generateQrCode()
    }

    onMount((): void => {
        generateQrCode()
    })
</script>

<div class="flex justify-center {classes}">
    <img src={image} alt={data} class="qrcode" />
</div>

<style lang="scss">
    .qrcode {
        width: 135px;
        height: 135px;
    }
</style>
