<script lang="ts">
    import { Transition } from 'shared/components'
    import { RestoreFromMnemonicRoute } from './restore-from-mnemonic-route.enum'
    import { restoreFromMnemonicRoute } from './restore-from-mnemonic-router'
    import { EncryptMnemonicView, InputMnemonicView } from './views'
</script>

{#if $restoreFromMnemonicRoute === RestoreFromMnemonicRoute.InputMnemonic}
    <Transition>
        <InputMnemonicView />
    </Transition>
{:else if $restoreFromMnemonicRoute === RestoreFromMnemonicRoute.EncryptMnemonic}
    <Transition>
        <EncryptMnemonicView />
    </Transition>
{/if}
