<script lang="typescript">
    import { Button, ColorPicker, Input, Text } from 'shared/components'
    import { getTrimmedLength } from 'shared/lib/helpers'
    import { localize } from '@core/i18n'
    import { activeProfile, isLedgerProfile, isSoftwareProfile } from '@core/profile'
    import { selectedAccount, tryEditSelectedAccountMetadata, validateAccountName } from '@core/account'
    import { promptUserToConnectLedger } from '@lib/ledger'
    import { closePopup, openPopup } from '@lib/popup'

    export let error = ''

    const { isStrongholdLocked } = $activeProfile

    let isBusy = false
    let accountAlias = $selectedAccount.name
    let color = $selectedAccount.color

    // This looks odd but sets a reactive dependency on accountAlias, so when it changes the error will clear
    $: accountAlias, (error = '')
    $: trimmedAccountAlias = accountAlias.trim()
    $: invalidAliasUpdate = !getTrimmedLength(accountAlias) || isBusy || accountAlias === $selectedAccount.name
    $: hasColorChanged = $selectedAccount.color !== color

    async function handleSaveClick(): Promise<void> {
        if (trimmedAccountAlias) {
            error = ''
            try {
                await validateAccountName(trimmedAccountAlias, true, trimmedAccountAlias !== $selectedAccount.name)
            } catch ({ message }) {
                error = message
                return
            }

            isBusy = true

            if ($isLedgerProfile) {
                promptUserToConnectLedger(_save, _cancel)
            } else if ($isSoftwareProfile && $isStrongholdLocked) {
                openPopup({ type: 'password', props: { onSuccess: _save } })
            } else {
                void _save()
            }
        }
    }

    function handleCancelClick(): void {
        closePopup()
    }

    async function _save(): Promise<void> {
        try {
            if (trimmedAccountAlias || color) {
                await tryEditSelectedAccountMetadata({ name: trimmedAccountAlias, color })
                closePopup()
            }
        } finally {
            isBusy = false
        }
    }

    function _cancel(): void {
        isBusy = false
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
                submitHandler={handleSaveClick}
                disabled={isBusy}
                classes="mb-4"
            />
            <ColorPicker title={localize('general.accountColor')} bind:active={color} classes="mb-4" />
        </div>
    </div>
    <!-- Action -->
    {#if isBusy && !error}
        <Text secondary classes="mb-3 text-center">{localize('general.updatingAccount')}</Text>
    {/if}
    {#if !isBusy}
        <div class="flex flex-row justify-between mt-2 px-2">
            <Button secondary classes="-mx-2 w-1/2" onClick={() => handleCancelClick()} disbled={isBusy}>
                {localize('actions.cancel')}
            </Button>
            <Button
                classes="-mx-2 w-1/2"
                onClick={() => handleSaveClick()}
                disabled={invalidAliasUpdate && !hasColorChanged}
            >
                {localize('actions.save')}
            </Button>
        </div>
    {/if}
</div>
