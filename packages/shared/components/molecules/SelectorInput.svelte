<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Modal, TextInput, Text, TextType, FontWeight, IOption } from 'shared/components'
    import { fade } from 'svelte/transition'
    import { truncateString } from '@core/utils'

    export let error: string = ''
    export let disabled: boolean = false
    export let labelLocale: string = ''
    export let modal: Modal = undefined
    export let inputElement: HTMLInputElement = undefined
    export let options: IOption[] = []
    export let selected: IOption = undefined
    export let maxHeight: string = 'max-h-64'
    // HTML checks whether this value is absent to determine whether the field is readonly
    // If the attribute is set to false, HTML interprets it as a readonly field.
    export let readonly: boolean = null

    let value: string = selected?.key ?? selected?.value
    let previousValue: string = value
    let hasFocus: boolean

    $: filteredOptions = options
    $: if (previousValue !== value) {
        selected = { value }
        previousValue = value
        setFilteredOptions(value)
    }

    $: options, resetValue()
    $: hasFocus && (error = '')

    $: if (hasFocus) {
        setTimeout(() => modal?.open(), 100)
    }

    function setFilteredOptions(searchValue?: string): void {
        const lowerCaseSearchValue = searchValue?.toLowerCase()
        filteredOptions = lowerCaseSearchValue
            ? options.filter(
                  (option) =>
                      option?.key?.toLowerCase()?.includes(lowerCaseSearchValue) ||
                      option?.value?.toLowerCase()?.includes(lowerCaseSearchValue)
              )
            : options
    }

    function handleClick(option: IOption): void {
        modal?.close()
        selected = option
        value = option?.key ?? option.value
        previousValue = value
        setFilteredOptions()
    }

    function resetValue(): void {
        value = selected?.key ?? selected?.value
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
        {readonly}
        {...$$restProps}
    >
        <div slot="right">
            {#if selected?.key}
                <Text slot="right" type={TextType.pre} fontSize="sm" color="gray-600" whitespace="pre">
                    {truncateString(selected.value, 9, 9)}
                </Text>
            {/if}
        </div>
    </TextInput>

    {#if filteredOptions.length > 0 && !readonly}
        <Modal
            bind:this={modal}
            position={{ left: '0', top: '100%' }}
            classes="w-full p-4"
            on:close={() => inputElement.blur()}
        >
            <picker-modal class="{maxHeight} flex flex-col space-y-1 scrollable-y" in:fade={{ duration: 100 }}>
                {#each filteredOptions as option, index}
                    <button
                        on:click={() => handleClick(option)}
                        class="w-full flex flex-row flex-1 justify-between items-center px-2 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20"
                    >
                        <div class="flex flex-row gap-3 justify-start items-center" style="max-width: 50%;">
                            <slot {option} {index}>
                                <!-- Contains Custom Selector -->
                            </slot>
                            <Text
                                type={TextType.p}
                                fontSize="sm"
                                fontWeight={FontWeight.medium}
                                color="gray-800"
                                classes="truncate"
                            >
                                {option.key}
                            </Text>
                        </div>
                        <Text type={TextType.pre} fontSize="sm" color="gray-600">
                            {truncateString(option.value, 9, 9)}
                        </Text>
                    </button>
                {/each}
            </picker-modal>
        </Modal>
    {/if}
</selector-input>
