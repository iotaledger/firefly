<script lang="ts">
    import { Transition } from '@ui'
    import { CreateFromMnemonicRoute } from './create-from-mnemonic-route.enum'
    import { createFromMnemonicRoute, createFromMnemonicRouter } from './create-from-mnemonic-router'
    import { VerifyMnemonicView, ViewMnemonicView } from './views'
    import { EncryptMnemonicView } from '../shared'

    $: if (features.analytics.onboardingRoute.enabled && $createFromMnemonicRoute) {
        Platform.trackEvent('create-from-mnemonic-route', { route: $createFromMnemonicRoute })
    }
</script>

{#if $createFromMnemonicRoute === CreateFromMnemonicRoute.ViewMnemonic}
    <Transition>
        <ViewMnemonicView />
    </Transition>
{:else if $createFromMnemonicRoute === CreateFromMnemonicRoute.VerifyMnemonic}
    <Transition>
        <VerifyMnemonicView />
    </Transition>
{:else if $createFromMnemonicRoute === CreateFromMnemonicRoute.EncryptMnemonic}
    <Transition>
        <EncryptMnemonicView router={$createFromMnemonicRouter} />
    </Transition>
{/if}
