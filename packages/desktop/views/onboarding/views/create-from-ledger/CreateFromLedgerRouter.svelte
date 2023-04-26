<script lang="ts">
    import { Transition } from '@ui'
    import { CreateFromLedgerRoute } from './create-from-ledger-route.enum'
    import { createFromLedgerRoute } from './create-from-ledger-router'
    import { ConnectLedgerView, InstallLedgerView } from './views'
</script>

{#if $createFromLedgerRoute === CreateFromLedgerRoute.InstallLedger}
    <Transition>
        <InstallLedgerView />
    </Transition>
{:else if $createFromLedgerRoute === CreateFromLedgerRoute.ConnectLedger}
    <Transition>
        <ConnectLedgerView />
    </Transition>
{/if}
