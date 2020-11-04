<script>
    import { shuffleArray } from '@shared-lib/helpers'
    import { onMount } from 'svelte'

    export let recoveryPhrase
    export let shuffle = false
    export let classes
    export let recoveryPhraseInput = new Array()

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
    recovery-phrase {
        display: grid;
        grid-gap: 12px;
        width: 100%;
        max-width: 460px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        grid-auto-rows: minmax(min-content, max-content);
        font-size: 12px;
        color: #25395f;
        button {
            padding: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #eef4ff;
            border-radius: 16px;
            min-height: 50px;
            .number {
                color: #108cff;
            }
            &.disabled {
                pointer-events: none !important;
            }
            &.selected {
                background: #108cff;
                .number {
                    font-weight: bold;
                    font-size: 22px;
                    line-height: 140%;
                    color: #eef4ff;
                }
            }
        }
    }
</style>

{#if visibleRecoveryPhrase}
    <recovery-phrase class={classes}>
        {#each visibleRecoveryPhrase as word, i}
            <button
                on:click|preventDefault={() => handleClick(word)}
                class:selected={shuffle && recoveryPhraseInput.indexOf(word) !== -1}
                class:disabled={!shuffle}>
                {#if !shuffle}<span class="number">{i + 1}.</span>{/if}
                {#if recoveryPhraseInput.indexOf(word) === -1}
                    <word>{word}</word>
                {:else}<span class="number">{recoveryPhraseInput.indexOf(word) + 1}</span>{/if}
            </button>
        {/each}
    </recovery-phrase>
{/if}
