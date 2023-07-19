<script lang="ts">
    import { AnimationEnum, AnimationRenderer } from '@auxiliary/animation'
    import { Animation, Text, ProgressBar } from 'shared/components'

    export let statusMessage = ''
    export let showProgressBar = false
    export let percent = 0
</script>

<div class={'flex flex-col justify-center align-center items-center w-full h-full'}>
    <Animation
        classes="h-64 w-64"
        animation={AnimationEnum.LoadingDesktop}
        loop={true}
        renderer={AnimationRenderer.Canvas}
    />
    {#if showProgressBar}
        <ProgressBar {percent} message={statusMessage} classes="max-w-md" />
    {:else if statusMessage}
        <Text type="p" classes="pt-8">{statusMessage}</Text>
    {/if}
</div>
