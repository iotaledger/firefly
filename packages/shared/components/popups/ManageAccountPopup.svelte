<script lang="typescript">
    import { Button, ColorPicker, Input, Text } from 'shared/components'
    import { getTrimmedLength } from 'shared/lib/helpers'
    import { localize } from '@core/i18n'
    import { selectedAccount, tryEditSelectedAccountMetadata, validateAccountName } from '@core/account'
    import { closePopup } from '@auxiliary/popup'

    export let error = ''

    let isBusy = false
    let accountAlias = $selectedAccount.name
    let color = $selectedAccount.color

    // This looks odd but sets a reactive dependency on accountAlias, so when it changes the error will clear
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
        closePopup()
    }

    async function saveAccountMetadata(): Promise<void> {
        try {
            if (trimmedAccountAlias || color) {
                await tryEditSelectedAccountMetadata({ name: trimmedAccountAlias, color })
                closePopup()
            }
        } finally {
            isBusy = false
        }
    }
</script>

<div class="flex flex-col h-full justify-between">
    <div>
        <div class="flex flex-row mb-6">
            <Text type="h5">{localize('general.manageAccount')}</Text>
        </div>
        <div class="w-full flex flex-col justify-between">
            <Input
                {error}
                bind:value={accountAlias}
                placeholder={localize('general.accountName')}
                autofocus
                submitHandler={onSaveClick}
                disabled={isBusy}
                classes="mb-4"
            />
            <ColorPicker title={localize('general.accountColor')} bind:active={color} classes="mb-4" />
        </div>
    </div>
    <!-- Action -->
    <div class="flex flex-row justify-between mt-2 px-2">
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
    </div>
</div>
