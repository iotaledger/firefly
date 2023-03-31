<script lang="typescript">
    import { Text } from 'shared/components'
    import { debounce } from 'shared/lib/utils'
    import { asyncGetLegacySeedChecksum, asyncVerifyMnemonic } from 'shared/lib/wallet'
    import { english } from 'shared/lib/wordlists/english'
    import { Locale } from '@core/i18n'

    enum Type {
        Seed = 'seed',
        Mnemonic = 'mnemonic',
    }

    export let locale: Locale

    export let value = undefined
    export let type: Type = Type.Seed

    export let disabled = false

    let statusMessage = ''
    let content = ''
    let error = false
    let seedChecksum = ''

    const isSeed = (value: string): string | undefined => {
        if (value.length !== 81) {
            return locale('error.backup.seedTooShort', {
                values: {
                    length: value.length,
                },
            })
        }
        if (!/^[9A-Z]+$/.test(value)) {
            return locale('error.backup.seedCharacters')
        }
    }

    const isMnemonic = (words: string[]): string | undefined => {
        if (words.length !== 24) {
            return locale('error.backup.phraseWordCount', {
                values: {
                    length: words.length,
                },
            })
        }
        for (let i = 0; i < words.length; i++) {
            const includesWord = english.includes(words[i])
            const includesWordOtherCase = english.includes(words[i].toLowerCase())
            if (!includesWord && includesWordOtherCase) {
                return locale('error.backup.phraseCaseWord', {
                    values: {
                        word: words[i],
                    },
                })
            } else if (!includesWord) {
                return locale('error.backup.phraseUnrecognizedWord', {
                    values: {
                        word: words[i],
                    },
                })
            }
        }
    }

    /* eslint-disable @typescript-eslint/no-misused-promises */
    const onContentChanged = async () => {
        value = ''
        statusMessage = ''
        error = false
        seedChecksum = ''

        content = content.replace(/\r/g, '').replace(/\n/g, '').replace(/  +/g, ' ')

        const trimmedContent = content.trim()

        if (trimmedContent.length >= 3) {
            const words = trimmedContent.split(' ')
            if (type === Type.Seed) {
                const seedValidations = isSeed(trimmedContent)
                if (seedValidations) {
                    statusMessage = seedValidations
                    error = true
                } else {
                    statusMessage = locale('views.importFromText.seedDetected')
                    value = trimmedContent
                    seedChecksum = await asyncGetLegacySeedChecksum(value)
                }
            } else if (type === Type.Mnemonic) {
                const mnemonicValidations = isMnemonic(words)
                if (mnemonicValidations) {
                    statusMessage = mnemonicValidations
                    error = true
                } else {
                    try {
                        await asyncVerifyMnemonic(trimmedContent)
                        statusMessage = locale('views.importFromText.phraseDetected')
                        value = trimmedContent
                    } catch (err) {
                        error = true
                        statusMessage = locale(err.error)
                    }
                }
            }
        }
    }
</script>

<div>
    <textarea
        {disabled}
        class="text-14 leading-140 resize-none w-full p-4 pb-3 rounded-xl border border-solid {error
            ? 'border-red-300 hover:border-red-500 focus:border-red-500'
            : 'border-gray-300 hover:border-gray-500 dark:border-gray-700 dark:hover:border-gray-700'}
        text-gray-500 dark:text-white bg-white dark:bg-gray-800 scroll-secondary"
        bind:value={content}
        on:input={debounce(onContentChanged)}
        on:keydown={debounce(onContentChanged)}
        placeholder=""
        spellcheck={false}
        autofocus
    />
    <div class="flex flex-row items-start justify-between">
        <Text type="p" secondary {error}>{statusMessage}&nbsp;</Text>
        {#if seedChecksum}
            <div class="flex flex-row items-center ml-2">
                <Text type="p" secondary classes="mr-1">{locale('views.importFromText.checksum')}:</Text>
                <Text type="p" highlighted>{seedChecksum}</Text>
            </div>
        {/if}
    </div>
</div>

<style type="text/scss">
    textarea {
        min-height: 200px;

        &:disabled {
            @apply pointer-events-none;
            @apply opacity-50;
        }
    }
</style>
