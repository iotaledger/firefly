<script lang="typescript">
    import { createEventDispatcher, onMount } from 'svelte'
    import { Button, Icon, OnboardingLayout, RecoveryPhrase, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { english } from 'shared/lib/wordlists/english'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale
    export let mnemonic
    export let busy = false

    const verifyRecoveryPhrase = []
    let wordChoices = ['', '', '']
    let verifyIndex = 0
    let verified = false

    const fillChoices = () => {
        const currentIndex = verifyRecoveryPhrase.length
        const actualWord = mnemonic[currentIndex]
        const random1 = generateRandomWord(mnemonic)
        const random2 = generateRandomWord([...mnemonic, random1])

        wordChoices = [actualWord, random1, random2].sort(() => 0.5 - Math.random())
    }

    const generateRandomWord = (excludeWords: string[]) => {
        let word: string

        do {
            const wordIndex = Math.floor(Math.random() * english.length)
            if (!excludeWords.includes(english[wordIndex])) {
                word = english[wordIndex]
            }
        } while (!word)

        return word
    }

    const handleChoice = (word) => {
        if ($mobile) {
            const wordElement = document.getElementById(`recovery-word-${verifyIndex}`)
            wordElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        verifyRecoveryPhrase[verifyIndex] = word
        if (mnemonic[verifyIndex] === word) {
            if (verifyIndex === mnemonic.length - 1) {
                verified = true
            } else {
                verifyIndex++
                fillChoices()
            }
        }
    }

    const dispatch = createEventDispatcher()

    function handleContinue() {
        dispatch('next')
    }
    function handleBackClick() {
        dispatch('previous')
    }

    onMount(() => {
        fillChoices()
    })
</script>

<OnboardingLayout onBackClick={handleBackClick} {busy} reverseContent={$mobile && !verified}>
    <div slot="title">
        <Text type="h2" classes={!$mobile && verified && 'hidden'}>{locale('views.verifyRecoveryPhrase.title')}</Text>
    </div>
    <div slot="leftpane__content">
        {#if !verified}
            <Text type="p" secondary classes={!$mobile ? 'mb-10' : ''}>
                {locale('views.verifyRecoveryPhrase.body')}
            </Text>
            {#if !$mobile}
                <Text type="p" classes="mb-4">{locale('views.verifyRecoveryPhrase.word')} #{verifyIndex + 1}</Text>
                {#each wordChoices as word}
                    <button
                        type="button"
                        class="w-full flex flex-row p-4 mb-4 rounded-2xl border border-solid items-center justify-between border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-gray-500 dark:focus:border-gray-700"
                        on:click={() => handleChoice(word)}
                    >
                        <Text smaller classes="ml-3">{word}</Text>
                        <Icon icon="chevron-right" classes="text-gray-800 dark:text-white" />
                    </button>
                {/each}
            {/if}
        {:else}
            <div class="flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-5">
                <div class="bg-green-500 rounded-2xl relative -top-10">
                    <Icon icon="success-check" classes="text-white" />
                </div>
                <Text type="h2" classes="mb-5 text-center">{locale('views.verifyRecoveryPhrase.verified')}</Text>
                <Text type="p" secondary classes="mb-2">{locale('views.verifyRecoveryPhrase.verifiedBody')}</Text>
            </div>
        {/if}
    </div>
    <div slot="leftpane__action">
        {#if verified}
            <Button classes="w-full" onClick={() => handleContinue()} disabled={busy}>
                {locale('actions.continue')}
            </Button>
        {:else if $mobile && !verified}
            <Text type="p" classes="mb-4">{locale('views.verifyRecoveryPhrase.word')} #{verifyIndex + 1}</Text>
            {#each wordChoices as word}
                <button
                    type="button"
                    class="w-full flex flex-row p-4 mb-4 rounded-2xl border border-1 border-solid items-center justify-between border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-gray-500 dark:focus:border-gray-700"
                    on:click={() => handleChoice(word)}
                >
                    <Text smaller classes="ml-3">{word}</Text>
                    <Icon icon="chevron-right" classes="text-gray-800 dark:text-white" />
                </button>
            {/each}
        {/if}
    </div>
    <div
        slot="rightpane"
        class="w-full h-full flex flex-col items-center justify-center {$mobile ? 'my-4 p-0' : 'p-4'}"
    >
        {#if ($mobile && !verified) || !$mobile}
            <RecoveryPhrase classes="mb-8" recoveryPhrase={mnemonic} {verifyRecoveryPhrase} disabled={busy} />
        {/if}
    </div>
</OnboardingLayout>
