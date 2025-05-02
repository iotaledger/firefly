<script lang="ts">
    import { Button, PasswordInput, Text, HTMLButtonType } from 'shared/components'
    import { closePopup } from '@auxiliary/popup'
    import { localize } from '@core/i18n'
    import { activeProfile, migrateStrongholdFromActiveProfile, unlockStronghold } from '@core/profile'
    import {
        migrateStrongholdFromOnboardingProfile,
        restoreBackupFromStrongholdFile,
        StrongholdMigrationRequiredError,
    } from '@contexts/onboarding'
    import { CLIENT_ERROR_REGEXES, ClientError } from '@core/error'
    import { isLatestStrongholdVersion } from '@core/app'

    export let subtitle: string = ''
    export let returnPassword = false
    export let restoreBackupFromStronghold = false
    export let shouldMigrateStronghold: boolean = false

    export let onSuccess: (..._: any[]) => void = () => {}
    export let onCancelled: (..._: any[]) => void = () => {}

    let password: string
    let error = ''
    let isBusy = false

    async function onSubmit(): Promise<void> {
        try {
            isBusy = true
            if (isLatestStrongholdVersion($activeProfile?.strongholdVersion)) {
                await migrateStrongholdFromActiveProfile(password)
            }

            if (shouldMigrateStronghold) {
                await migrateStrongholdFromOnboardingProfile(password)
            }

            const response = restoreBackupFromStronghold
                ? await restoreBackupFromStrongholdFile(password)
                : await unlockStronghold(password)
            closePopup()
            onSuccess(returnPassword ? password : response)
        } catch (err) {
            if (err.message) {
                handleErrorMessage(err.message)
            } else if (CLIENT_ERROR_REGEXES[ClientError.InvalidStrongholdPassword].test(err?.error)) {
                error = localize('error.password.incorrect')
            } else if (CLIENT_ERROR_REGEXES[ClientError.MigrationRequired].test(err?.error)) {
                throw new StrongholdMigrationRequiredError()
            } else {
                error = localize(err)
            }
        } finally {
            isBusy = false
        }
    }
    function handleErrorMessage(message): void {
        try {
            const migrationError = JSON.parse(message).payload?.error
            if (migrationError && CLIENT_ERROR_REGEXES[ClientError.StrongholdMigration].test(migrationError)) {
                error = localize('error.password.incorrect')
            } else error = localize(migrationError ?? message)
        } catch {
            error = localize(message)
        }
    }

    function onCancelClick(): void {
        closePopup()
        if ('function' === typeof onCancelled) {
            onCancelled()
        }
    }
</script>

<div class="mb-5">
    <Text type="h4">{localize('popups.password.title')}</Text>
    <Text type="p" secondary>{subtitle ?? localize('popups.password.subtitle')}</Text>
</div>
<form
    id="password-popup-form"
    class="flex justify-center w-full flex-row flex-wrap"
    on:submit|preventDefault={onSubmit}
>
    <PasswordInput
        bind:error
        bind:value={password}
        classes="w-full mb-5"
        showRevealToggle
        placeholder={localize('general.password')}
        autofocus
    />
    <div class="flex flex-row justify-between w-full space-x-4">
        <Button outline classes="w-1/2" onClick={onCancelClick} disabled={isBusy}>
            {localize('actions.cancel')}
        </Button>
        <Button
            disabled={!password || password.length === 0 || isBusy}
            type={HTMLButtonType.Submit}
            classes="w-1/2"
            {isBusy}
        >
            {localize('actions.unlock')}
        </Button>
    </div>
</form>
