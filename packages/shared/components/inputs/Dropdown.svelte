<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { clickOutside } from 'shared/lib/actions'

    export let value = undefined
    export let label = undefined
    export let placeholder = undefined
    export let disabled = false
    export let valueKey = 'label'
    export let sortItems = false
    export let items = []
    export let small = false
    export let onSelect = (_) => {}

    let dropdown = false
    let navContainer

    items = sortItems ? items.sort((a, b) => (a.label > b.label ? 1 : -1)) : items

    const handleClickOutside = () => {
        dropdown = false
    }
</script>

<style type="text/scss">
    dropdown-input {
        @apply block;
        .selection {
            min-height: 50px;
            border-radius: 0.625rem; // TODO: add to tailwind
            @apply border;
            @apply border-solid;
            @apply py-4;
            @apply pl-4;
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
                @apply pt-5;
                @apply pb-3;
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
            @apply left-4;
            @apply select-none;
            @apply whitespace-nowrap;
            @apply w-full;
            top: 7px;
            &.floating-active {
                @apply opacity-100;
                transform: none;
            }
        }
    }
</style>

<dropdown-input
    class="w-full relative"
    on:click={(e) => {
        e.stopPropagation()
        dropdown = !dropdown
        if (dropdown) {
            const elem = document.getElementById(value)
            if (elem) {
                navContainer.scrollTop = elem.offsetTop
            }
        }
    }}
    use:clickOutside
    on:clickOutside={handleClickOutside}
    class:active={dropdown}
    class:small
    class:floating-active={value && label}
    class:disabled>
    <div
        class="selection relative flex items-center w-full whitespace-nowrap cursor-pointer
    bg-white dark:bg-gray-800 {dropdown ? 'border-blue-500' : 'border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700'}">
        <div class="w-full text-12 leading-140 {disabled ? 'text-gray-400 dark:text-gray-700' : 'text-gray-800 dark:text-white'}">
            {value || placeholder}
        </div>
        <Icon
            icon={small ? 'small-chevron-down' : 'chevron-down'}
            width={small ? 16 : 24}
            height={small ? 16 : 24}
            classes="absolute text-gray-500 fill-current" />
        {#if label}
            <floating-label
                class="block text-gray-500 text-11 leading-120 overflow-hidden opacity-0 pointer-events-none absolute top-2 left-4 select-none whitespace-nowrap w-full"
                class:floating-active={value && label}>
                {label}
            </floating-label>
        {/if}
    </div>
    <nav
        class:active={dropdown}
        class="absolute w-full overflow-hidden pointer-events-none opacity-0 z-10 text-left 
        bg-white dark:bg-gray-800
            border border-solid border-t-0 border-blue-500">
        <div class="inner overflow-y-auto" bind:this={navContainer}>
            {#each items as item, index}
                <button
                    class="relative flex items-center p-4 w-full whitespace-nowrap {index === 0 && 'border-t border-solid border-gray-300 dark:border-gray-700'}
                        {item[valueKey] === value && 'bg-gray-100 dark:bg-gray-700 dark:bg-opacity-20'} 
                        hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
                    id={item[valueKey]}
                    on:click={() => onSelect(item)}
                    class:active={item[valueKey] === value}><Text type="p" smaller>{item[valueKey]}</Text></button>
            {/each}
        </div>
    </nav>
</dropdown-input>
