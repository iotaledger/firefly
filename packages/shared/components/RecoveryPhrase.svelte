<script lang="ts">
    export let recoveryPhrase: string[]
    export let verifyRecoveryPhrase: string[] | undefined = undefined
    export let blurred: boolean = false
    export let disabled: boolean = false
    export let boxed: boolean = false
</script>

{#if recoveryPhrase}
    <recovery-phrase data-label="recovery-phrase" class:blurred class:boxed>
        {#each recoveryPhrase as word, i}
            {@const errored =
                verifyRecoveryPhrase && verifyRecoveryPhrase[i] && verifyRecoveryPhrase[i] !== recoveryPhrase[i]}
            {@const selected =
                verifyRecoveryPhrase &&
                verifyRecoveryPhrase.length === i &&
                verifyRecoveryPhrase[i - 1] === recoveryPhrase[i - 1]}
            {@const unmatched = verifyRecoveryPhrase && !verifyRecoveryPhrase[i]}
            <recovery-word
                id="recovery-word-{i}"
                class:boxed
                class:disabled
                class:errored
                class:selected
                class:unmatched
            >
                <span class="text-gray-500 mr-2">{`${i + 1}. `}</span>
                <span class="text-gray-700 dark:text-white">{blurred || errored || unmatched ? '*****' : word}</span>
            </recovery-word>
        {/each}
    </recovery-phrase>
{/if}

<style lang="scss">
    recovery-phrase {
        @apply grid grid-cols-3 w-full mb-8 text-12;
        max-width: 460px;

        &.blurred {
            @apply filter blur-sm;
        }

        &.boxed {
            @apply overflow-y-auto p-3 rounded-2xl border border-solid border-gray-300;
        }

        &:not(.boxed) {
            @apply gap-3;
        }
    }

    recovery-word {
        @apply flex flex-row items-center;

        &.disabled {
            @apply pointer-events-none;
        }
    }

    recovery-word:not(.boxed) {
        @apply px-6 py-4 rounded-2xl;
        @apply bg-gray-200 dark:bg-gray-800;

        &.unmatched {
            @apply filter blur-sm;
        }

        &.errored {
            @apply bg-red-500 filter blur-sm;
        }
    }

    recovery-word.boxed {
        @apply p-3 border border-solid border-transparent bg-transparent text-gray-500;

        &.selected {
            @apply rounded border border-solid border-blue-500 bg-blue-50;
            @apply dark:bg-blue-300 dark:bg-opacity-10;
        }

        &.errored {
            @apply rounded border border-solid border-red-500 bg-red-50;
            @apply dark:bg-red-300 dark:bg-opacity-10;
        }
    }
</style>
