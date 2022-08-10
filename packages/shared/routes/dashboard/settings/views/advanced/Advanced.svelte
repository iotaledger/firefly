<script lang="typescript">
    import { HR } from 'shared/components'
    import { activeProfile, isLedgerProfile } from '@core/profile'
    import { AdvancedSettingsRoute } from '@core/router'
    import {
        CrashReporting,
        DeepLinks,
        Diagnostics,
        ErrorLog,
        HiddenAccounts,
        MigrateLedgerIndex,
        NetworkConfiguration,
        WalletFinder,
    } from './'
    import features from 'shared/features/features'

    const settings: {
        component: unknown
        childRoute: AdvancedSettingsRoute
        requireLogin?: boolean
        requireLedger?: boolean
    }[] = [
        { component: NetworkConfiguration, childRoute: AdvancedSettingsRoute.NetworkConfiguration, requireLogin: true },
        { component: DeepLinks, childRoute: AdvancedSettingsRoute.DeepLinks },
        { component: WalletFinder, childRoute: AdvancedSettingsRoute.WalletFinder, requireLogin: true },
        { component: HiddenAccounts, childRoute: AdvancedSettingsRoute.HiddenAccounts, requireLogin: true },
        { component: ErrorLog, childRoute: AdvancedSettingsRoute.ErrorLog },
        { component: CrashReporting, childRoute: AdvancedSettingsRoute.CrashReporting },
        { component: Diagnostics, childRoute: AdvancedSettingsRoute.Diagnostics },
        { component: MigrateLedgerIndex, childRoute: AdvancedSettingsRoute.MigrateLedgerIndex, requireLedger: true },
    ]
    const visibleSettings = settings.filter((setting) => features?.settings?.advanced?.[setting.childRoute]?.enabled)

    const { loggedIn } = $activeProfile
</script>

<div>
    {#each visibleSettings as { component, childRoute, requireLogin, requireLedger }, index}
        {#if (!requireLogin || (requireLogin && $loggedIn)) && (!requireLedger || (requireLedger && $isLedgerProfile))}
            <section id={childRoute} class="w-full sm:w-3/4">
                <svelte:component this={component} id={childRoute} />
            </section>
            {#if index < visibleSettings.length - 1}
                <HR classes="pb-5 mt-5 justify-center" />
            {/if}
        {/if}
    {/each}
</div>
