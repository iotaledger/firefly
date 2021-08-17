<script lang="typescript">
    import { Animation, Text } from 'shared/components'

    export let statusMessage = ''
</script>

<div class={'flex flex-col justify-center align-center items-center'}>
    <Animation classes="h-64 w-64" animation="loading-desktop" loop={true} renderer="canvas" />
    {#if statusMessage}
        <Text type="p" classes="pt-8">{statusMessage}</Text>
    {/if}
</div>
