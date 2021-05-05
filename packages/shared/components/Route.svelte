<script lang="typescript">
    import { Transition } from 'shared/components'
    import { appRoute } from 'shared/lib/router'

    export let transition = true
    export let route = undefined
</script>

{#if $appRoute === route}
    {#if transition}
        <Transition>
            <slot />
        </Transition>
    {:else}
        <slot />
    {/if}
{/if}
