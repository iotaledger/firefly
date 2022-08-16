<script lang="typescript">
    import { Animation, Text, ProgressBar } from 'shared/components'

    export let statusMessage = ''
    export let showProgressBar = false
    export let percent = 0
</script>

<div class={'flex flex-col justify-center align-center items-center w-full h-full'}>
    <Animation classes="h-64 w-64" animation="loading-desktop" loop={true} renderer="canvas" />
    {#if showProgressBar}
        <ProgressBar {percent} message={statusMessage} classes="max-w-md" />
    {:else if statusMessage}
        <Text type="p" classes="pt-8">{statusMessage}</Text>
    {/if}
</div>
