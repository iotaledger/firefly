<script lang="ts">
    import { activeProfile, isActiveLedgerProfile } from '@core/profile'
    import { CollectiblesSettingsRoute } from '@core/router'
    import features from '@features/features'
    import { HR } from '@ui'
    import MaxMediaSize from './MaxMediaSize.svelte'

    const settings: {
        component: unknown
        childRoute: CollectiblesSettingsRoute
        requireLogin?: boolean
        requireLedger?: boolean
    }[] = [{ component: MaxMediaSize, childRoute: CollectiblesSettingsRoute.MaxMediaSize }]
    const visibleSettings = settings.filter(
        (setting) => features?.settings?.collectibles?.[setting.childRoute]?.enabled
    )

    const { loggedIn } = $activeProfile
</script>

<div>
    {#each visibleSettings as { component, childRoute, requireLogin, requireLedger }, index}
        {#if (!requireLogin || (requireLogin && $loggedIn)) && (!requireLedger || (requireLedger && $isActiveLedgerProfile))}
            <section id={childRoute} class="w-full sm:w-3/4">
                <svelte:component this={component} />
            </section>
            {#if index < visibleSettings.length - 1}
                <HR classes="pb-5 mt-5 justify-center" />
            {/if}
        {/if}
    {/each}
</div>
