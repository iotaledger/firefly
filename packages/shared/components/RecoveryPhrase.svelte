<script>
    import { shuffleArray } from 'shared/lib/helpers'
    import { onMount } from 'svelte'

    export let recoveryPhrase = []
    export let recoveryPhraseInput = []
    export let shuffle = false
    export let classes = ''

    let visibleRecoveryPhrase

    onMount(() => {
        visibleRecoveryPhrase = shuffle ? shuffleArray(recoveryPhrase) : recoveryPhrase
    })

    const handleClick = (word) => {
        if (!shuffle || recoveryPhraseInput.includes(word)) {
            return
        }
        recoveryPhraseInput.push(word)
        recoveryPhraseInput = recoveryPhraseInput // needed
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
                on:click|preventDefault={() => handleClick(word)}
                class="px-6 py-4 flex flex-row items-center rounded-2xl bg-gray-50"
                class:selected={shuffle && recoveryPhraseInput.indexOf(word) !== -1}
                class:disabled={!shuffle}>
                {#if !shuffle}<span class="text-gray-500 whitespace-pre">{`${i + 1}. `}</span>{/if}
                <span>{word}</span>
                {#if recoveryPhraseInput.indexOf(word) !== -1}
                    <span class="font-bold text-16 leading-3 text-white">{recoveryPhraseInput.indexOf(word) + 1}</span>
                {/if}
            </button>
        {/each}
    </div>
{/if}
