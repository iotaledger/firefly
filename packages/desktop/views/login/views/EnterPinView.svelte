<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { showAppNotification } from '@auxiliary/notification'
    import { PopupId, openPopup, popupState } from '@auxiliary/popup'
    import { showBalanceOverviewPopup } from '@contexts/dashboard/stores'
    import {
        Platform,
        isLatestStrongholdVersion,
        needsToAcceptLatestPrivacyPolicy,
        needsToAcceptLatestTermsOfService,
    } from '@core/app'
    import { localize } from '@core/i18n'
    import { NetworkId } from '@core/network/enums'
    import { ProfileType, activeProfile, login, migrateDbChrysalisToStardust, resetActiveProfile } from '@core/profile'
    import { loginRouter } from '@core/router'
    import { isValidPin } from '@core/utils'
    import features from '@features/features'
    import { Icon, InitProfileActionsModal, MeatballMenuButton, Modal, PinInput, Profile, Text, TextHint } from '@ui'
    import { TextHintVariant } from 'shared/components/enums'
    import { onDestroy } from 'svelte'

    let attempts: number = 0
    let pinCode: string = ''
    let isBusy: boolean = false
    let pinRef: PinInput
    let shake: boolean = false

    /** Maximum number of consecutive (incorrect) attempts allowed to the user */
    const MAX_PINCODE_INCORRECT_ATTEMPTS = 3

    /** Waiting time in seconds after which a user should be allowed to enter pin again */
    const WAITING_TIME_AFTER_MAX_INCORRECT_ATTEMPTS = 30

    let timeRemainingBeforeNextAttempt: number = WAITING_TIME_AFTER_MAX_INCORRECT_ATTEMPTS
    let buttonText: string = getButtonText(timeRemainingBeforeNextAttempt)
    let maxAttemptsTimer: ReturnType<typeof setTimeout> = null
    let shakeTimeout: ReturnType<typeof setTimeout> = null
    let modal: Modal

    $: if (needsToAcceptLatestPrivacyPolicy() || needsToAcceptLatestTermsOfService()) {
        openPopup({
            id: PopupId.LegalUpdate,
            hideClose: true,
            preventClose: true,
        })
    }
    $: updateRequired =
        $activeProfile?.type === ProfileType.Software &&
        !isLatestStrongholdVersion($activeProfile?.strongholdVersion) &&
        features.onboarding.strongholdVersionCheck.enabled

    $: hasReachedMaxAttempts = attempts >= MAX_PINCODE_INCORRECT_ATTEMPTS
    $: {
        if (isValidPin(pinCode)) {
            void onSubmit()
        }
    }
    $: {
        if (pinRef && !$popupState.active) {
            pinRef.focus()
        }
    }

    function getButtonText(time: number): string {
        return localize('views.login.pleaseWait', { values: { time: time.toString() } })
    }

    function setShakeTimeout(): void {
        shakeTimeout = setTimeout(() => {
            shake = false
            isBusy = false
            attempts++
            if (attempts >= MAX_PINCODE_INCORRECT_ATTEMPTS) {
                clearInterval(maxAttemptsTimer)
                maxAttemptsTimer = setInterval(attemptCountdown, 1000)
            } else {
                pinRef.resetAndFocus()
            }
        }, 1000)
    }

    function attemptCountdown(): void {
        if (!hasReachedMaxAttempts) {
            return
        }

        if (timeRemainingBeforeNextAttempt === -1) {
            clearInterval(maxAttemptsTimer)
            attempts = 0
            timeRemainingBeforeNextAttempt = WAITING_TIME_AFTER_MAX_INCORRECT_ATTEMPTS
            pinRef.resetAndFocus()
        } else {
            buttonText = getButtonText(timeRemainingBeforeNextAttempt)
            timeRemainingBeforeNextAttempt--
        }
    }

    async function onSubmit(): Promise<void> {
        if (!hasReachedMaxAttempts) {
            isBusy = true

            const isPinCorrect = await Platform.PincodeManager.verify($activeProfile?.id, pinCode)
            if (isPinCorrect) {
                const _onSuccess = (): void => {
                    if (!updateRequired) {
                        void login()
                    }
                    $loginRouter.next()
                }
                if ($activeProfile?.needsChrysalisToStardustDbMigration) {
                    if ($activeProfile?.network?.id === NetworkId.IotaAlphanet) {
                        // if a profile needs DB migration and it on Alphanet it means it was created on Chrysalis Devnet
                        // and Devnet will not be upgraded to Stardust
                        showAppNotification({
                            type: 'error',
                            message: localize('error.profile.chrysalisDevnetStardustError'),
                        })
                        isBusy = false
                    } else {
                        const dbMigrationSuccess = await migrateDbChrysalisToStardust($activeProfile?.id, pinCode)
                        if (dbMigrationSuccess) {
                            showBalanceOverviewPopup.set(true)
                            _onSuccess()
                        } else {
                            isBusy = false
                        }
                    }
                } else {
                    _onSuccess()
                }
            } else {
                shake = true
                setShakeTimeout()
            }
        }
    }

    function onBackClick(): void {
        if (!hasReachedMaxAttempts) {
            resetActiveProfile()
            $loginRouter.previous()
        }
    }

    onDestroy(() => {
        clearInterval(maxAttemptsTimer)
        clearTimeout(shakeTimeout)
    })
</script>

<enter-pin-view class="block w-full h-full bg-white dark:bg-gray-900">
    <div class="flex w-full h-full justify-center items-center">
        <div class="w-96 flex flex-col flex-wrap items-center mb-20">
            <div class="flex justify-end w-full">
                <div class="max-h-7 max-w-9 overflow-visible relative">
                    <MeatballMenuButton onClick={modal?.toggle} />
                    <InitProfileActionsModal bind:modal />
                </div>
            </div>
            <div class="flex flex-col gap-8 w-full items-center">
                <Profile profile={$activeProfile} {updateRequired} />
                {#if updateRequired}
                    <TextHint variant={TextHintVariant.Warning} text={localize('views.login.hintStronghold')} />
                {/if}
                <div class="flex w-full items-center">
                    <div class="relative h-6">
                        <button
                            data-label="back-button"
                            class="absolute right-5 disabled:opacity-50 cursor-pointer disabled:cursor-auto"
                            disabled={hasReachedMaxAttempts}
                            on:click={onBackClick}
                        >
                            <Icon icon={IconEnum.ArrowLeft} classes="text-gray-500 dark:text-gray-100" />
                        </button>
                    </div>
                    <PinInput
                        bind:this={pinRef}
                        bind:value={pinCode}
                        classes={shake ? 'animate-shake' : ''}
                        on:submit={onSubmit}
                        disabled={hasReachedMaxAttempts || isBusy}
                        autofocus
                    />
                </div>
            </div>
            <Text bold classes="mt-4 text-center">
                {attempts > 0
                    ? localize('views.login.incorrectAttempts', {
                          values: { attempts: attempts.toString() },
                      })
                    : localize('actions.enterYourPin')}
            </Text>
            {#if hasReachedMaxAttempts}
                <Text error classes="mt-6">{buttonText}</Text>
            {/if}
        </div>
    </div>
</enter-pin-view>
