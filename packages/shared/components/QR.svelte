<script lang="typescript">
    import QrCode from 'svelte-qrcode'
    import { appSettings } from '@core/app'

    export let data
    export let size = 150
    export let classes

    $: darkModeEnabled = $appSettings.darkMode
</script>

<div class="flex justify-center {classes}">
    <QrCode
        value={data}
        background={darkModeEnabled ? '#25395F' : '#ffffff'}
        color={darkModeEnabled ? '#ffffff' : '#000000'}
        {size}
        padding="0"
    />
</div>
