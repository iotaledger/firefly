<script lang="typescript">
    import { appRoute, AppRoute } from '@core/router'
    import { Transition } from 'shared/components'

    export let transition = true
    export let route: AppRoute
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
