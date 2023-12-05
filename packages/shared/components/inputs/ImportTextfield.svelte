<script lang="ts">
    import { Text } from 'shared/components'
    import { english } from '@auxiliary/wordlists'
    import { localize } from '@core/i18n'
    import { debounce } from '@core/utils'
    import { Mnemonic } from '@contexts/onboarding'
    import { verifyMnemonic } from '@core/secret-manager/utils'

    enum Type {
        Seed = 'seed',
        Mnemonic = 'mnemonic',
    }

    export let value: string
    export let type = Type.Mnemonic
    export let disabled = false
    export let minHeight: number = 200

    let statusMessage = ''
    let content = ''
    let error = false

    function checkSeed(value: string): string {
        if (value.length !== 81) {
            return localize('error.backup.seedTooShort', {
                values: {
                    length: value.length,
                },
            })
        }
        if (!/^[9A-Z]+$/.test(value)) {
            return localize('error.backup.seedCharacters')
        }
    }

    function checkMnemonic(words: Mnemonic): string {
        if (words.length !== 24) {
            return localize('error.backup.phraseWordCount', {
                values: {
                    length: words.length,
                },
            })
        }
        for (let i = 0; i < words.length; i++) {
            const includesWord = english.includes(words[i])
            const includesWordOtherCase = english.includes(words[i].toLowerCase())
            if (!includesWord && includesWordOtherCase) {
                return localize('error.backup.phraseCaseWord', {
                    values: {
                        word: words[i],
                    },
                })
            } else if (!includesWord) {
                return localize('error.backup.phraseUnrecognizedWord', {
                    values: {
                        word: words[i],
                    },
                })
            }
        }
    }

    async function handleKeyDown(): Promise<void> {
        value = ''
        statusMessage = ''
        error = false

        content = content.replace(/\r/g, ' ').replace(/\n/g, ' ').replace(/  +/g, ' ')

        const trimmedContent = content?.trim()

        if (trimmedContent.length >= 3) {
            const words = trimmedContent?.split(' ')
            if (type === Type.Seed) {
                const seedValidations = checkSeed(trimmedContent)
                if (seedValidations) {
                    statusMessage = seedValidations
                    error = true
                } else {
                    statusMessage = localize('views.importFromText.seedDetected')
                    value = trimmedContent
                }
            } else if (type === Type.Mnemonic) {
                const mnemonicValidations = checkMnemonic(words)
                if (mnemonicValidations) {
                    statusMessage = mnemonicValidations
                    error = true
                } else {
                    try {
                        await verifyMnemonic(trimmedContent)
                        statusMessage = localize('views.onboarding.profileRecovery.importMnemonicPhrase.phraseDetected')
                        value = trimmedContent
                    } catch (err) {
                        error = true
                        console.error(err)
                        statusMessage = localize(err.error)
                    }
                }
            }
        }
    }
</script>

<div>
    <!-- svelte-ignore a11y-autofocus -->
    <textarea
        {disabled}
        class="text-14 leading-140 resize-none w-full p-4 pb-3 rounded-xl border border-solid {error
            ? 'border-red-300 hover:border-red-500 focus:border-red-500'
            : 'border-gray-300 hover:border-gray-500 dark:border-gray-700 dark:hover:border-gray-700'}
        text-gray-500 dark:text-white bg-white dark:bg-gray-800"
        bind:value={content}
        on:input={debounce(handleKeyDown)}
        on:keydown={debounce(handleKeyDown)}
        placeholder=""
        spellcheck={false}
        autofocus
        style:min-height="{minHeight}px"
    />
    <div class="flex flex-row items-start justify-between">
        <Text type="p" secondary {error}>{statusMessage}&nbsp;</Text>
    </div>
</div>

<style lang="scss">
    textarea {
        min-height: var(--min-height);

        &:disabled {
            @apply pointer-events-none;
            @apply opacity-50;
        }
    }
</style>
