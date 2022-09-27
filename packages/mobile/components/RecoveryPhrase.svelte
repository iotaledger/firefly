<script lang="typescript">
    export let recoveryPhrase = []
    export let verifyRecoveryPhrase = undefined

    export let hide = false
    export let classes = ''
</script>

{#if recoveryPhrase}
    <div
        data-label="recovery-phrase"
        class="grid w-full text-12 grid-cols-3 overflow-y-auto p-3 rounded-2xl border border-solid border-gray-300 {classes}"
        class:hide
    >
        {#each recoveryPhrase as word, i}
            <span
                id="recovery-word-{i}"
                class="p-3 flex flex-row items-center bg-transparent text-gray-500 border border-solid border-transparent"
                class:errored={verifyRecoveryPhrase &&
                    verifyRecoveryPhrase[i] &&
                    verifyRecoveryPhrase[i] !== recoveryPhrase[i]}
            >
                <span class="text-gray-500 mr-2">{`${i + 1}. `}</span>
                <span class="'text-gray-500 dark:text-white"
                    >{verifyRecoveryPhrase && verifyRecoveryPhrase[i] !== recoveryPhrase[i] ? '*****' : word}</span
                >
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
            &.errored {
                @apply rounded;
                @apply border-solid;
                @apply border;
                @apply border-red-300;
            }
        }
    }
</style>
