<script lang="typescript">
    import { Animation, Button, OnboardingLayout, PasswordInput, Spinner, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { profileBackupRouter } from '@core/router'
    import {
        backupInitialStronghold,
        onboardingProfile,
        updateOnboardingProfile,
        verifyAndStoreMnemonic,
    } from '@contexts/onboarding'

    export let busy = false

    let confirmPassword = ''
    let skipBackup = false

    $: isStrongholdPasswordValid = $onboardingProfile?.strongholdPassword === confirmPassword

    function onSkipBackupClick(): void {
        skipBackup = true
        $profileBackupRouter.next()
    }

    async function onBackupClick(): Promise<void> {
        if (isStrongholdPasswordValid) {
            try {
                skipBackup = false
                await verifyAndStoreMnemonic()
                await backupInitialStronghold()
                updateOnboardingProfile({ mnemonic: null })
                $profileBackupRouter.next()
            } catch (err) {
                console.error(err)
            }
        }
    }

    function onBackClick(): void {
        $profileBackupRouter.previous()
    }
</script>

<OnboardingLayout {onBackClick} {busy}>
    <div slot="title">
        <Text type="h2">{localize('views.backupWallet.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <form on:submit|preventDefault={onBackupClick} id="backup-form">
            <Text type="p" secondary classes="mb-8">{localize('views.backupWallet.body1')}</Text>
            <PasswordInput bind:value={confirmPassword} autofocus disabled={busy} showRevealToggle classes="mb-8" />
            <Text type="p" secondary classes="mb-4">{localize('views.backupWallet.body2')}</Text>
            <Text type="p" secondary smaller classes="mb-2">- {localize('views.backupWallet.reason1')}</Text>
            <Text type="p" secondary smaller classes="mb-2">- {localize('views.backupWallet.reason2')}</Text>
            <Text type="p" secondary smaller classes="mb-2">- {localize('views.backupWallet.reason3')}</Text>
        </form>
    </div>
    <div slot="leftpane__action">
        <Button secondary classes="w-full mb-4" disabled={busy} onClick={onSkipBackupClick}>
            {#if skipBackup && busy}
                <Spinner busy={true} message={localize('general.creatingProfile')} classes="justify-center" />
            {:else}{localize('actions.skipBackup')}{/if}
        </Button>
        <Button type="submit" form="backup-form" classes="w-full" disabled={!isStrongholdPasswordValid || busy}>
            {#if !skipBackup && busy}
                <Spinner busy={true} message={localize('general.creatingProfile')} classes="justify-center" />
            {:else}{localize('actions.saveBackup')}{/if}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-blue dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="backup-recovery-phrase-desktop" />
    </div>
</OnboardingLayout>
