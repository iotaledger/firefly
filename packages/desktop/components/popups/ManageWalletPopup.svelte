<script lang="ts">
    import { closePopup } from '@auxiliary/popup'
    import { localize } from '@core/i18n'
    import { updateActiveWalletPersistedData } from '@core/profile/actions'
    import { getTrimmedLength } from '@core/utils'
    import { selectedWallet, validateWalletName } from '@core/wallet'
    import { Button, ColorPicker, Input, Text, TextType } from '@ui'

    export let error = ''

    let isBusy = false
    let walletAlias = $selectedWallet.name
    let color = $selectedWallet.color

    $: walletAlias, (error = '')
    $: trimmedWalletAlias = walletAlias.trim()
    $: invalidAliasUpdate = !getTrimmedLength(walletAlias) || isBusy || walletAlias === $selectedWallet.name
    $: hasColorChanged = $selectedWallet.color !== color

    async function onSaveClick(): Promise<void> {
        if (trimmedWalletAlias) {
            error = ''
            try {
                await validateWalletName(trimmedWalletAlias, true, trimmedWalletAlias !== $selectedWallet.name)
            } catch ({ message }) {
                error = message
                return
            }

            isBusy = true
            saveWalletPersistedData()
        }
    }

    function onCancelClick(): void {
        closePopup()
    }

    function saveWalletPersistedData(): void {
        try {
            if (trimmedWalletAlias || color) {
                updateActiveWalletPersistedData($selectedWallet?.id, { name: trimmedWalletAlias, color })
                closePopup()
            }
        } finally {
            isBusy = false
        }
    }
</script>

<manage-wallet-popup class="flex flex-col h-full justify-between space-y-4">
    <div>
        <title-container class="flex flex-row mb-6">
            <Text type={TextType.h5}>{localize('general.manageWallet')}</Text>
        </title-container>
        <manage-wallet-popup-inputs class="w-full flex flex-col justify-between space-y-4">
            <Input
                {error}
                bind:value={walletAlias}
                placeholder={localize('general.walletName')}
                autofocus
                submitHandler={onSaveClick}
                disabled={isBusy}
            />
            <ColorPicker title={localize('general.walletColor')} bind:active={color} isCustomColorEnabled />
        </manage-wallet-popup-inputs>
    </div>
    <manage-wallet-popup-actions class="flex flex-row justify-between mt-2 px-2">
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
    </manage-wallet-popup-actions>
</manage-wallet-popup>
