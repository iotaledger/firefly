<script lang="typescript">
    import { HR } from 'shared/components'
    import { loggedIn, mobile } from 'shared/lib/app'
    import { getOfficialNodes } from 'shared/lib/network'
    import { isLedgerProfile } from 'shared/lib/profile'
    import { settingsChildRoute } from 'shared/lib/router'
    import { AdvancedSettings } from 'shared/lib/typings/routes'
    import { buildAccountNetworkSettings, updateAccountNetworkSettings } from 'shared/lib/wallet'
    import {
        BalanceFinder,
        Diagnostics,
        ErrorLog,
        HiddenAccounts,
        MigrateLedgerIndex,
        NodeSettings,
        ProofOfWork,
    } from './'

    // TODO: wait for developer profile PR to polish this
    let {
        automaticNodeSelection,
        includeOfficialNodes,
        nodes,
        primaryNodeUrl,
        localPow,
    } = buildAccountNetworkSettings()

    let props = {}

    $: $settingsChildRoute, updateProps()

    $: {
        const officialNodes = getOfficialNodes()
        const nonOfficialNodes = nodes.filter((n) => !officialNodes.find((d) => d.url === n.url))

        if (includeOfficialNodes) {
            nodes = [...officialNodes, ...nonOfficialNodes]
        } else {
            nodes = [...nonOfficialNodes]
        }

        const allEnabled = nodes.filter((n) => !n.disabled)
        const primaryNode = allEnabled.find((n) => n.url === primaryNodeUrl)
        if (!primaryNode && allEnabled.length > 0) {
            primaryNodeUrl = allEnabled[0].url
        }
    }

    $: void updateAccountNetworkSettings(automaticNodeSelection, includeOfficialNodes, nodes, primaryNodeUrl, localPow)

    const settings: {
        component: unknown
        childRoute: AdvancedSettings
        requireLogin?: boolean
        requireLedger?: boolean
    }[] = [
        { component: NodeSettings, childRoute: AdvancedSettings.NodeSettings, requireLogin: true },
        { component: ProofOfWork, childRoute: AdvancedSettings.ProofOfWork, requireLogin: true },
        // { component: DeveloperMode, childRoute: AdvancedSettings.DeveloperMode, requireLogin: true },
        // { component: DeepLinks, childRoute: AdvancedSettings.DeepLinks },
        { component: BalanceFinder, childRoute: AdvancedSettings.BalanceFinder, requireLogin: true },
        { component: HiddenAccounts, childRoute: AdvancedSettings.HiddenAccounts, requireLogin: true },
        { component: ErrorLog, childRoute: AdvancedSettings.ErrorLog },
        { component: Diagnostics, childRoute: AdvancedSettings.Diagnostics },
        { component: MigrateLedgerIndex, childRoute: AdvancedSettings.MigrateLedgerIndex, requireLedger: true },
        // { component: StateExport, childRoute: AdvancedSettings.StateExport, requireLogin: true },
    ]

    function updateProps(): void {
        if ($settingsChildRoute === AdvancedSettings.NodeSettings) {
            props = { automaticNodeSelection, includeOfficialNodes, nodes, primaryNodeUrl }
        } else if ($settingsChildRoute === AdvancedSettings.ProofOfWork) {
            props = { localPow }
        } else {
            props = {}
        }
    }
</script>

<div>
    {#each settings as { component, childRoute, requireLogin, requireLedger }, index}
        {#if (!requireLogin || (requireLogin && $loggedIn)) && (!requireLedger || (requireLedger && $isLedgerProfile)) && (!$mobile || ($mobile && $settingsChildRoute === childRoute))}
            <svelte:component this={component} id={childRoute} {...props} />
            {#if index < settings.length - 1}
                <HR classes="pb-5 mt-5 justify-center hidden md:block" />
            {/if}
        {/if}
    {/each}
</div>
