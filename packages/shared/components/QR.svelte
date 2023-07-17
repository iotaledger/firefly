<script lang="ts">
    import { default as QrCode } from 'qrious'
    import { appSettings } from '@core/app'

    export let data: string

    $: color = $appSettings.darkMode ? '#ffffff' : '#000000'

    const QRcode = new QrCode()
    let QRImage = ''

    function generateQrCode(): void {
        QRcode.set({
            background: '#ffffff00',
            foreground: color,
            level: 'L',
            size: 200, // if this value is changed, the image gets some weird padding. Therefore we need to do the sizing with css
            value: data,
        })

        QRImage = QRcode.toDataURL('image/png')
    }

    $: if (data) {
        generateQrCode()
    }
</script>

<img src={QRImage} alt={data} width="135" height="135" />
