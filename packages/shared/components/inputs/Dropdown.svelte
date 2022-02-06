<script lang="typescript">
    import { Icon, Text, Error } from 'shared/components'
    import { clickOutside } from 'shared/lib/actions'
    import { onMount } from 'svelte'

    export let value = undefined
    export let label = undefined
    export let placeholder = undefined
    export let disabled = false
    export let valueKey = 'label'
    export let sortItems = false
    export let items = []
    export let small = false
    export let contentWidth = false
    export let error = ''
    export let classes = ''
    export let autofocus = false
    export let valueTextType = 'p'
    export let itemTextType = 'p'
    export let showBorderWhenClosed = true

    export let onSelect = (..._: any[]): void => {}

    let dropdown = false
    let navContainer
    let divContainer
    let focusedItem
    let search = ''

    items = sortItems ? items.sort((a, b) => (a.label > b.label ? 1 : -1)) : items

    let navWidth

    const handleClickOutside = () => {
        dropdown = false
    }

    const toggleDropDown = () => {
        dropdown = !dropdown
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

    const focusItem = (itemId) => {
        const elem = document.getElementById(itemId)
        focusedItem = elem
    }

    const handleKey = (e) => {
        if (!dropdown) {
            // Note that space uses code not key, this is intentional
            if (e.key === 'Enter' || e.key === 'ArrowDown' || e.code === 'Space') {
                toggleDropDown()
                e.preventDefault()
            }
        } else {
            if (e.key === 'Escape') {
                toggleDropDown()
                e.preventDefault()
            } else if (e.key === 'ArrowDown') {
                if (focusedItem) {
                    const children = [...navContainer.children]
                    const idx = children.indexOf(focusedItem)
                    if (idx < children.length - 1) {
                        children[idx + 1].focus()
                        e.preventDefault()
                    }
                }
            } else if (e.key === 'ArrowUp') {
                if (focusedItem) {
                    const children = [...navContainer.children]
                    const idx = children.indexOf(focusedItem)
                    if (idx > 0) {
                        children[idx - 1].focus()
                        e.preventDefault()
                    }
                }
            } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 122)) {
                const children = [...navContainer.children]
                const itemsValues = items.map(item => item.label.toLowerCase())
                search += e.key
                const idx = itemsValues.findIndex(item => item.includes(search.toLowerCase()))
                if (idx >= 0) {
                    children[idx].focus()
                    e.preventDefault()
                }
            } else if (e.key === 'Backspace') {
                search = search.slice(0, -1)
            }
        }
    }
    onMount(() => {
        if (contentWidth) {
            navWidth = `width: ${navContainer.clientWidth + 8}px`
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
    style={navWidth}>
    <div
        class="selection relative flex items-center w-full whitespace-nowrap cursor-pointer
    bg-white dark:bg-gray-800 focus:border-blue-500 {dropdown ? 'border-blue-500' : showBorderWhenClosed ? 'border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700' : ''}"
        tabindex="0"
        bind:this={divContainer}>
        <div class="w-full text-12 leading-140 text-gray-800 dark:text-white">
            <Text classes="overflow-hidden" type={valueTextType} smaller>
                {search || value || placeholder}
            </Text>
        </div>
        <Icon
            icon={small ? 'small-chevron-down' : 'chevron-down'}
            width={small ? 16 : 24}
            height={small ? 16 : 24}
            classes="absolute text-gray-500 fill-current" />
        {#if label}
            <floating-label class:floating-active={value && label}>{label}</floating-label>
        {/if}
    </div>
    {#if error}
        <Error {error} />
    {/if}
    <nav
        class:active={dropdown}
        class="absolute w-full overflow-hidden pointer-events-none opacity-0 z-10 text-left 
        bg-white dark:bg-gray-800
            border border-solid border-blue-500 border-t-gray-500 dark:border-t-gray-700">
        <div class="inner overflow-y-auto scroll-secondary" bind:this={navContainer}>
            {#each items as item}
                <button
                    class="relative flex items-center p-4 w-full whitespace-nowrap
                        {item[valueKey] === value && 'bg-gray-100 dark:bg-gray-700 dark:bg-opacity-20'} 
                        hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20
                        focus:bg-gray-200 dark:focus:bg-gray-600 dark:focus:bg-opacity-20"
                    id={item[valueKey]}
                    on:click={() => onSelect(item)}
                    on:focus={() => focusItem(item[valueKey])}
                    tabindex={dropdown ? 0 : -1}
                    class:active={item[valueKey] === value}><Text type={itemTextType} smaller>{item[valueKey]}</Text></button>
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
        &.hasBorder {
            .selection {
                @apply border;
            }
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
