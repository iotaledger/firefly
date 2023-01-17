<script lang="typescript">
    import { deleteProfile } from '@contexts/settings'
    import { localize } from '@core/i18n'
    import { isSoftwareProfile } from '@core/profile'
    import { setStrongholdPassword } from '@core/profile-manager'
    import { Button, ButtonSize, ButtonVariant, PasswordInput, Text, TextType } from 'shared/components'
    import { isKeyboardOpen, keyboardHeight } from '../../../../../../../lib/auxiliary/keyboard'
    let isBusy = false
    let error = ''
    let password: string

    async function handleDeleteClick(): Promise<void> {
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

<div class="flex-1 flex flex-col justify-between space-y-4">
    <div class="flex flex-col space-y-4">
        <Text type={TextType.p}>{localize('popups.deleteProfile.confirmation')}</Text>
        {#if $isSoftwareProfile}
            <Text type={TextType.p} secondary classes="mb-3">{localize('popups.deleteProfile.typePassword')}</Text>
            <PasswordInput
                {error}
                classes="w-full mb-8"
                bind:value={password}
                showRevealToggle
                placeholder={localize('general.password')}
                autofocus
                submitHandler={handleDeleteClick}
                disabled={isBusy}
            />
        {/if}
    </div>
    <div style={$isKeyboardOpen && `margin-bottom: ${$keyboardHeight}px`}>
        <Button
            disabled={(!password && $isSoftwareProfile) || isBusy}
            classes="w-full"
            onClick={handleDeleteClick}
            variant={ButtonVariant.Warning}
            {isBusy}
        >
            {localize('actions.delete')}
        </Button>
    </div>
</div>
