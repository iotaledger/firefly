<script lang="typescript">
    import { Text } from 'shared/components'
    import Error from './Error'

    export let address = undefined
    export let classes = ''
    export let disabled = false
    export let label = undefined
    export let error = ''
    export let prefix = ''
</script>

<style type="text/scss">
    textarea {
        &.disabled {
            @apply pointer-events-none;
            @apply opacity-50;
        }
    }
</style>

<div>
    {#if label}
        <Text type="p" classes="mb-2" smaller>{label}</Text>
    {/if}

    <address-input class=" flex relative {classes}">
        <textarea
            bind:value={address}
            placeholder={prefix}
            class={`w-full relative text-12 leading-140 py-4 pr-8 pl-4 rounded-xl resize-none
                border border-solid text-gray-500 dark:text-white bg-white dark:bg-gray-800
                ${error ? 'border-red-300 hover:border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-gray-500 dark:focus:border-gray-600'} 
                ${classes}`}
            class:disabled
            {disabled}
            spellcheck={false} />
    </address-input>
    <Error {error} />
</div>
