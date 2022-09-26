<script lang="typescript">
    import zxcvbn from 'zxcvbn'
    import { OnboardingLayout } from '../../../../../components'
    import { Animation, Button, PasswordInput, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { MAX_STRONGHOLD_PASSWORD_LENGTH } from '@core/profile'
    import { changeStrongholdPassword, setStrongholdPassword } from '@core/profile-manager'
    import { onboardingRouter } from '@core/router'
    import {
        onboardingProfile,
        ProfileSetupType,
        shimmerClaimingProfileManager,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { showAppNotification } from '@lib/notifications'
    import { PASSWORD_REASON_MAP } from '@core/stronghold'
    import { HTMLButtonType } from 'shared/components/Button.svelte'

    let strongholdPassword = ''
    let confirmedStrongholdPassword = ''
    let lastCheckedStrongholdPassword = ''
    let error = ''
    let errorConfirm = ''
    let busy = false

    $: passwordStrength = checkPasswordStrength(strongholdPassword) ?? passwordStrength
    $: strongholdPassword, confirmedStrongholdPassword, ((error = ''), (errorConfirm = ''))

    async function onContinueClick(): Promise<void> {
        error = ''
        errorConfirm = ''

        if (strongholdPassword.length > MAX_STRONGHOLD_PASSWORD_LENGTH) {
            error = localize('error.password.length', {
                values: {
                    length: MAX_STRONGHOLD_PASSWORD_LENGTH,
                },
            })
        } else if (passwordStrength?.score !== 4) {
            let errKey = 'error.password.tooWeak'
            if (passwordStrength?.feedback.warning && PASSWORD_REASON_MAP[passwordStrength?.feedback.warning]) {
                errKey = `error.password.${PASSWORD_REASON_MAP[passwordStrength?.feedback.warning]}`
            }
            error = localize(errKey)
        } else if (strongholdPassword !== confirmedStrongholdPassword) {
            errorConfirm = localize('error.password.doNotMatch')
        } else {
            try {
                busy = true

                const isClaimedProfileSetupType = $onboardingProfile?.setupType === ProfileSetupType.Claimed
                const mustChangePassword =
                    $onboardingProfile?.strongholdPassword &&
                    $onboardingProfile?.strongholdPassword !== strongholdPassword
                if (mustChangePassword) {
                    await changeStrongholdPassword($onboardingProfile?.strongholdPassword, strongholdPassword)
                    if (isClaimedProfileSetupType) {
                        await $shimmerClaimingProfileManager?.changeStrongholdPassword(
                            $onboardingProfile?.strongholdPassword,
                            strongholdPassword
                        )
                    }
                } else {
                    await setStrongholdPassword(strongholdPassword)
                    if (isClaimedProfileSetupType) {
                        await $shimmerClaimingProfileManager?.setStrongholdPassword(strongholdPassword)
                    }
                }

                updateOnboardingProfile({ strongholdPassword })
                $onboardingRouter.next()
            } catch (err) {
                console.error(err)
                showAppNotification({
                    type: 'error',
                    message: localize(err?.error),
                })
            } finally {
                busy = false
            }
        }
    }

    function onBackClick(): void {
        $onboardingRouter.previous()
    }

    function checkPasswordStrength(password: string): unknown {
        const NUMBER_OF_STRENGTH_VALIDATION_CHARS = 64
        const limitedPassword = password.substring(0, NUMBER_OF_STRENGTH_VALIDATION_CHARS - 1)
        const hasCheckedPasswordChanged = lastCheckedStrongholdPassword !== limitedPassword
        if (hasCheckedPasswordChanged) {
            lastCheckedStrongholdPassword = limitedPassword
            return zxcvbn(limitedPassword)
        }
    } // zxcvbn lib recommends to not validate long passwords because of performance issues https://github.com/dropbox/zxcvbn#user-content-performance
</script>

<OnboardingLayout {onBackClick} {busy}>
    <div slot="title">
        <Text type="h2">{localize('views.onboarding.strongholdSetup.setupStrongholdPassword.title')}</Text>
    </div>
    <div slot="illustration" class="w-full h-full flex justify-center">
        <Animation classes="setup-anim-aspect-ratio" animation="password-desktop" />
    </div>
    <div slot="content">
        <form on:submit|preventDefault={onContinueClick} id="password-form">
            <Text type="p" classes="mb-4" secondary
                >{localize('views.onboarding.strongholdSetup.setupStrongholdPassword.body1')}</Text
            >
            <Text type="p" classes="mb-10" secondary
                >{localize('views.onboarding.strongholdSetup.setupStrongholdPassword.body2')}</Text
            >
            <PasswordInput
                {error}
                classes="mb-4"
                bind:value={strongholdPassword}
                strengthLevels={4}
                showRevealToggle
                showStrengthLevel
                strength={passwordStrength?.score}
                autofocus
                disabled={busy}
            />
            <PasswordInput
                error={errorConfirm}
                bind:value={confirmedStrongholdPassword}
                classes="mb-5"
                placeholder={localize('general.confirmPassword')}
                showRevealToggle
                disabled={busy}
            />
        </form>
    </div>
    <div slot="footer">
        <Button
            type={HTMLButtonType.Submit}
            form="password-form"
            classes="w-full"
            disabled={!strongholdPassword || !confirmedStrongholdPassword || busy}
        >
            {localize('actions.continue')}
        </Button>
    </div>
</OnboardingLayout>
