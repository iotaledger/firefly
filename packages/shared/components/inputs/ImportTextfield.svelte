<script lang="typescript">
    import { Text } from 'shared/components'
    import { debounce } from 'shared/lib/utils'
    import { english } from './wordlists/english'

    export let value = undefined
    export let locale

    let statusMessage = ''
    let content = ''
    let error = false

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
            if (!english.includes(words[i])) {
                return locale('error.backup.phraseUnrecognizedWord', {
                    values: {
                        word: words[i],
                    },
                })
            }
        }
    }

    const handleKeyDown = () => {
        value = ''
        statusMessage = ''
        error = false

        content = content.replace(/\r/g, '').replace(/\n/g, '').replace(/  +/g, ' ')

        let trimmedContent = content.trim()

        if (trimmedContent.length >= 3) {
            const words = trimmedContent.split(' ')
            if (words.length === 1 && /[A-Z]+/.test(words[0])) {
                const seedValidations = isSeed(trimmedContent)
                if (seedValidations) {
                    statusMessage = seedValidations
                    error = true
                } else {
                    statusMessage = locale('views.importFromText.seedDetected')
                    value = trimmedContent
                }
            } else {
                const mnemonicValidations = isMnemonic(words)
                if (mnemonicValidations) {
                    statusMessage = mnemonicValidations
                    error = true
                } else {
                    statusMessage = locale('views.importFromText.phraseDetected')
                    value = trimmedContent
                }
            }
        }
    }
</script>

<style type="text/scss">
    textarea {
        min-height: 200px;
    }
</style>

<div>
    <textarea
        class="text-12 leading-140 resize-none w-full p-4 pb-3 rounded-xl border border-solid 
            {error ? 'border-red-300 hover:border-red-500 focus:border-red-500' : 'border-gray-300 hover:border-gray-500 dark:border-gray-700 dark:hover:border-gray-700'} 
            text-gray-500 dark:text-white bg-white dark:bg-gray-800 "
        bind:value={content}
        on:keydown={debounce(handleKeyDown)}
        placeholder=""
        spellcheck={false}
        autofocus />
    <Text type="p" secondary {error}>{statusMessage}&nbsp;</Text>
</div>
