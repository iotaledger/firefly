<script lang="typescript">
    import { Icon, Pin, Profile, Text } from 'shared/components'
    import { initAppSettings, isAwareOfCrashReporting } from 'shared/lib/appSettings'
    import { ongoingSnapshot, openSnapshotPopup } from 'shared/lib/migration'
    import { showAppNotification } from 'shared/lib/notifications'
    import { Platform } from 'shared/lib/platform'
    import { openPopup, popupState } from 'shared/lib/popup'
    import { activeProfile, clearActiveProfile } from 'shared/lib/profile'
    import { validatePinFormat } from 'shared/lib/utils'
    import { api, getProfileDataPath, initialise } from 'shared/lib/wallet'
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { Locale } from '@core/i18n'
    import { get } from 'svelte/store'
    import {
        mobile,
        isKeyboardOpened,
        keyboardHeight,
        needsToAcceptLatestPrivacyPolicy,
        needsToAcceptLatestTos,
    } from '@lib/app'

    export let locale: Locale

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

    $: if (needsToAcceptLatestPrivacyPolicy() || needsToAcceptLatestTos()) {
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
        return locale('views.login.pleaseWait', { values: { time: time.toString() } })
    }

    const dispatch = createEventDispatcher()

    let maxAttemptsTimer = null
    let shakeTimeout = null

    function countdown() {
        if (!hasReachedMaxAttempts) {
            return
        }

        if (timeRemainingBeforeNextAttempt == -1) {
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
            const { sendCrashReports } = get(initAppSettings) ?? { sendCrashReports: false }

            isBusy = true

            Platform.PincodeManager.verify(profile.id, pinCode)
                .then((verified) => {
                    if (verified === true) {
                        return Platform.getMachineId().then((machineId) =>
                            getProfileDataPath(profile.id).then((path) => {
                                initialise(profile.id, path, sendCrashReports, machineId)
                                api.setStoragePassword(pinCode, {
                                    onSuccess() {
                                        dispatch('next')
                                    },
                                    onError(err) {
                                        isBusy = false
                                        showAppNotification({
                                            type: 'error',
                                            message: locale(err.error),
                                        })
                                    },
                                })
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
            clearActiveProfile()
            dispatch('previous')
        }
    }

    onDestroy(() => {
        clearInterval(maxAttemptsTimer)
        clearTimeout(shakeTimeout)
    })
</script>

<div class="relative w-full h-full bg-white dark:bg-gray-900">
    <button
        data-label="back-button"
        class="absolute {$mobile
            ? 'safe-area'
            : 'top-12'} left-5 disabled:opacity-50 cursor-pointer disabled:cursor-auto"
        disabled={hasReachedMaxAttempts}
        on:click={handleBackClick}
    >
        <div class="flex items-center space-x-3">
            <Icon icon="arrow-left" classes="text-blue-500" />
            <Text type="h5">{locale('general.profiles')}</Text>
        </div>
    </button>
    <div class="flex w-full h-full flex-col items-center {$mobile ? 'justify-end' : 'justify-between pt-40 pb-16 '}">
        <div
            class="flex flex-col items-center {$mobile ? 'w-full' : 'w-96 flex-wrap mb-20'}"
            style="padding-bottom: {$mobile
                ? $keyboardHeight + 15
                : 0}px; ; transition: padding 0.2s var(--transition-scroll)"
        >
            <Profile name={$activeProfile?.name} bgColor="blue" />
            <Pin
                bind:this={pinRef}
                bind:value={pinCode}
                classes="mt-10 {shake && 'animate-shake'}"
                on:submit={onSubmit}
                disabled={hasReachedMaxAttempts || isBusy}
                autofocus={!$mobile}
            />
            <Text type="p" bold classes="mt-4 text-center">
                {attempts > 0
                    ? locale('views.login.incorrectAttempts', {
                          values: { attempts: attempts.toString() },
                      })
                    : locale('actions.enterYourPin')}
            </Text>
            {#if hasReachedMaxAttempts}
                <Text error classes="mt-6">{buttonText}</Text>
            {/if}
        </div>
    </div>
</div>

<style type="text/scss">
    .safe-area {
        top: calc(env(safe-area-inset-top) + 20px);
    }
</style>
