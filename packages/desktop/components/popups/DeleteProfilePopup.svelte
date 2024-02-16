<script lang="ts">
    import { Button, PasswordInput, Text, ButtonVariant } from '@ui'
    import { isSoftwareProfile } from '@core/profile'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import { deleteProfile } from '@contexts/settings'
    import { setStrongholdPassword } from '@core/wallet'

    let isBusy = false
    let error = ''
    let password: string

    async function onDeleteClick(): Promise<void> {
        isBusy = true
        error = ''

        try {
            await setStrongholdPassword(password)
            await deleteProfile()
        } catch (err) {
            error = localize(err.error)
        }

        isBusy = false
    }
</script>

<Text type="h4" classes="mb-5">{localize('popups.deleteProfile.title')}</Text>
<div class="w-full h-full mb-5">
    <Text classes="mb-3">{localize('popups.deleteProfile.confirmation')}</Text>
    {#if $isSoftwareProfile}
        <Text type="p" secondary classes="mb-3">{localize('popups.deleteProfile.typePassword')}</Text>
        <PasswordInput
            {error}
            classes="w-full mb-8"
            bind:value={password}
            showRevealToggle
            placeholder={localize('general.password')}
            autofocus
            submitHandler={onDeleteClick}
            disabled={isBusy}
        />
    {/if}
</div>
<div class="flex flex-row justify-between space-x-4 w-full">
    <Button outline classes="w-1/2" onClick={closePopup} disabled={isBusy}>{localize('actions.no')}</Button>
    <Button
        disabled={(!password && $isSoftwareProfile) || isBusy}
        classes="w-1/2"
        onClick={onDeleteClick}
        variant={ButtonVariant.Warning}
        {isBusy}
    >
        {localize('actions.yes')}
    </Button>
</div>
