<script lang="ts">
    import { selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { isSoftwareProfile } from '@core/profile'
    import { setStrongholdPassword } from '@core/profile-manager'
    import { deleteAccount } from '@core/profile-manager/actions'
    import { TextType } from '@ui'
    import { Button, ButtonVariant, Error, HTMLButtonType, PasswordInput, Text } from 'shared/components'
    import { closeDrawer, DrawerId } from '../../lib/auxiliary/drawer'

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
            closeDrawer(DrawerId.DeleteAccount)
        } catch (err) {
            error = err.error
            handleError(err)
        }
    }
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <div class="space-y-4">
        <Text type={TextType.p} secondary classes="mb-5">{localize('popups.deleteAccount.body')}</Text>
        {#if $isSoftwareProfile}
            <Text type={TextType.p} secondary classes="mb-3">{localize('popups.deleteAccount.typePassword')}</Text>
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
    </div>

    <Button
        variant={ButtonVariant.Warning}
        classes="w-full"
        type={HTMLButtonType.Submit}
        disabled={(!password && $isSoftwareProfile) || isBusy}
        {isBusy}
        onClick={handleDeleteClick}
    >
        {localize('actions.deleteAccount')}
    </Button>
</div>
