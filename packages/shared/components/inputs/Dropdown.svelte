<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { IDropdownItem, clickOutside, isNumberLetterOrPunctuation } from '@core/utils'
    import { FontWeight, Icon, Text, TextPropTypes, TextType } from 'shared/components'

    type T = $$Generic

    export let value: T | undefined
    export let label: string = ''
    export let placeholder: string = ''
    export let disabled = false
    export let items: IDropdownItem<T>[] = []
    export let sortItems = false
    export let enableTyping = false
    export let small = false
    export let onSelect: (..._: IDropdownItem<T>[]) => void

    const textProps: TextPropTypes = {
        type: TextType.p,
        fontSize: 'sm',
        lineHeight: '140',
        fontWeight: FontWeight.normal,
    }

    let dropdown: boolean = false
    let isFocused: boolean = false
    let divContainer: HTMLElement
    let navContainer: HTMLElement
    let search: string = ''
    let navWidth: string
    let focusedItem: HTMLElement | null
    let selectedItem: IDropdownItem<T> | undefined

    $: placeholderColor = value ? '' : 'gray-500'
    $: items = sortItems ? items.sort((a, b) => (a.label > b.label ? 1 : -1)) : items
    $: value, (selectedItem = items.find((item) => item.value === value))

    export function handleSelect(item: IDropdownItem<T>): void {
        selectedItem = item
        value = item.value
        onSelect && onSelect(item)
    }

    function onClickOutside(): void {
        dropdown = false
    }

    function toggleDropDown(): void {
        dropdown = !dropdown
        isFocused = !isFocused
        if (dropdown) {
            const elementLabel = items.find((item) => item.value === value)?.label || ''
            let elem = document.getElementById(elementLabel)
            if (!elem) {
                elem = navContainer.firstChild as HTMLElement
            }
            if (elem) {
                navContainer.scrollTop = elem?.offsetTop
                elem.focus()
            }
        } else {
            divContainer.focus()
            focusedItem = null
            search = ''
        }
    }

    function focusItem(itemId: string): void {
        focusedItem = document.getElementById(itemId)
    }

    function onKey(event: KeyboardEvent): void {
        if (!enableTyping) {
            return
        }

        if (!dropdown) {
            // Note that space uses code not key, this is intentional
            if (event.key === 'Enter' || event.key === 'ArrowDown' || event.code === 'Space') {
                toggleDropDown()
                event.preventDefault()
            }
        } else {
            if (event.key === 'Escape') {
                toggleDropDown()
                event.preventDefault()
            } else if (event.key === 'ArrowDown') {
                if (focusedItem) {
                    const children = Array.from(navContainer.children) as HTMLElement[]
                    const idx = children.indexOf(focusedItem)
                    if (idx < children.length - 1) {
                        const element = children[idx + 1]
                        element.focus()
                        event.preventDefault()
                    }
                }
            } else if (event.key === 'ArrowUp') {
                if (focusedItem) {
                    const children = Array.from(navContainer.children) as HTMLElement[]
                    const idx = children.indexOf(focusedItem)
                    if (idx > 0) {
                        children[idx - 1].focus()
                        event.preventDefault()
                    }
                }
            } else if (isNumberLetterOrPunctuation(event.key)) {
                const children = Array.from(navContainer.children) as HTMLElement[]
                const itemsValues = items.map((item) => item.label.toLowerCase())
                search += event.key
                const idx = itemsValues.findIndex((item) => item.includes(search.toLowerCase()))
                if (idx >= 0) {
                    children[idx].focus()
                    event.preventDefault()
                }
            } else if (event.key === 'Backspace') {
                search = search.slice(0, -1)
            }
        }
    }

    function handleDropdownClick(event: MouseEvent): void {
        event.stopPropagation()
        toggleDropDown()
    }
</script>

<dropdown-input
    class="relative hasBorder w-full"
    on:click={handleDropdownClick}
    use:clickOutside
    on:clickOutside={onClickOutside}
    on:keydown={onKey}
    class:active={dropdown}
    class:small
    class:floating-active={value && label}
    class:disabled
    style={navWidth}
>
    <button
        type="button"
        class="
            selection relative flex items-center w-full whitespace-nowrap cursor-pointer bg-white dark:bg-gray-800
            {dropdown
            ? 'border-blue-500'
            : 'focus:border-blue-500 border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700'}
        "
        tabindex="0"
        bind:this={divContainer}
    >
        <div class="flex w-full text-12 leading-140 text-gray-800 dark:text-white">
            <Text {...textProps} color="{placeholderColor}," darkColor={placeholderColor} classes="overflow-hidden">
                {search || selectedItem?.label || value || placeholder || ''}
            </Text>
        </div>
        <Icon
            icon={small ? IconEnum.SmallChevronDown : IconEnum.ChevronDown}
            width={small ? 16 : 24}
            height={small ? 16 : 24}
            classes="absolute text-gray-500 fill-current"
        />
        {#if label}
            <floating-label class:floating-active={value && label} class="text-start">{label}</floating-label>
        {/if}
    </button>
    <nav
        class:active={dropdown}
        class="absolute w-full overflow-hidden pointer-events-none opacity-0 z-10 text-left
        bg-white dark:bg-gray-800
            border border-solid border-blue-500 border-t-gray-500 dark:border-t-gray-700"
    >
        <div class="inner overflow-y-auto" bind:this={navContainer}>
            {#each items as item}
                <button
                    type="button"
                    id={String(item.label)}
                    class="relative flex items-center p-4 w-full whitespace-nowrap
                        {item.value === value && 'bg-gray-100 dark:bg-gray-700 dark:bg-opacity-20'}
                        hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20
                        focus:bg-gray-200 dark:focus:bg-gray-600 dark:focus:bg-opacity-20"
                    class:active={item.value === value}
                    on:click={() => handleSelect(item)}
                    on:focus={() => focusItem(item.label)}
                    tabindex={dropdown ? 0 : -1}
                >
                    <Text {...textProps}>{item.label}</Text>
                </button>
            {/each}
        </div>
    </nav>
</dropdown-input>

<style lang="scss">
    dropdown-input {
        @apply block;
        .selection {
            min-height: 50px;
            border-radius: 0.625rem; // TODO: add to tailwind
            @apply border-solid;
            @apply border;
            @apply py-4;
            @apply pl-3;
            @apply pr-10;
        }
        &:not(.small) {
            :global(svg) {
                @apply right-3;
                @apply top-3;
            }
        }
        &.active {
            .selection {
                border-bottom-color: transparent;
                border-radius: 0.625rem 0.625rem 0 0; // TODO: add to tailwind
            }
        }
        &.disabled {
            @apply pointer-events-none;
            @apply opacity-50;
        }
        nav {
            .inner {
                max-height: 235px;
            }
            top: 50px;
            border-radius: 0 0 0.625rem 0.625rem; // TODO: add to tailwind
            @apply left-0;
            &.active {
                @apply opacity-100;
                @apply pointer-events-auto;
            }
        }
        &.small {
            .selection {
                min-height: 36px;
                @apply py-2.5;
                @apply pl-3;
                @apply pr-8;
                @apply rounded-lg;
            }
            nav {
                top: 36px;
                @apply rounded-lg;
                @apply rounded-tl-none;
                @apply rounded-tr-none;
            }
            :global(svg) {
                @apply right-2;
            }
            &.active {
                .selection {
                    @apply rounded-bl-none;
                    @apply rounded-br-none;
                }
            }
        }

        &.floating-active {
            .selection {
                @apply pt-6;
                @apply pb-2;
            }
        }

        floating-label {
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
            &.floating-active {
                @apply opacity-100;
                transform: none;
            }
        }
    }
</style>
