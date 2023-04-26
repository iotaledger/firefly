<script lang="ts">
    import { Transition } from '@ui'
    import { CreateFromLedgerRouter } from '../create-from-ledger'
    import { CreateFromMnemonicRouter } from '../create-from-mnemonic'
    import { CreateProfileRoute } from './create-profile-route.enum'
    import { createProfileRoute } from './create-profile-router'
    import { ChooseCreateProfileFlowView } from './views'
</script>

{#if $createProfileRoute === CreateProfileRoute.ChooseCreateProfileFlow}
    <Transition>
        <ChooseCreateProfileFlowView />
    </Transition>
{:else if $createProfileRoute === CreateProfileRoute.CreateFromMnemonic}
    <Transition>
        <CreateFromMnemonicRouter />
    </Transition>
{:else if $createProfileRoute === CreateProfileRoute.CreateFromLedger}
    <Transition>
        <CreateFromLedgerRouter />
    </Transition>
{/if}
