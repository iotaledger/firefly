<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Text, Button, AccountInput } from 'shared/components'
    import { FontWeight } from 'shared/components/Text.svelte'
    import { closePopup } from '@lib/popup'
    import { IAccountState, setSelectedAccount } from '@core/account'

    export let onCancel: () => void
    export let onConfirm: () => void

    let account: IAccountState

    function onConfirmClick(): void {
        setSelectedAccount(account.id)
        onConfirm && onConfirm()
    }

    function onCancelClick(): void {
        closePopup()
        onCancel && onCancel()
    }
</script>

<activity-switcher-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type="h3" fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.deeplinkAccountSwitch.title')}
    </Text>
    <div class="flex flex-col space-y-4">
        <Text fontSize="15" color="gray-700" classes="text-left">{localize('popups.deeplinkAccountSwitch.body')}</Text>
        <AccountInput bind:account />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={onCancelClick}>{localize('actions.cancel')}</Button>
        <Button classes="w-full" onClick={onConfirmClick}>{localize('actions.confirm')}</Button>
    </popup-buttons>
</activity-switcher-popup>
