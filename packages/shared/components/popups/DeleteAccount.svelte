<script lang="typescript">
    import { Button, PasswordInput, Text, Error, ButtonVariant, HTMLButtonType } from 'shared/components'
    import { closePopup } from '@auxiliary/popup'
    import { localize } from '@core/i18n'
    import { setStrongholdPassword } from '@core/profile-manager'
    import { isSoftwareProfile } from '@core/profile'
    import { selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers/handleError'

    export let deleteAccount: (index: number) => Promise<void> = async () => {}

    let password: string
    let error: string
    let isBusy = false

    async function handleDeleteClick(): Promise<void> {
        error = null
        isBusy = true
        await deleteStrongholdAccount(password)
        isBusy = false
    }

    async function deleteStrongholdAccount(password: string): Promise<void> {
        try {
            if ($isSoftwareProfile) {
                await setStrongholdPassword(password)
            }
            await deleteAccount($selectedAccount?.index)
            closePopup()
        } catch (err) {
            error = err.error
            handleError(err)
        }
    }

    function handleCancelClick(): void {
        closePopup()
    }
</script>

<div class="mb-5">
    <Text type="h4">
        {localize('popups.deleteAccount.title', {
            values: { name: $selectedAccount?.name },
        })}
    </Text>
</div>
<form on:submit|preventDefault={handleDeleteClick} class="flex w-full flex-row flex-wrap">
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
        <Error {error} />
    {/if}
    <div class="flex flex-row w-full space-x-4 justify-center mt-5">
        <Button outline classes="w-1/2" onClick={handleCancelClick} disabled={isBusy}>
            {localize('actions.cancel')}
        </Button>
        <Button
            variant={ButtonVariant.Warning}
            classes="w-1/2"
            type={HTMLButtonType.Submit}
            disabled={(!password && $isSoftwareProfile) || isBusy}
            {isBusy}
        >
            {localize('actions.deleteAccount')}
        </Button>
    </div>
</form>
