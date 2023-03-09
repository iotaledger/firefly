<script lang="ts">
    import { Animation, Illustration } from 'shared/components'

    export let animation: string = undefined
    export let illustration: string = undefined
    export let classes: string = ''
    export let bgClasses: string = ''
</script>

<ledger-animation class="w-full h-full relative flex {classes}">
    <Animation animation="ledger-bg-desktop" classes="w-full h-full z-0 absolute {bgClasses}" />
    {#if animation}
        <Animation {animation} classes="z-0" />
    {:else if illustration}
        <Illustration {illustration} classes="z-0" />
    {/if}
</ledger-animation>
