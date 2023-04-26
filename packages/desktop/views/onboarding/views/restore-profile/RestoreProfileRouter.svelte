<script lang="ts">
    import { Transition } from '@ui'
    import { RestoreProfileRoute } from './restore-profile-route.enum'
    import { ChooseRestoreProfileFlowView } from './views'
    import { restoreProfileRoute } from './restore-profile-router'
    import { RestoreFromMnemonicRouter } from '../restore-from-mnemonic/'
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
    <Transition>RestoreFromStronghold</Transition>
{:else if $restoreProfileRoute === RestoreProfileRoute.RestoreFromLedger}
    <Transition>RestoreFromLedger</Transition>
{/if}
