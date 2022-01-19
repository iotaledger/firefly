<script lang="typescript">
    export let recoveryPhrase = []
    export let verifyRecoveryPhrase = undefined

    export let hide = false
    export let classes = ''
    export let disabled = false
</script>

{#if recoveryPhrase}
    <div data-label="recovery-phrase" class={`grid w-full text-12 grid-cols-3 gap-3 text-gray-800 ${classes}`} class:hide>
        {#each recoveryPhrase as word, i}
            <span
                class="px-6 py-4 flex flex-row items-center rounded-2xl bg-gray-200 dark:bg-gray-800"
                class:unmatched={verifyRecoveryPhrase && !verifyRecoveryPhrase[i]}
                class:disabled
                class:errored={verifyRecoveryPhrase && verifyRecoveryPhrase[i] && verifyRecoveryPhrase[i] !== recoveryPhrase[i]}>
                <span class="text-gray-500 mr-2">{`${i + 1}. `}</span>
                <span class={'text-gray-800 dark:text-white'}>{word}</span>
            </span>
        {/each}
    </div>
{/if}

<style type="text/scss">
    div {
        max-width: 460px;

        &.hide {
            filter: blur(4px);
        }
        span {
            &.disabled {
                @apply pointer-events-none;
            }
            &.unmatched {
                filter: blur(4px);
            }

            &.errored {
                filter: blur(4px);
                @apply bg-red-500;
            }
        }
    }
</style>
