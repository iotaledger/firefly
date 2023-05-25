<script lang="ts">
    import { Button, ColorPicker, Input, Text, TextType } from '@ui'
    import { selectedAccount, tryEditSelectedAccountMetadata, validateAccountName } from '@core/account'
    import { localize } from '@core/i18n'
    import { getTrimmedLength } from '@core/utils'
    import { closeOverlay } from '@auxiliary/popup'

    export let error = ''

    let isBusy = false
    let accountAlias = $selectedAccount.name
    let color = $selectedAccount.color

    $: accountAlias, (error = '')
    $: trimmedAccountAlias = accountAlias.trim()
    $: invalidAliasUpdate = !getTrimmedLength(accountAlias) || isBusy || accountAlias === $selectedAccount.name
    $: hasColorChanged = $selectedAccount.color !== color

    async function onSaveClick(): Promise<void> {
        if (trimmedAccountAlias) {
            error = ''
            try {
                await validateAccountName(trimmedAccountAlias, true, trimmedAccountAlias !== $selectedAccount.name)
            } catch ({ message }) {
                error = message
                return
            }

            isBusy = true
            await saveAccountMetadata()
        }
    }

    function onCancelClick(): void {
        closeOverlay()
    }

    async function saveAccountMetadata(): Promise<void> {
        try {
            if (trimmedAccountAlias || color) {
                await tryEditSelectedAccountMetadata({ name: trimmedAccountAlias, color })
                closeOverlay()
            }
        } finally {
            isBusy = false
        }
    }
</script>

<manage-account-popup class="flex flex-col h-full justify-between">
    <div>
        <title-container class="flex flex-row mb-6">
            <Text type={TextType.h5}>{localize('general.manageAccount')}</Text>
        </title-container>
        <manage-account-popup-inputs class="w-full flex flex-col justify-between">
            <Input
                {error}
                bind:value={accountAlias}
                placeholder={localize('general.accountName')}
                autofocus
                submitHandler={onSaveClick}
                disabled={isBusy}
                classes="mb-4"
            />
            <ColorPicker
                title={localize('general.accountColor')}
                bind:active={color}
                classes="mb-4"
                isCustomColorEnabled
            />
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
