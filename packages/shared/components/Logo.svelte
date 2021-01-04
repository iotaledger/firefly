<script>
    export let logo = undefined
    export let width = undefined
    export let height = undefined
    export let classes = ''

    $: selected = logos[logo]

    const logos = {
        'logo-firefly-complete-vertical': 'firefly_logo_complete_vertical.svg',
        'logo-firefly-complete-horizontal': 'firefly_logo_complete_horizontal.svg',
        'logo-firefly': 'firefly_logo.svg',
        'profile-picture': 'profile_picture.svg', // TODO: remove
    }
</script>

{#if selected}
    <img
        data-label="logo"
        class={classes}
        width={width || '100%'}
        height={height || '100%'}
        src={`assets/logos/${selected}`}
        alt="" />
{/if}
