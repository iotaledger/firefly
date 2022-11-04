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
    export let onClick: (val: unknown) => void = undefined
    export let onClose: () => void = undefined

    let hasFocus: boolean

    function handleClick(option: any) {
        modal?.close()
        onClick ?? onClick(option)
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
        <Modal bind:this={modal} position={{ left: '0', top: '100%' }} classes="w-full p-4" on:close={onClose}>
            <picker-modal class="max-h-64 flex flex-col space-y-1 scrollable-y" in:fade={{ duration: 100 }}>
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
