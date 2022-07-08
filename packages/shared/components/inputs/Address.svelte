<script lang="typescript">
    import { Error } from 'shared/components'
    import { ADDRESS_LENGTH } from 'shared/lib/utils'
    import { mobile } from 'shared/lib/app'
    import { onMount } from 'svelte'

    export let address = undefined
    export let classes = ''
    export let disabled = false
    export let label = undefined
    export let placeholder = undefined
    export let error = ''
    export let autofocus = false

    let textAreaElement

    onMount(() => {
        if (autofocus) {
            textAreaElement.focus()
        }
    })
</script>

<div class={classes}>
    <address-input class="flex relative" {disabled}>
        <textarea
            bind:this={textAreaElement}
            bind:value={address}
            class="w-full text-12 border border-solid resize-none
                {disabled
                ? 'text-gray-400 dark:text-gray-700'
                : 'text-gray-800 dark:text-white'} bg-white dark:bg-gray-800 
                {error
                ? 'border-red-300 hover:border-red-500 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-blue-500 dark:focus:border-gray-600'} "
            class:floating-active={address && label && $mobile === false}
            {placeholder}
            {disabled}
            spellcheck={false}
            maxlength={ADDRESS_LENGTH}
            class:mobile={$mobile}
        />
        {#if label && $mobile === false}
            <floating-label class:floating-active={address && label}>{label}</floating-label>
        {/if}
    </address-input>
    {#if error}
        <Error {error} />
    {/if}
</div>

<style type="text/scss">
    textarea {
        @apply py-4;
        @apply pr-8;
        @apply pl-3;
        border-radius: 0.625rem; // TODO: add to tailwind

        &.mobile {
            @apply px-3;
            @apply py-1.5;
        }

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
            @apply pt-6;
            @apply pb-2;
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
            @apply left-3;
            @apply select-none;
            @apply whitespace-nowrap;
            @apply w-full;
            top: 8px;
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
