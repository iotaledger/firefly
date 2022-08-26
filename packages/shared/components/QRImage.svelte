<!--
	@component QRImage, generates a QR code base64 gif data URI string
    and use it as background css url.
	
	@prop {string} [data] - Data to be converted. 
	@prop {number} [size] - Image size, calculated with css ch. (Default 6)
-->
<script lang="typescript">
    import qrcode from 'qrcode-generator'
    import { appSettings } from 'shared/lib/appSettings'

    export let data = ''
    export let size = 6

    let QRTag = ''

    $: darkModeEnabled = $appSettings.darkMode
    $: if (data) {
        create()
    }

    const typeNumber = 0
    const errorCorrectionLevel = 'M'

    function create() {
        try {
            const qr = qrcode(typeNumber, errorCorrectionLevel)
            qr.addData(data)
            qr.make()
            const background = ''
            const foreground = ''
            // Intentionally hidden as we'll need it in the future
            // const background = darkModeEnabled ? '25395f' : ''
            // const foreground = darkModeEnabled ? 'ffffff' : ''
            QRTag = qr.createDataURL(size, 0, background, foreground)
        } catch (e) {
            console.error(e)
        }
    }
</script>

<span style="background: url({QRTag}) no-repeat center; padding: {size * 2}ch;" />
