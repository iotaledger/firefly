<script lang="ts">
    import { closePopup } from '@auxiliary/popup'
    import { localize } from '@core/i18n'
    import { updateActiveAccountPersistedData } from '@core/profile/actions'
    import { getTrimmedLength } from '@core/utils'
    import { selectedWallet, validateWalletName } from '@core/wallet'
    import { Button, ColorPicker, Input, Text, TextType } from '@ui'

    export let error = ''

    let isBusy = false
    let accountAlias = $selectedWallet.name
    let color = $selectedWallet.color

    $: accountAlias, (error = '')
    $: trimmedAccountAlias = accountAlias.trim()
    $: invalidAliasUpdate = !getTrimmedLength(accountAlias) || isBusy || accountAlias === $selectedWallet.name
    $: hasColorChanged = $selectedWallet.color !== color

    async function onSaveClick(): Promise<void> {
        if (trimmedAccountAlias) {
            error = ''
            try {
                await validateWalletName(trimmedAccountAlias, true, trimmedAccountAlias !== $selectedWallet.name)
            } catch ({ message }) {
                error = message
                return
            }

            isBusy = true
            saveAccountPersistedData()
        }
    }

    function onCancelClick(): void {
        closePopup()
    }

    function saveAccountPersistedData(): void {
        try {
            if (trimmedAccountAlias || color) {
                updateActiveAccountPersistedData($selectedWallet?.id, { name: trimmedAccountAlias, color })
                closePopup()
            }
        } finally {
            isBusy = false
        }
    }
</script>

<manage-account-popup class="flex flex-col h-full justify-between space-y-4">
    <div>
        <title-container class="flex flex-row mb-6">
            <Text type={TextType.h5}>{localize('general.manageAccount')}</Text>
        </title-container>
        <manage-account-popup-inputs class="w-full flex flex-col justify-between space-y-4">
            <Input
                {error}
                bind:value={accountAlias}
                placeholder={localize('general.accountName')}
                autofocus
                submitHandler={onSaveClick}
                disabled={isBusy}
            />
            <ColorPicker title={localize('general.accountColor')} bind:active={color} isCustomColorEnabled />
        </manage-account-popup-inputs>
    </div>
    <manage-account-popup-actions class="flex flex-row justify-between mt-2 px-2">
        <Button outline classes="-mx-2 w-1/2" onClick={onCancelClick} disabled={isBusy}>
            {localize('actions.cancel')}
        </Button>
        <Button
            classes="-mx-2 w-1/2"
            onClick={onSaveClick}
            disabled={invalidAliasUpdate && !hasColorChanged}
            {isBusy}
            busyMessage={localize('general.updating')}
        >
            {localize('actions.save')}
        </Button>
    </manage-account-popup-actions>
</manage-account-popup>
