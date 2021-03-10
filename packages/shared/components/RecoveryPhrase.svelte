<script lang="typescript">
    import { onMount } from 'svelte'

    export let recoveryPhrase = []
    export let recoveryPhraseInput = []
    let recoveryPhraseIndexes = []

    export let isVerification = false
    export let hide = false
    export let classes = ''
    export let disabled = false

    let visibleRecoveryPhrase

    onMount(() => {
        visibleRecoveryPhrase = isVerification ? recoveryPhrase.slice().sort() : recoveryPhrase
    })

    $: {
        if (recoveryPhraseInput.length === 0) {
            recoveryPhraseIndexes = []
        }
    }

    const handleClick = (word, idx) => {
        if (!isVerification) {
            return
        }

        if (
            recoveryPhraseInput.length > 0 &&
            recoveryPhraseInput[recoveryPhraseInput.length - 1] === word &&
            recoveryPhraseIndexes.length > 0 &&
            recoveryPhraseIndexes[recoveryPhraseIndexes.length - 1] === idx
        ) {
            recoveryPhraseInput.pop()
            recoveryPhraseIndexes.pop()
        } else if (!recoveryPhraseInput.includes(word) && !recoveryPhraseIndexes.includes(idx)) {
            recoveryPhraseInput.push(word)
            recoveryPhraseIndexes.push(idx)
        }
        recoveryPhraseInput = recoveryPhraseInput
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

                &.selected {
                    @apply opacity-30;
                }
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
                class:selected={isVerification && recoveryPhraseInput.indexOf(word) !== -1 && recoveryPhraseIndexes.indexOf(i) !== -1}
                class:disabled={!isVerification || disabled}>
                {#if !isVerification}<span class="text-gray-500 whitespace-pre">{`${i + 1}. `}</span>{/if}
                {#if isVerification && recoveryPhraseInput.indexOf(word) !== -1 && recoveryPhraseIndexes.indexOf(i) !== -1}
                    <span class="text-gray-300">{word}</span>
                    <span class="font-bold text-16 leading-3 text-white">{recoveryPhraseIndexes.indexOf(i) + 1}</span>
                {:else}<span class={hide ? 'text-gray-500' : 'text-gray-800'}>{hide ? '********' : word}</span>{/if}
            </button>
        {/each}
    </div>
{/if}
