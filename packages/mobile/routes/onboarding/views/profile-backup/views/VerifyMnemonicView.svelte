<script lang="typescript">
    import { onMount } from 'svelte'
    import { OnboardingLayout } from '../../../../../components'
    import { RecoveryPhrase } from '../../../../../components'
    import { Icon, Text } from 'shared/components'
    import { english } from '@auxiliary/wordlists'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { profileBackupRouter } from '@core/router'
    import { Mnemonic, onboardingProfile, verifyAndStoreMnemonic } from '@contexts/onboarding'

    export let busy = false

    const verifyRecoveryPhrase: Mnemonic = []

    let wordChoices = ['', '', '']
    let verifyIndex = 0
    let verified = false

    const wordElements: HTMLButtonElement[] = []
    const title = localize('views.onboarding.profileBackup.verifyMnemonic.title')

    $: if (verified) {
        completeVerification()
    }

    function fillChoices(): void {
        const currentIndex = verifyRecoveryPhrase.length
        const actualWord = $onboardingProfile?.mnemonic[currentIndex]
        const random1 = generateRandomWord($onboardingProfile?.mnemonic)
        const random2 = generateRandomWord([...$onboardingProfile?.mnemonic, random1])

        wordChoices = [actualWord, random1, random2].sort(() => 0.5 - Math.random())
    }

    function generateRandomWord(excludedWords: string[]): string {
        let word: string

        do {
            const wordIndex = Math.floor(Math.random() * english.length)
            if (!excludedWords.includes(english[wordIndex])) {
                word = english[wordIndex]
            }
        } while (!word)

        return word
    }

    function handleChoice(word: string): void {
        if ($mobile) {
            const wordElement = document.getElementById(`recovery-word-${verifyIndex}`)
            wordElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        verifyRecoveryPhrase[verifyIndex] = word
        if ($onboardingProfile?.mnemonic[verifyIndex] === word) {
            if (verifyIndex === $onboardingProfile?.mnemonic.length - 1) {
                verified = true
            } else {
                verifyIndex++
                fillChoices()
            }
        }
    }

    async function completeVerification(): Promise<void> {
        await verifyAndStoreMnemonic()
        $profileBackupRouter.next()
    }

    function onBackClick(): void {
        $profileBackupRouter.previous()
    }

    function onKeyPress(event: KeyboardEvent): void {
        if (!verified) {
            switch (event.key) {
                case '1':
                    wordElements[0].click()
                    break
                case '2':
                    wordElements[1].click()
                    break
                case '3':
                    wordElements[2].click()
                    break
                default:
                    break
            }
        }
    }

    onMount(() => {
        fillChoices()
    })
</script>

<svelte:window on:keypress={onKeyPress} />

<OnboardingLayout {onBackClick} {busy} {title}>
    <div slot="content" class="w-full h-full flex flex-col p-0">
        {#if !verified}
            <Text type="p" secondary classes="mb-4">
                {localize('views.onboarding.profileBackup.verifyMnemonic.body')}
            </Text>
        {:else}
            <div class="flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-5">
                <div class="bg-green-500 rounded-2xl relative -top-10">
                    <Icon icon="success-check" classes="text-white" />
                </div>
                <Text type="h2" classes="mb-5 text-center"
                    >{localize('views.onboarding.profileBackup.verifyMnemonic.verified')}</Text
                >
                <Text type="p" secondary classes="mb-2"
                    >{localize('views.onboarding.profileBackup.verifyMnemonic.verifiedBody')}</Text
                >
            </div>
        {/if}
        <RecoveryPhrase classes="mb-8" recoveryPhrase={$onboardingProfile?.mnemonic} {verifyRecoveryPhrase} />
    </div>
    <div slot="footer">
        {#if !verified}
            {#each wordChoices as word}
                <button
                    type="button"
                    class="w-full flex flex-row p-4 mb-4 rounded-2xl border border-1 border-solid items-center justify-between border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-gray-500 dark:focus:border-gray-700"
                    on:click={() => handleChoice(word)}
                >
                    <Text smaller classes="ml-3" bold>{word}</Text>
                    <Icon icon="chevron-right" classes="text-gray-800 dark:text-white" />
                </button>
            {/each}
        {/if}
    </div>
</OnboardingLayout>
