<script>
    import { api } from 'shared/lib/wallet'
    import { get } from 'svelte/store'
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { Icon, Text, Profile, Pin, Button } from 'shared/components'
    import { validatePinFormat } from 'shared/lib/utils'
    import { activeProfile } from 'shared/lib/profile'
    import { initialise, getStoragePath } from 'shared/lib/wallet'

    export let locale
    export let mobile

    const PincodeManager = window['Electron']['PincodeManager']

    let attempts = 0
    let pinCode = ''

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

            PincodeManager.verify(profile.id, pinCode.toString())
                .then((verified) => {
                    if (verified === true) {
                        return window['Electron'].getUserDataPath().then((path) => {
                            initialise(profile.id, getStoragePath(path, profile.name))
                            api.setStoragePassword(pinCode.toString(), {
                                onSuccess() {
                                    dispatch('next')
                                },
                                onError(error) {
                                    console.error(error)
                                },
                            })
                        })
                    } else {
                        attempts++
                        if (attempts >= MAX_PINCODE_INCORRECT_ATTEMPTS) {
                            clearInterval(timerId)
                            timerId = setInterval(countdown, 1000)
                        }
                    }
                })
                .catch((error) => {
                    console.error(error)
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
                <Pin bind:value={pinCode} classes="mt-10" on:submit={onSubmit} disabled={hasReachedMaxAttempts} />
                <Text type="p" bold classes="mt-4 text-center">
                    {attempts > 0 ? locale('views.login.incorrect_attempts', {
                              values: { attempts: attempts.toString() },
                          }) : locale('actions.enter_your_pin')}
                </Text>
            </div>
            <Button classes="w-96" disabled={!hasCorrectFormat || hasReachedMaxAttempts} onClick={() => onSubmit()}>
                {hasReachedMaxAttempts ? buttonText : locale('actions.continue')}
            </Button>
        </div>
    </div>
{/if}
