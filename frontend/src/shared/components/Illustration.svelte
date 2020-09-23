<script>
    export let illustration = null
    export let width = null
    export let height = null
    export let classes = null

    $: selected = illustrations[illustration]
    
    const illustrations = {
        'onboarding-1-mobile': 'onboarding/creature_onboarding_1_mobile.svg',
        'onboarding-1-desktop': 'onboarding/creature_onboarding_1_desktop.svg',
    }
</script>

{#if selected}
    <img class={classes} width={width || '100%'} height={height || '100%'} src={`../assets/illustrations/${selected}`} alt="" />
{/if}
