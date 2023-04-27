<script lang="ts">
    import { Transition } from 'shared/components'
    import { RestoreFromMnemonicRoute } from './restore-from-mnemonic-route.enum'
    import { restoreFromMnemonicRoute, restoreFromMnemonicRouter } from './restore-from-mnemonic-router'
    import { InputMnemonicView } from './views'
    import { EncryptMnemonicView } from '../shared'
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
