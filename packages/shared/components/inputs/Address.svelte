<script lang="typescript">
    import { ADDRESS_LENGTH } from 'shared/lib/utils'
    import Error from './Error'

    export let address = undefined
    export let classes = ''
    export let disabled = false
    export let label = undefined
    export let placeholder = undefined
    export let error = ''
</script>

<style type="text/scss">
    textarea {
        @apply py-4;
        @apply pr-8;
        @apply pl-4;
        border-radius: 0.625rem; // TODO: add to tailwind

        &::placeholder {
            @apply text-gray-500;
        }

        &:disabled {
            &,
            + floating-label.floating-active {
                @apply pointer-events-none;
                @apply opacity-50;
            }
        }

        &.floating-active {
            @apply pt-5;
            @apply pb-3;
        }

        + floating-label {
            transform: translateY(3px);
            transition: all 0.2s ease-out;
            @apply block;
            @apply text-gray-500;
            @apply text-11;
            @apply leading-120;
            @apply overflow-hidden;
            @apply opacity-0;
            @apply pointer-events-none;
            @apply absolute;
            @apply left-4;
            @apply select-none;
            @apply whitespace-nowrap;
            @apply w-full;
            top: 7px;
        }
        &:not(:disabled) {
            + floating-label {
                &.floating-active {
                    @apply opacity-100;
                    transform: none;
                }
            }
        }

        &:focus {
            + floating-label {
                @apply text-blue-500;
            }
        }
    }
</style>

<div>
    <address-input class="flex relative {classes}" {disabled}>
        <textarea
            bind:value={address}
            class="w-full text-12 leading-140 border border-solid resize-none
                {disabled ? 'text-gray-400 dark:text-gray-700' : 'text-gray-800 dark:text-white'} bg-white dark:bg-gray-800 
                {error ? 'border-red-300 hover:border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-blue-500 dark:focus:border-gray-600'} "
            class:floating-active={address && label}
            {placeholder}
            {disabled}
            spellcheck={false}
            maxlength={ADDRESS_LENGTH} />
        {#if label}
            <floating-label
                class="block text-gray-500 text-11 leading-120 overflow-hidden opacity-0 pointer-events-none absolute top-2 left-4 select-none whitespace-nowrap w-full"
                class:floating-active={address && label}>
                {label}
            </floating-label>
        {/if}
    </address-input>
    {#if error}
        <Error {error} />
    {/if}
</div>
