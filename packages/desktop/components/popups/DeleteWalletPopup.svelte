<script lang="ts">
    import { Button, PasswordInput, Text, Error, ButtonVariant, HTMLButtonType, TextHint, TextType } from '@ui'
    import { closePopup } from '@auxiliary/popup'
    import { localize } from '@core/i18n'
    import { isSoftwareProfile } from '@core/profile'
    import { handleError } from '@core/error/handlers/handleError'
    import { TextHintVariant } from '@ui/enums'
    import { selectedWallet } from '@core/wallet/stores'
    import { setStrongholdPassword } from '@core/wallet/actions'

    export let deleteWallet: (walletId: string) => Promise<void> = async () => {}

    let password: string
    let error: string
    let isBusy = false

    async function onDeleteClick(): Promise<void> {
        error = null
        isBusy = true
        await deleteStrongholdWallet(password)
        isBusy = false
    }

    async function deleteStrongholdWallet(password: string): Promise<void> {
        try {
            if ($isSoftwareProfile) {
                await setStrongholdPassword(password)
            }
            await deleteWallet($selectedWallet.id)
            closePopup()
        } catch (err) {
            error = err.error
            handleError(err)
        }
    }

    function onCancelClick(): void {
        closePopup()
    }
</script>

<div class="mb-5">
    <Text type={TextType.h4}>
        {localize('popups.deleteWallet.title', {
            values: { name: $selectedWallet?.name },
        })}
    </Text>
</div>
<form on:submit|preventDefault={onDeleteClick} class="flex w-full flex-col space-y-5">
    <Text secondary>{localize('popups.deleteWallet.body')}</Text>
    <TextHint variant={TextHintVariant.Info} text={localize('popups.deleteWallet.hint')} />
    <div class="flex w-full flex-col space-y-3">
        {#if $isSoftwareProfile}
            <Text secondary>{localize('popups.deleteWallet.typePassword')}</Text>
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
            {localize('actions.deleteWallet')}
        </Button>
    </div>
</form>
