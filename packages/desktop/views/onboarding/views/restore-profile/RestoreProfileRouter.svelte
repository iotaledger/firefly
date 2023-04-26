<script lang="ts">
    import { Transition } from '@ui'
    import { RestoreFromMnemonicRouter } from '../restore-from-mnemonic/'
    import { RestoreFromStrongholdRouter } from '../restore-from-stronghold'
    import { RestoreProfileRoute } from './restore-profile-route.enum'
    import { restoreProfileRoute } from './restore-profile-router'
    import { ChooseRestoreProfileFlowView } from './views'
    import { CreateFromLedgerRouter } from '../create-from-ledger'
    import { restoreProfileRouter } from '../restore-profile/restore-profile-router'
</script>

{#if $restoreProfileRoute === RestoreProfileRoute.ChooseRestoreProfileFlow}
    <Transition>
        <ChooseRestoreProfileFlowView />
    </Transition>
{:else if $restoreProfileRoute === RestoreProfileRoute.RestoreFromMnemonic}
    <Transition>
        <RestoreFromMnemonicRouter />
    </Transition>
{:else if $restoreProfileRoute === RestoreProfileRoute.RestoreFromStronghold}
    <Transition>
        <RestoreFromStrongholdRouter />
    </Transition>
{:else if $restoreProfileRoute === RestoreProfileRoute.RestoreFromLedger}
    <Transition>
        <CreateFromLedgerRouter router={$restoreProfileRouter} />
    </Transition>
{/if}
