<script lang="typescript">
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { Icon, PinInput, Profile, Text } from 'shared/components'
    import {
        isAwareOfCrashReporting,
        mobile,
        needsToAcceptLatestPrivacyPolicy,
        needsToAcceptLatestTermsOfService,
    } from '@core/app'
    import { localize } from '@core/i18n'
    import { COIN_TYPE, NetworkProtocol, NetworkType } from '@core/network'
    import { activeProfile, login, resetActiveProfile, getStorageDirectoryOfProfile } from '@core/profile'
    import { destroyProfileManager, initialiseProfileManager, TimeNotSyncedError } from '@core/profile-manager'
    import { ongoingSnapshot, openSnapshotPopup } from '@lib/migration'
    import { Platform } from '@lib/platform'
    import { openPopup, popupState } from '@lib/popup'
    import { validatePinFormat } from '@lib/utils'

    let attempts = 0
    let pinCode = ''
    let isBusy = false
    let pinRef
    let shake = false

    /** Maximum number of consecutive (incorrect) attempts allowed to the user */
    const MAX_PINCODE_INCORRECT_ATTEMPTS = 3

    /** Waiting time in seconds after which a user should be allowed to enter pin again */
    const WAITING_TIME_AFTER_MAX_INCORRECT_ATTEMPTS = 30

    let timeRemainingBeforeNextAttempt = WAITING_TIME_AFTER_MAX_INCORRECT_ATTEMPTS

    $: if (needsToAcceptLatestPrivacyPolicy() || needsToAcceptLatestTermsOfService()) {
        openPopup({
            type: 'legalUpdate',
            hideClose: true,
            preventClose: true,
        })
    }

    /**
     * NOTE: We check for mobile because it's only necessary
     * for existing desktop installation.
     */
    $: if ($popupState?.type === null && !$popupState?.active && !$mobile && !$isAwareOfCrashReporting) {
        openPopup({
            type: 'crashReporting',
            hideClose: true,
            preventClose: true,
        })
    }

    $: hasReachedMaxAttempts = attempts >= MAX_PINCODE_INCORRECT_ATTEMPTS
    $: {
        if (validatePinFormat(pinCode)) {
            void onSubmit()
        }
    }
    $: {
        if (pinRef && !$popupState.active) {
            pinRef.focus()
        }
    }

    let buttonText = setButtonText(timeRemainingBeforeNextAttempt)

    function setButtonText(time) {
        return localize('views.login.pleaseWait', { values: { time: time.toString() } })
    }

    const dispatch = createEventDispatcher()

    let maxAttemptsTimer = null
    let shakeTimeout = null

    function countdown() {
        if (!hasReachedMaxAttempts) {
            return
        }

        if (timeRemainingBeforeNextAttempt === -1) {
            clearInterval(maxAttemptsTimer)
            attempts = 0
            timeRemainingBeforeNextAttempt = WAITING_TIME_AFTER_MAX_INCORRECT_ATTEMPTS
            pinRef.resetAndFocus()
        } else {
            buttonText = setButtonText(timeRemainingBeforeNextAttempt)
            timeRemainingBeforeNextAttempt--
        }
    }

    function onSubmit() {
        if ($ongoingSnapshot === true) {
            return openSnapshotPopup()
        }
        if (!hasReachedMaxAttempts) {
            const profile = $activeProfile
            isBusy = true

            Platform.PincodeManager.verify(profile.id, pinCode)
                .then((verified) => {
                    if (verified === true) {
                        return Platform.getMachineId().then(() =>
                            getStorageDirectoryOfProfile(profile.id).then(async (path) => {
                                try {
                                    await initialiseProfileManager(path, COIN_TYPE[profile.networkProtocol])
                                    // TODO: set storage password with profile manager api
                                    // api.setStoragePassword(pinCode, {
                                    //     onSuccess() {
                                    //         dispatch('next')
                                    //     },
                                    //     onError(err) {
                                    //         isBusy = false
                                    //         showAppNotification({
                                    //             type: 'error',
                                    //             message: locale(err.error),
                                    //         })
                                    //     },
                                    // })
                                    void login()
                                    dispatch('next')
                                } catch (err) {
                                    if (err instanceof TimeNotSyncedError) {
                                        isBusy = false
                                        pinRef.resetAndFocus()
                                        destroyProfileManager()
                                    }
                                    console.error(err)
                                }
                            })
                        )
                    } else {
                        shake = true
                        shakeTimeout = setTimeout(() => {
                            shake = false
                            isBusy = false
                            attempts++
                            if (attempts >= MAX_PINCODE_INCORRECT_ATTEMPTS) {
                                clearInterval(maxAttemptsTimer)
                                maxAttemptsTimer = setInterval(countdown, 1000)
                            } else {
                                pinRef.resetAndFocus()
                            }
                        }, 1000)
                    }
                })
                .catch((error) => {
                    console.error(error)
                    isBusy = false
                })
        }
    }

    function handleBackClick() {
        if (!hasReachedMaxAttempts) {
            resetActiveProfile()
            dispatch('previous')
        }
    }

    onDestroy(() => {
        clearInterval(maxAttemptsTimer)
        clearTimeout(shakeTimeout)
    })
</script>

<div class="w-full h-full bg-white dark:bg-gray-900">
    <div class="flex w-full h-full justify-center items-center">
        <div class="w-96 flex flex-col flex-wrap items-center mb-20">
            <Profile
                name={$activeProfile?.name}
                networkType={$activeProfile?.networkType ?? NetworkType.Devnet}
                networkProtocol={$activeProfile?.networkProtocol ?? NetworkProtocol.Shimmer}
                bgColor="blue"
            />
            <div class="flex mt-18 w-full items-center">
                <div class="relative h-6">
                    <button
                        data-label="back-button"
                        class="absolute right-5 disabled:opacity-50 cursor-pointer disabled:cursor-auto"
                        disabled={hasReachedMaxAttempts}
                        on:click={handleBackClick}
                    >
                        <Icon icon="arrow-left" classes="text-gray-500 dark:text-gray-100" />
                    </button>
                </div>
                <PinInput
                    bind:this={pinRef}
                    bind:value={pinCode}
                    classes={shake && 'animate-shake'}
                    on:submit={onSubmit}
                    disabled={hasReachedMaxAttempts || isBusy}
                    autofocus
                />
            </div>
            <Text type="p" bold classes="mt-4 text-center">
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
</div>
