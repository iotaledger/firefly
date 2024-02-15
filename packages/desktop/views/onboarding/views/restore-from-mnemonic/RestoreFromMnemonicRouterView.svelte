<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { Transition } from '@ui'
    import { EncryptMnemonicView } from '../shared'
    import { RestoreFromMnemonicRoute, restoreFromMnemonicRoute, restoreFromMnemonicRouter } from '@core/router'
    import { InputMnemonicView } from './views'

    $: if (features.analytics.onboardingRoute.enabled && $restoreFromMnemonicRoute) {
        Platform.trackEvent('restore-from-mnemonic-route', { route: $restoreFromMnemonicRoute })
    }
</script>

{#if $restoreFromMnemonicRoute === RestoreFromMnemonicRoute.InputMnemonic}
    <Transition>
        <InputMnemonicView />
    </Transition>
{:else if $restoreFromMnemonicRoute === RestoreFromMnemonicRoute.EncryptMnemonic}
    <Transition>
        <EncryptMnemonicView router={$restoreFromMnemonicRouter} />
    </Transition>
{/if}
