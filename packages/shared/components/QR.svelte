<script lang="ts">
    import { appSettings } from '@core/app'
    import { default as QrCode } from 'qrious'

    export let data: string

    $: color = $appSettings.darkMode ? '#ffffff' : '#000000'
    $: data && generateQrCode()

    const qrCode = new QrCode()
    let qrImage = ''

    function generateQrCode(): void {
        qrCode.set({
            background: '#ffffff00',
            foreground: color,
            level: 'L',
            size: 135,
            value: data,
        })

        qrImage = qrCode.toDataURL('image/png')
    }
</script>

<img src={qrImage} alt={data} />
