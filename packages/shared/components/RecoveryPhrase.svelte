<script>
    import { shuffleArray } from 'shared/lib/helpers'
    import { onMount } from 'svelte'

    export let recoveryPhrase = []
    export let recoveryPhraseInput = []
    let recoveryPhraseIndexes = []

    export let shuffle = false
    export let hide = false
    export let classes = ''

    let visibleRecoveryPhrase

    onMount(() => {
        visibleRecoveryPhrase = shuffle ? shuffleArray(recoveryPhrase) : recoveryPhrase
    })

    const handleClick = (word, idx) => {
        if (!shuffle || (recoveryPhraseInput.includes(word) && recoveryPhraseIndexes.includes(idx))) {
            return
        }

        recoveryPhraseInput.push(word)
        recoveryPhraseIndexes.push(idx)

        recoveryPhraseInput = recoveryPhraseInput // needed
        recoveryPhraseIndexes = recoveryPhraseIndexes
    }
</script>

<style type="text/scss">
    // TODO: tailwindify
    div {
        max-width: 460px;
        button {
            &.disabled {
                @apply pointer-events-none;
            }
            &.selected {
                @apply bg-blue-500;
                @apply text-white;
                @apply justify-between;
            }
        }
    }
</style>

{#if visibleRecoveryPhrase}
    <div data-label="recovery-phrase" class={`grid w-full text-12 grid-cols-3 gap-3 text-gray-800 ${classes}`}>
        {#each visibleRecoveryPhrase as word, i}
            <button
                on:click|preventDefault={() => handleClick(word, i)}
                class="px-6 py-4 flex flex-row items-center rounded-2xl bg-gray-50"
                class:selected={shuffle && recoveryPhraseInput.indexOf(word) !== -1 && recoveryPhraseIndexes.indexOf(i) !== -1}
                class:disabled={!shuffle}>
                {#if !shuffle}
                    <span class="text-gray-500 whitespace-pre">{`${i + 1}. `}</span>
                {/if}
                <span class={hide ? 'text-gray-500' : 'text-gray-800'}>{hide ? '********' : word}</span>
                {#if recoveryPhraseIndexes.indexOf(i) !== -1}
                    <span class="font-bold text-16 leading-3 text-white">{recoveryPhraseIndexes.indexOf(i) + 1}</span>
                {/if}
            </button>
        {/each}
    </div>
{/if}
