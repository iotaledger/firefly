<script lang="ts">
    import { Transition } from 'shared/components'
    import { CreateProfileRoute } from './create-profile-route.enum'
    import { createProfileRoute } from './create-profile-router'
    import ChooseCreateProfileFlowView from './views/ChooseCreateProfileFlowView.svelte'
    import CreateFromMnemonicRouter from '../create-from-mnemonic/CreateFromMnemonicRouter.svelte'
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
    <Transition />
{/if}
