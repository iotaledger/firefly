<script lang="ts">
    import { Transition } from 'shared/components'
    import { CreateFromMnemonicRoute } from './create-from-mnemonic-route.enum'
    import { createFromMnemonicRoute } from './create-from-mnemonic-router'
    import { EncryptMnemonicView, VerifyMnemonicView, ViewMnemonicView } from './views'
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
        <EncryptMnemonicView />
    </Transition>
{/if}
