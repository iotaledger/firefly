<script lang="typescript">
    import { Button, Icon, OnboardingLayout, RecoveryPhrase, Text } from 'shared/components'
    import { english } from 'shared/lib/wordlists/english'
    import { createEventDispatcher, onMount } from 'svelte'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    export let mobile
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

    const generateRandomWord = (excludeWords) => {
        let word

        do {
            const wordIndex = Math.floor(Math.random() * english.length)
            if (!excludeWords.includes(english[wordIndex])) {
                word = english[wordIndex]
            }
        } while (!word)

        return word
    }

    const handleChoice = (word) => {
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

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} {busy}>
        <div slot="leftpane__content">
            {#if !verified}
                <Text type="h2" classes="mb-5">{locale('views.verifyRecoveryPhrase.title')}</Text>
                <Text type="p" secondary classes="mb-10">{locale('views.verifyRecoveryPhrase.body')}</Text>
                <Text type="p" classes="mb-4">{locale('views.verifyRecoveryPhrase.word')} #{verifyIndex + 1}</Text>

                {#each wordChoices as word}
                    <button
                        type="button"
                        class="w-full flex flex-row p-4 mb-4 rounded-2xl border border-1 border-solid items-center justify-between border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-gray-500 dark:focus:border-gray-700"
                        on:click={() => handleChoice(word)}>
                        <Text smaller classes="ml-3">{word}</Text>
                        <Icon icon="chevron-right" classes="text-gray-800 dark:text-white" />
                    </button>
                {/each}
            {:else}
                <div class="flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-5">
                    <div class="bg-green-100 rounded-2xl relative -top-10">
                        <Icon icon="success-check" classes="text-white" />
                    </div>
                    <Text type="h2" classes="mb-5 text-center">{locale('views.verifyRecoveryPhrase.verified')}</Text>
                    <Text type="p" secondary classes="mb-2">{locale('views.verifyRecoveryPhrase.verifiedBody')}</Text>
                </div>
            {/if}
        </div>
        <div slot="leftpane__action">
            {#if verified}
                <Button classes="w-full" onClick={() => handleContinue()} disabled={busy}>{locale('actions.continue')}</Button>
            {/if}
        </div>
        <div slot="rightpane" class="w-full h-full flex flex-col items-center justify-center p-4">
            <RecoveryPhrase classes="mb-8" recoveryPhrase={mnemonic} {verifyRecoveryPhrase} disabled={busy} />
        </div>
    </OnboardingLayout>
{/if}
