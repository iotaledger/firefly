<script lang="ts">
    import { localize } from '@core/i18n'
    import { Text, Button, FontWeight, TextType } from 'shared/components'
    import { closePopup } from '@auxiliary/popup'
    import { selectedAccount, IAccountState, setSelectedAccount } from '@core/account'
    import { Modal, RecipientAccountSelector, AccountLabel } from 'shared/components'

    export let onCancel: () => void
    export let onConfirm: () => void

    let account: IAccountState | undefined = $selectedAccount
    let modal: Modal

    function onConfirmClick(): void {
        setSelectedAccount(account.index)
        onConfirm && onConfirm()
    }

    function onCancelClick(): void {
        closePopup()
        onCancel && onCancel()
    }

    function openModal(): void {
        modal?.open()
    }
</script>

<account-switcher-popup class="space-y-6 flex flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.deeplinkAccountSwitch.title')}
    </Text>
    <div class="flex flex-col space-y-4">
        <Text fontSize="15" color="gray-700" classes="text-left">{localize('popups.deeplinkAccountSwitch.body')}</Text>
        <account-input class="w-full h-full relative">
            <button on:click={openModal}>
                <AccountLabel {account} />
            </button>
            <RecipientAccountSelector bind:modal bind:selected={account} showBalance includeSelectedAccount />
        </account-input>
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancelClick}>{localize('actions.cancel')}</Button>
        <Button classes="w-full" onClick={onConfirmClick}>{localize('actions.confirm')}</Button>
    </popup-buttons>
</account-switcher-popup>

<style lang="scss">
    account-input {
        button {
            @apply w-full;
            @apply flex flex-row flex-1;
            @apply justify-between;
            @apply px-4 py-3;
            @apply rounded-lg;
            @apply border border-solid;
            @apply border-gray-300 hover:border-gray-500 focus:border-blue-500;
            @apply dark:border-gray-700 dark:hover:border-gray-700 dark:focus:border-gray-600;
        }
    }
</style>
