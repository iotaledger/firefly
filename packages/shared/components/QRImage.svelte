<!--
	@component QRImage, generates a QR code base65 gif data URI string
    and use it as background css url.
	
	@prop {string} [data] - Data to be converted.
	@prop {number} [size] - Image size, calculated with css ch.
-->
<script lang="typescript">
    import qrcode from 'qrcode-generator'
    import { appSettings } from 'shared/lib/appSettings'

    export let data = ''
    export let size = 5

    let qr
    let QRTag
    let background
    let foreground

    $: darkModeEnabled = $appSettings.darkMode
    $: data, create()

    const typeNumber = 0
    const errorCorrectionLevel = 'M'

    function create() {
        try {
            qr = qrcode(typeNumber, errorCorrectionLevel)
            qr.addData(data)
            qr.make()
            background = darkModeEnabled ? '25395f' : ''
            foreground = darkModeEnabled ? 'ffffff' : ''
            QRTag = qr.createDataURL(size, 0, background, foreground)
        } catch (e) {
            console.error(e)
        }
    }
</script>

<span style="background: url({QRTag}) no-repeat center; padding: {size * 1.8}ch;" />
