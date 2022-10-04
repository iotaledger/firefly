<script lang="typescript">
    import { appSettings } from '@core/app'
    import { Mnemonic } from '@contexts/onboarding'

    export let recoveryPhrase: Mnemonic = []
    export let verifyRecoveryPhrase: Mnemonic = undefined

    export let hide = false
    export let classes = ''

    $: dark = $appSettings.darkMode
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
                class:dark
                class:selected={verifyRecoveryPhrase &&
                    verifyRecoveryPhrase.length === i &&
                    verifyRecoveryPhrase[i - 1] === recoveryPhrase[i - 1]}
                class:errored={verifyRecoveryPhrase &&
                    verifyRecoveryPhrase[i] &&
                    verifyRecoveryPhrase[i] !== recoveryPhrase[i]}
            >
                <span class="text-gray-600 mr-2">{`${i + 1}. `}</span>
                <span class="'text-gray-600 dark:text-white"
                    >{verifyRecoveryPhrase && verifyRecoveryPhrase[i] !== recoveryPhrase[i] ? '*****' : word}</span
                >
            </span>
        {/each}
    </div>
{/if}

<style type="text/scss">
    div {
        &.hide {
            filter: blur(4px);
        }
        span {
            &.selected {
                @apply rounded;
                @apply border-solid;
                @apply border;
                @apply border-blue-500;
                @apply bg-blue-50;
            }
            &.errored {
                @apply rounded;
                @apply border-solid;
                @apply border;
                @apply border-red-500;
                @apply bg-red-50;
            }
            &.dark.selected {
                @apply bg-blue-300;
                span {
                    @apply text-gray-600;
                }
            }
            &.dark.errored {
                @apply bg-red-300;
                span {
                    @apply text-gray-600;
                }
            }
        }
    }
</style>
