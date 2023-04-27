<script lang="ts">
    import { Transition } from '@ui'
    import { CreateFromLedgerRouterView } from '../create-from-ledger'
    import { RestoreFromMnemonicRouterView } from '../restore-from-mnemonic/'
    import { RestoreFromStrongholdRouter } from '../restore-from-stronghold'
    import { restoreProfileRouter } from '../restore-profile/restore-profile-router'
    import { RestoreProfileRoute } from './restore-profile-route.enum'
    import { restoreProfileRoute } from './restore-profile-router'
    import { ChooseRestoreProfileFlowView, ClaimFinderView } from './views'
</script>

{#if $restoreProfileRoute === RestoreProfileRoute.ChooseRestoreProfileFlow}
    <Transition>
        <ChooseRestoreProfileFlowView />
    </Transition>
{:else if $restoreProfileRoute === RestoreProfileRoute.RestoreFromMnemonic}
    <Transition>
        <RestoreFromMnemonicRouterView />
    </Transition>
{:else if $restoreProfileRoute === RestoreProfileRoute.RestoreFromStronghold}
    <Transition>
        <RestoreFromStrongholdRouter />
    </Transition>
{:else if $restoreProfileRoute === RestoreProfileRoute.RestoreFromLedger}
    <Transition>
        <CreateFromLedgerRouterView router={$restoreProfileRouter} />
    </Transition>
{:else if $restoreProfileRoute === RestoreProfileRoute.ClaimFinder}
    <Transition>
        <ClaimFinderView />
    </Transition>
{/if}
