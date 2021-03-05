<script lang="typescript">
    import { Button, Icon, Pin, Profile, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { activeProfile } from 'shared/lib/profile'
    import { validatePinFormat } from 'shared/lib/utils'
    import { api, getStoragePath, initialise } from 'shared/lib/wallet'
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile

    let attempts = 0
    let pinCode = ''
    let isBusy = false
    let pinRef

    /** Maximum number of consecutive (incorrect) attempts allowed to the user */
    const MAX_PINCODE_INCORRECT_ATTEMPTS = 3

    /** Waiting time in seconds after which a user should be allowed to enter pin again */
    const WAITING_TIME_AFTER_MAX_INCORRECT_ATTEMPTS = 30

    let timeRemainingBeforeNextAttempt = WAITING_TIME_AFTER_MAX_INCORRECT_ATTEMPTS

    $: hasCorrectFormat = validatePinFormat(pinCode)
    $: hasReachedMaxAttempts = attempts >= MAX_PINCODE_INCORRECT_ATTEMPTS

    let buttonText = setButtonText(timeRemainingBeforeNextAttempt)

    function setButtonText(time) {
        return locale('views.login.please_wait', { values: { time: time.toString() } })
    }

    const dispatch = createEventDispatcher()

    let timerId = null

    function countdown() {
        if (!hasReachedMaxAttempts) {
            return
        }

        if (timeRemainingBeforeNextAttempt == -1) {
            clearInterval(timerId)
            attempts = 0
            timeRemainingBeforeNextAttempt = WAITING_TIME_AFTER_MAX_INCORRECT_ATTEMPTS
        } else {
            buttonText = setButtonText(timeRemainingBeforeNextAttempt)
            timeRemainingBeforeNextAttempt--
        }
    }

    function onSubmit() {
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
                                onError(error) {
                                    isBusy = false
                                    console.error(error)
                                },
                            })
                        })
                    } else {
                        isBusy = false
                        attempts++
                        if (attempts >= MAX_PINCODE_INCORRECT_ATTEMPTS) {
                            clearInterval(timerId)
                            timerId = setInterval(countdown, 1000)
                        }
                        // This is necessary as the isBusy state change
                        // is required to be processed to enable the
                        // component before we can focus it
                        setTimeout(() => pinRef.focus(), 100)
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
            dispatch('previous')
        }
    }

    onDestroy(() => {
        clearInterval(timerId)
    })
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <div class="relative w-full h-full bg-white dark:bg-gray-900">
        <button
            data-label="back-button"
            class="absolute top-0 left-0 pl-5 pt-5 disabled:opacity-50 cursor-pointer disabled:cursor-auto"
            disabled={hasReachedMaxAttempts}
            on:click={handleBackClick}>
            <div class="flex items-center">
                <Icon icon="arrow-left" classes="text-blue-500" />
                <Text type="h4" classes="ml-6">{locale('general.profiles')}</Text>
            </div>
        </button>
        <div class="pt-40 pb-16 flex w-full h-full flex-col items-center justify-between">
            <div class="w-96 flex flex-row flex-wrap justify-center mb-20">
                <Profile name={$activeProfile.name} bgColor="blue" />
                <Pin
                    bind:this={pinRef}
                    bind:value={pinCode}
                    classes="mt-10"
                    on:submit={onSubmit}
                    disabled={hasReachedMaxAttempts || isBusy} />
                <Text type="p" bold classes="mt-4 text-center">
                    {attempts > 0 ? locale('views.login.incorrect_attempts', {
                              values: { attempts: attempts.toString() },
                          }) : locale('actions.enter_your_pin')}
                </Text>
            </div>
            <Button classes="w-96" disabled={!hasCorrectFormat || hasReachedMaxAttempts || isBusy} onClick={() => onSubmit()}>
                {hasReachedMaxAttempts ? buttonText : locale('actions.continue')}
            </Button>
        </div>
    </div>
{/if}
