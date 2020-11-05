<script>
    export let logo = null
    export let width = null
    export let height = null
    export let classes = null

    $: selected = logos[logo]

    const logos = {
        'logo-firefly-complete-vertical': 'firefly_logo_complete_vertical.svg',
        'logo-firefly-complete-horizontal': 'firefly_logo_complete_horizontal.svg',
        'logo-firefly': 'firefly_logo.svg',
        'profile-picture': 'profile_picture.svg'
    }
</script>

{#if selected}
    <img class={classes} width={width || '100%'} height={height || '100%'} src={`assets/logos/${selected}`} alt="" />
{/if}
