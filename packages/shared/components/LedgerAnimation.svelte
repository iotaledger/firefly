<script lang="ts">
    import { AnimationEnum } from '@auxiliary/animation'
    import { IllustrationEnum } from '@auxiliary/illustration'
    import { Animation, Illustration } from 'shared/components'
    import { Icon } from '@auxiliary/icon'

    export let animation: AnimationEnum | undefined = undefined
    export let illustration: IllustrationEnum | undefined = undefined
    export let classes: string = ''
    export let bgClasses: string = ''
    export let iconNetwork: Icon | undefined = undefined
</script>

<ledger-animation class="w-full h-full relative flex {classes}">
    <Animation animation={AnimationEnum.LedgerBgDesktop} classes="w-full h-full z-0 absolute {bgClasses}" />
    {#if animation}
        <Animation {animation} classes="z-0" />
    {:else if illustration}
        <Illustration {illustration} zIndex={0} {iconNetwork} />
    {/if}
</ledger-animation>
