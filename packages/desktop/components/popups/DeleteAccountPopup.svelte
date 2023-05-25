<script lang="ts">
    import { Button, PasswordInput, Text, Error, ButtonVariant, HTMLButtonType, TextHint, TextType } from '@ui'
    import { closeOverlay } from '@auxiliary/popup'
    import { localize } from '@core/i18n'
    import { setStrongholdPassword } from '@core/profile-manager'
    import { isSoftwareProfile } from '@core/profile'
    import { selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers/handleError'

    export let deleteAccount: (index: number) => Promise<void> = async () => {}

    let password: string
    let error: string
    let isBusy = false

    async function onDeleteClick(): Promise<void> {
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
            closeOverlay()
        } catch (err) {
            error = err.error
            handleError(err)
        }
    }

    function onCancelClick(): void {
        closeOverlay()
    }
</script>

<div class="mb-5">
    <Text type={TextType.h4}>
        {localize('popups.deleteAccount.title', {
            values: { name: $selectedAccount?.name },
        })}
    </Text>
</div>
<form on:submit|preventDefault={onDeleteClick} class="flex w-full flex-col space-y-5">
    <Text secondary>{localize('popups.deleteAccount.body')}</Text>
    <TextHint info text={localize('popups.deleteAccount.hint')} />
    <div class="flex w-full flex-col space-y-3">
        {#if $isSoftwareProfile}
            <Text secondary>{localize('popups.deleteAccount.typePassword')}</Text>
            <PasswordInput
                classes="w-full"
                bind:value={password}
                showRevealToggle
                placeholder={localize('general.password')}
                autofocus
                submitHandler={onDeleteClick}
                disabled={isBusy}
            />
        {/if}
        {#if error}
            <Error {error} />
        {/if}
    </div>
    <div class="flex flex-row w-full space-x-4 justify-center">
        <Button outline classes="w-1/2" onClick={onCancelClick} disabled={isBusy}>
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
