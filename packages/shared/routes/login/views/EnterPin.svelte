<script lang="typescript">
    import { Icon, Pin, Profile, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { ongoingSnapshot, openSnapshotPopup } from 'shared/lib/migration'
    import { showAppNotification } from 'shared/lib/notifications'
    import { activeProfile, activeProfileId } from 'shared/lib/profile'
    import { validatePinFormat } from 'shared/lib/utils'
    import { api, getStoragePath, initialise } from 'shared/lib/wallet'
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { get } from 'svelte/store'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    export let mobile
    
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

    $: hasReachedMaxAttempts = attempts >= MAX_PINCODE_INCORRECT_ATTEMPTS
    $: {
        if (validatePinFormat(pinCode)) {
            void onSubmit()
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
        if (get(ongoingSnapshot) === true) {
            return openSnapshotPopup()
        }
        if (!hasReachedMaxAttempts) {
            const profile = get(activeProfile)

            isBusy = true

            Electron.PincodeManager.verify(profile.id, pinCode)
                .then((verified) => {
                    if (verified === true) {
                        return Electron.getUserDataPath().then((path) => {
                            initialise(profile.id, getStoragePath(path, profile.name))
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
            activeProfileId.set(null)
            dispatch('previous')
        }
    }

    onDestroy(() => {
        clearInterval(maxAttemptsTimer)
        clearTimeout(shakeTimeout)
    })
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <div class="relative w-full h-full bg-white dark:bg-gray-900">
        <button
            data-label="back-button"
            class="absolute top-12 left-5 disabled:opacity-50 cursor-pointer disabled:cursor-auto"
            disabled={hasReachedMaxAttempts}
            on:click={handleBackClick}>
            <div class="flex items-center space-x-3">
                <Icon icon="arrow-left" classes="text-blue-500" />
                <Text type="h5">{locale('general.profiles')}</Text>
            </div>
        </button>
        <div class="pt-40 pb-16 flex w-full h-full flex-col items-center justify-between">
            <div class="w-96 flex flex-col flex-wrap items-center mb-20">
                <Profile name={$activeProfile?.name} bgColor="blue" />
                <Pin
                    bind:this={pinRef}
                    bind:value={pinCode}
                    classes="mt-10 {shake && 'animate-shake'}"
                    on:submit={onSubmit}
                    disabled={hasReachedMaxAttempts || isBusy}
                    autofocus />
                <Text type="p" bold classes="mt-4 text-center">
                    {attempts > 0 ? locale('views.login.incorrectAttempts', {
                              values: { attempts: attempts.toString() },
                          }) : locale('actions.enterYourPin')}
                </Text>
                {#if hasReachedMaxAttempts}
                    <Text error classes="mt-6">{buttonText}</Text>
                {/if}
            </div>
        </div>
    </div>
{/if}
