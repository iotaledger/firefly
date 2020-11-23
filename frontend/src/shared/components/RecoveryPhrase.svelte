<script>
    import { shuffleArray } from '@shared-lib/helpers'
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
        color: var(--text-primary-color);
        button {
            background: var(--line-separator-color);
            min-height: 50px;
            .number {
                color: var(--ui-blue-color);
            }
            &.disabled {
                @apply pointer-events-none;
            }
            &.selected {
                background: var(--ui-blue-color);
                .number {
                    @apply font-bold;
                    @apply text-22;
                    @apply leading-140;
                    color: var(--line-separator-color);
                }
            }
        }
    }
</style>

{#if visibleRecoveryPhrase}
    <div data-label="recovery-phrase" class={`grid w-full text-12 grid-cols-3 gap-3 ${classes}`}>
        {#each visibleRecoveryPhrase as word, i}
            <button
                on:click|preventDefault={() => handleClick(word)}
                class="p-2 flex flex-col items-center justify-center rounded-2xl"
                class:selected={shuffle && recoveryPhraseInput.indexOf(word) !== -1}
                class:disabled={!shuffle}>
                {#if !shuffle}<span class="number">{i + 1}.</span>{/if}
                {#if recoveryPhraseInput.indexOf(word) === -1}
                    <span class="word">{word}</span>
                {:else}<span class="number">{recoveryPhraseInput.indexOf(word) + 1}</span>{/if}
            </button>
        {/each}
    </div>
{/if}
