<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Modal, TextInput } from 'shared/components'
    import { fade } from 'svelte/transition'

    export let value: string = ''
    export let error: string = ''
    export let disabled: boolean = false
    export let labelLocale: string = ''
    export let modal: Modal = undefined
    export let inputElement: HTMLInputElement = undefined
    export let options = []
    export let maxHeight: string = 'max-h-64'
    export let onClick: (val: unknown) => void = () => {}

    let hasFocus: boolean

    function handleClick(option: unknown) {
        modal?.close()
        onClick(option)
    }

    $: hasFocus && (error = '')

    $: if (hasFocus) {
        setTimeout(() => modal?.open(), 100)
    }
</script>

<selector-input class="w-full relative">
    <TextInput
        bind:inputElement
        bind:value
        bind:hasFocus
        {error}
        {disabled}
        label={localize(labelLocale)}
        placeholder={localize(labelLocale)}
        fontSize="sm"
        {...$$restProps}
    />

    {#if options.length > 0}
        <Modal
            bind:this={modal}
            position={{ left: '0', top: '100%' }}
            classes="w-full p-4"
            on:close={() => inputElement.blur()}
        >
            <picker-modal class="{maxHeight} flex flex-col space-y-1 scrollable-y" in:fade={{ duration: 100 }}>
                {#each options as option, index}
                    <button
                        on:click={() => handleClick(option)}
                        class="w-full flex flex-row flex-1 justify-between px-2 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20"
                    >
                        <slot {option} {index}>
                            <!-- Contains Custom Selector -->
                        </slot>
                    </button>
                {/each}
            </picker-modal>
        </Modal>
    {/if}
</selector-input>
