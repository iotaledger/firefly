<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { Transition } from '@ui'
    import { EncryptMnemonicView } from '../shared'
    import { createFromMnemonicRoute, createFromMnemonicRouter, CreateFromMnemonicRoute } from '@core/router'
    import { VerifyMnemonicView, ViewMnemonicView } from './views'

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
