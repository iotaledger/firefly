<script>
    import { api } from 'shared/lib/wallet'

    import { createEventDispatcher, onDestroy } from 'svelte'
    import { OnboardingLayout, Illustration, Icon, Text, Profile, Pin, Button } from 'shared/components'
    import { validatePinFormat } from 'shared/lib/utils'
    import { getActiveProfile } from 'shared/lib/app'
    import { initialise } from 'shared/lib/wallet'

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

    $: hasCorrectLength = Number.isInteger(pinCode) && `${pinCode}`.length === 6
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

    function handleContinueClick() {
        if (!validatePinFormat(pinCode)) {
            attempts++
            if (attempts >= MAX_PINCODE_INCORRECT_ATTEMPTS) {
                clearInterval(timerId)
                timerId = setInterval(countdown, 1000)
            }
        } else {
            const profile = getActiveProfile();

            PincodeManager.verify(profile.id, pinCode.toString())
                .then((verified) => {
                    if (verified === true) {
                        initialise(profile.id, profile.name)

                        api.setStoragePassword(pinCode.toString(), {
                            onSuccess() {
                                dispatch('next')
                            },
                            onError(error) {
                                console.error(error)
                            },
                        })
                    } else {
                        console.info('Incorrect pincode provided!')
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }

    function handleBackClick() {
        dispatch('previous')
    }

    onDestroy(() => {
        clearInterval(timerId)
    })
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <div class="relative w-full h-full bg-white dark:bg-blue-900">
        <div data-label="back-button" class="absolute top-0 left-0 pl-5 pt-5" on:click={handleBackClick}>
            <div class="flex items-center">
                <Icon icon="arrow-left" classes="cursor-pointer text-blue-500" />
                <Text type="h4" classes="ml-6 cursor-pointer">{locale('general.profiles')}</Text>
            </div>
        </div>
        <div class="bg-white pt-40 pb-16 flex w-full h-full flex-col items-center justify-center">
            <div class="flex-1 w-96">
                <Profile name={getActiveProfile().name} />
                <Pin bind:value={pinCode} classes="mt-10" />
                <Text type="p" bold classes="mt-4 text-center">
                    {attempts > 0 ? locale('views.login.incorrect_attempts', {
                              values: { attempts: attempts.toString() },
                          }) : locale('actions.enter_your_pin')}
                </Text>
            </div>
            <Button classes="w-96" disabled={!hasCorrectLength || hasReachedMaxAttempts} onClick={() => handleContinueClick()}>
                {hasReachedMaxAttempts ? buttonText : locale('actions.continue')}
            </Button>
        </div>
    </div>
{/if}
