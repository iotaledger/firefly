<script lang="typescript">
    import { Button, PasswordInput, Text, Error, Spinner } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { localize } from '@core/i18n'
    import { setStrongholdPassword } from '@core/profile-manager'
    import { isSoftwareProfile } from '@core/profile'
    import { selectedAccount } from '@core/account'
    import { BaseError } from '@core/error'

    export let deleteAccount: (id: string) => Promise<void> = async () => {}
    export let hasMultipleAccounts: boolean

    let password: string
    let error: BaseError
    let isBusy = false

    async function handleDeleteClick(): Promise<void> {
        if (hasMultipleAccounts) {
            error = null
            isBusy = true
            await deleteStrongholdAccount(password)
            isBusy = false
        }
    }

    async function deleteStrongholdAccount(password: string): Promise<void> {
        try {
            if ($isSoftwareProfile) {
                await setStrongholdPassword(password)
            }
            await deleteAccount($selectedAccount?.id)
            closePopup()
        } catch (err) {
            error = !error && err.error ? new BaseError({ message: err.error, logToConsole: true }) : err
        }
    }

    function handleCancelClick(): void {
        closePopup()
    }
</script>

<div class="mb-5">
    <Text type="h4">
        {localize(`popups.deleteAccount.${hasMultipleAccounts ? 'title' : 'errorTitle'}`, {
            values: { name: $selectedAccount?.getAlias() },
        })}
    </Text>
</div>
<div class="flex w-full flex-row flex-wrap">
    {#if hasMultipleAccounts}
        <Text type="p" secondary classes="mb-5">{localize('popups.deleteAccount.body')}</Text>
        {#if $isSoftwareProfile}
            <Text type="p" secondary classes="mb-3">{localize('popups.deleteAccount.typePassword')}</Text>
            <PasswordInput
                classes="w-full mb-3"
                bind:value={password}
                showRevealToggle
                placeholder={localize('general.password')}
                autofocus
                submitHandler={handleDeleteClick}
                disabled={isBusy}
            />
        {/if}
        {#if error}
            <Error error={error.message} />
        {/if}
    {:else}
        <Error error={localize('popups.deleteAccount.errorBody1')} />
    {/if}
    <div class="flex flex-row w-full space-x-4 justify-center mt-5">
        <Button secondary classes="w-1/2" onClick={handleCancelClick} disabled={isBusy}>
            {localize(hasMultipleAccounts ? 'actions.cancel' : 'actions.close')}
        </Button>
        {#if hasMultipleAccounts}
            <Button
                warning
                classes="w-1/2"
                onClick={handleDeleteClick}
                type="submit"
                disabled={(!password && $isSoftwareProfile) || isBusy}
            >
                {#if isBusy}
                    <Spinner busy classes="justify-center" />
                {:else}
                    {localize('actions.deleteAccount')}
                {/if}
            </Button>
        {/if}
    </div>
</div>
