<script lang="typescript">
    import { AppRoute } from 'shared/lib/typings/routes'
    import { Transition } from 'shared/components'
    import { appRoute } from 'shared/lib/core/router/appRouter'

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
