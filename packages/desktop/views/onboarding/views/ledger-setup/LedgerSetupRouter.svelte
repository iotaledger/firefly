<script lang="ts">
    import { onMount } from 'svelte'
    import { Transition } from 'shared/components'
    import { ledgerSetupRoute, ledgerSetupRouter, LedgerSetupRoute } from '@core/router'
    import { ConnectLedgerView, LedgerInstallationGuideView } from './views'

    onMount(() => {
        $ledgerSetupRouter.restartIfNotInLedgerFlow()
    })
</script>

{#if $ledgerSetupRoute === LedgerSetupRoute.ConnectLedger}
    <Transition>
        <ConnectLedgerView />
    </Transition>
{:else if $ledgerSetupRoute === LedgerSetupRoute.LedgerInstallationGuide}
    <Transition>
        <LedgerInstallationGuideView />
    </Transition>
{/if}
