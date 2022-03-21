<script lang="typescript">
    import { HR } from 'shared/components'
    import { loggedIn, mobile } from 'shared/lib/app'
    import { isLedgerProfile } from 'shared/lib/profile'
    import { settingsChildRoute } from 'shared/lib/router'
    import { AdvancedSettings } from 'shared/lib/typings/routes'
    import {
        BalanceFinder,
        CrashReporting,
        DeepLinks,
        Diagnostics,
        ErrorLog,
        HiddenAccounts,
        MigrateLedgerIndex,
        NetworkConfiguration,
    } from './'

    const settings: {
        component: unknown
        childRoute: AdvancedSettings
        requireLogin?: boolean
        requireLedger?: boolean
    }[] = [
        { component: NetworkConfiguration, childRoute: AdvancedSettings.NetworkConfiguration, requireLogin: true },
        { component: DeepLinks, childRoute: AdvancedSettings.DeepLinks },
        { component: BalanceFinder, childRoute: AdvancedSettings.BalanceFinder, requireLogin: true },
        { component: HiddenAccounts, childRoute: AdvancedSettings.HiddenAccounts, requireLogin: true },
        { component: ErrorLog, childRoute: AdvancedSettings.ErrorLog },
        { component: CrashReporting, childRoute: AdvancedSettings.CrashReporting },
        { component: Diagnostics, childRoute: AdvancedSettings.Diagnostics },
        { component: MigrateLedgerIndex, childRoute: AdvancedSettings.MigrateLedgerIndex, requireLedger: true },
    ]
</script>

<div>
    {#each settings as { component, childRoute, requireLogin, requireLedger }, index}
        {#if (!requireLogin || (requireLogin && $loggedIn)) && (!requireLedger || (requireLedger && $isLedgerProfile)) && (!$mobile || ($mobile && $settingsChildRoute === childRoute))}
            <section id={childRoute} class="w-full sm:w-3/4">
                <svelte:component this={component} id={childRoute} />
            </section>
            {#if index < settings.length - 1}
                <HR classes="pb-5 mt-5 justify-center hidden md:block" />
            {/if}
        {/if}
    {/each}
</div>
