<script lang="ts">
    import { AnimationEnum } from '@auxiliary/animation'
    import { Animation, Illustration } from 'shared/components'

    export let animation: AnimationEnum | undefined = undefined
    export let illustration: string | undefined = undefined
    export let classes: string = ''
    export let bgClasses: string = ''
</script>

<ledger-animation class="w-full h-full relative flex {classes}">
    <Animation animation={AnimationEnum.LedgerBgDesktop} classes="w-full h-full z-0 absolute {bgClasses}" />
    {#if animation}
        <Animation {animation} classes="z-0" />
    {:else if illustration}
        <Illustration {illustration} classes="z-0" />
    {/if}
</ledger-animation>
