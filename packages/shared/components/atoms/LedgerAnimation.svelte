<script lang="typescript">
    import { Animation, Illustration } from 'shared/components'

    export let animation: string
    export let illustration: string
    export let classes: string = ''
</script>

<ledger-animation class="w-full h-full relative flex bg-white dark:bg-gray-900 {classes}">
    <Animation animation="ledger-bg-desktop" classes="w-full h-full z-0 absolute " />
    {#if animation}
        <Animation {animation} classes="z-10" />
    {/if}
    {#if illustration}
        <Illustration {illustration} classes="z-10" />
    {/if}
</ledger-animation>
