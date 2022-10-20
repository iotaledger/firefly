<script lang="typescript">
    import { onMount } from 'svelte'
    import { Icon, Text, Error, DropdownItem } from 'shared/components'
    import { clickOutside } from 'shared/lib/actions'
    import { isNumberLetterOrPunctuation } from '@core/utils'

    export let value: string
    export let label: string = ''
    export let placeholder: string = ''
    export let disabled = false
    export let valueKey = 'label'
    export let sortItems = false
    export let items: DropdownItem<unknown>[] = []
    export let small = false
    export let contentWidth = false
    export let error = ''
    export let classes = ''
    export let autofocus = false
    export let valueTextType = 'p'
    export let itemTextType = 'p'
    export let showBorderWhenClosed = false
    export let isFocused = false
    export let hasFocus = false
    export let enableTyping = false

    export let onSelect: (..._: any[]) => void

    let dropdown = false
    let navContainer
    let divContainer: HTMLElement
    let focusedItem: HTMLElement
    let search = ''

    items = sortItems ? items.sort((a, b) => (a.label > b.label ? 1 : -1)) : items

    let navWidth: string

    function handleClickOutside(): void {
        dropdown = false
    }

    function toggleDropDown(): void {
        if (items.length <= 1) {
            return
        }
        dropdown = !dropdown
        isFocused = !isFocused
        hasFocus = !hasFocus
        if (dropdown) {
            let elem = document.getElementById(value)
            if (!elem) {
                elem = navContainer.firstChild
            }
            if (elem) {
                navContainer.scrollTop = elem.offsetTop
                elem.focus()
            }
        } else {
            divContainer.focus()
            focusedItem = undefined
            search = ''
        }
    }

    function focusItem(itemId: string): void {
        focusedItem = document.getElementById(itemId)
    }

    function handleKey(event: KeyboardEvent): void {
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
                    const children = [...navContainer.children]
                    const idx = children.indexOf(focusedItem)
                    if (idx < children.length - 1) {
                        children[idx + 1].focus()
                        event.preventDefault()
                    }
                }
            } else if (event.key === 'ArrowUp') {
                if (focusedItem) {
                    const children = [...navContainer.children]
                    const idx = children.indexOf(focusedItem)
                    if (idx > 0) {
                        children[idx - 1].focus()
                        event.preventDefault()
                    }
                }
            } else if (isNumberLetterOrPunctuation(event.key)) {
                const children = [...navContainer.children]
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

    onMount(() => {
        if (contentWidth) {
            // navWidth = `width: ${navContainer.clientWidth + 8}px`
        }
        if (autofocus) {
            divContainer.focus()
        }
    })
</script>

<dropdown-input
    class="relative {contentWidth ? '' : 'w-full'} {classes}"
    on:click={(e) => {
        e.stopPropagation()
        toggleDropDown()
    }}
    use:clickOutside
    on:clickOutside={handleClickOutside}
    on:keydown={handleKey}
    class:active={dropdown}
    class:small
    class:floating-active={value && label}
    class:disabled
    class:hasBorder={showBorderWhenClosed || dropdown}
    style={navWidth}
>
    <div
        class="selection relative flex flex-row space-x-0 pl-1 pb-1.5 items-end w-full whitespace-nowrap
    bg-white dark:bg-gray-800
            {hasFocus ? '-mr-1 pr-1' : 'pr-0'}
            {items.length > 1 ? 'cursor-pointer' : ''}
            {dropdown
            ? 'border-blue-500'
            : showBorderWhenClosed
            ? 'focus:border-blue-500 border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700'
            : 'border-transparent'}"
        tabindex="0"
        bind:this={divContainer}
    >
        <div class="text-gray-800 dark:text-white">
            <Text fontSize="16" fontWeight="semibold" type={valueTextType} smaller>
                {search || value || placeholder}
            </Text>
        </div>
        {#if items.length > 1}
            <Icon
                icon={'small-chevron-down'}
                width={16}
                height={16}
                classes="text-gray-500 dark:text-white fill-current"
            />
        {/if}
    </div>
    {#if error}
        <Error {error} />
    {/if}
    <nav
        class:active={dropdown}
        class="absolute w-full overflow-hidden pointer-events-none opacity-0 z-10 text-left
        bg-white dark:bg-gray-800
            border border-solid border-blue-500 border-t-gray-500 dark:border-t-gray-700"
    >
        <div class="flex flex-col items-center inner overflow-y-auto" bind:this={navContainer}>
            {#each items as item}
                <button
                    class="relative flex items-center p-2 pl-1 w-full whitespace-nowrap
                        {item[valueKey] === value && 'bg-gray-100 dark:bg-gray-700 dark:bg-opacity-20'}
                        hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20
                        focus:bg-gray-200 dark:focus:bg-gray-600 dark:focus:bg-opacity-20"
                    id={item[valueKey]}
                    on:click={() => onSelect(item)}
                    on:focus={() => focusItem(item[valueKey])}
                    tabindex={dropdown ? 0 : -1}
                    class:active={item[valueKey] === value}
                    ><Text type={itemTextType} smaller>{item[valueKey]}</Text></button
                >
            {/each}
        </div>
    </nav>
</dropdown-input>

<style type="text/scss">
    dropdown-input {
        @apply block;
        .selection {
            min-height: 50px;
            border-radius: 0.625rem; // TODO: add to tailwind
            @apply border-solid;
            @apply border;
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

                @apply rounded-lg;
            }
            nav {
                top: 36px;
                @apply rounded-lg;
                @apply rounded-tl-none;
                @apply rounded-tr-none;
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
    }
</style>
