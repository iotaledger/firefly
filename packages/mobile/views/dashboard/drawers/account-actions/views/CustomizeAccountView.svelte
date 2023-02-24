<script lang="ts">
    import { Button, ColorPicker, Input } from 'shared/components'
    import { selectedAccount, tryEditSelectedAccountMetadata, validateAccountName } from '@core/account'
    import { localize } from '@core/i18n'
    import { getTrimmedLength } from '@core/utils'

    export let onSuccess: () => void = () => {}

    let error = ''
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

    async function saveAccountMetadata(): Promise<void> {
        try {
            if (trimmedAccountAlias || color) {
                await tryEditSelectedAccountMetadata({ name: trimmedAccountAlias, color })
                onSuccess && onSuccess()
            }
        } finally {
            isBusy = false
        }
    }
</script>

<div class="flex flex-col space-y-4">
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
    <Button
        classes="w-full"
        onClick={onSaveClick}
        disabled={invalidAliasUpdate && !hasColorChanged}
        {isBusy}
        busyMessage={localize('general.updating')}
    >
        {localize('actions.save')}
    </Button>
</div>
