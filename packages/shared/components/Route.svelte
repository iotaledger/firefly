<script lang="typescript">
    import { AppRoute } from 'shared/lib/typings/routes'
    import { Transition } from 'shared/components'
    import { appRouter } from 'shared/lib/router'

    export let transition = true
    export let route: AppRoute

    const { routeStore } = $appRouter
    $: currentRoute = $routeStore
</script>

{#if currentRoute === route}
    {#if transition}
        <Transition>
            <slot />
        </Transition>
    {:else}
        <slot />
    {/if}
{/if}
