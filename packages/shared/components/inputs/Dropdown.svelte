<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { clickOutside } from 'shared/lib/actions'

    export let value = undefined
    export let label = undefined
    export let disabled = false
    export let valueKey = 'label'
    export let sortItems = false
    export let items = []
    export let small = false
    export let onSelect = (_) => {}

    let dropdown = false

    items = sortItems ? items.sort((a, b) => (a.label > b.label ? 1 : -1)) : items

    const handleClickOutside = () => {
        dropdown = false
    }
</script>

<style type="text/scss">
    dropdown-input {
        min-height: 48px;
        @apply py-4;
        @apply pl-4;
        @apply pr-10;
        @apply rounded-xl;
        :global(svg) {
            @apply right-3;
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
            @apply left-0;
            @apply rounded-xl;
            &.active {
                @apply opacity-100;
                @apply pointer-events-auto;
            }
        }
        &.small {
            min-height: 32px;
            @apply py-2.5;
            @apply pl-3;
            @apply pr-8;
            @apply rounded-lg;
            nav {
                top: 38px;
                @apply rounded-lg;
            }
            :global(svg) {
                @apply right-2;
            }
        }
    }
</style>

{#if label}
    <Text type="p" classes="mb-2 {disabled && 'opacity-50'}" smaller>{label}</Text>
{/if}
<dropdown-input
    class="relative flex items-center w-full whitespace-nowrap cursor-pointer border border-solid
    bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
    on:click={(e) => {
        e.stopPropagation()
        dropdown = !dropdown
        const elem = document.getElementById(value)
        if (elem) {
            elem.scrollIntoView()
        }
    }}
    use:clickOutside
    on:clickOutside={handleClickOutside}
    class:small
    class:disabled>
    <Text type="p" smaller>{value}</Text>
    <Icon icon="chevron-down" classes="absolute text-gray-500 fill-current" />
    <nav
        class:active={dropdown}
        class="absolute w-full overflow-hidden pointer-events-none opacity-0 z-10 text-left 
        bg-gray-50 dark:bg-gray-800
            border border-solid border-gray-300 hover:border-gray-500 dark:border-gray-700 dark:hover:border-gray-700">
        <div class="inner overflow-y-auto">
            {#each items as item}
                <button
                    class="relative flex items-center p-4 w-full whitespace-nowrap
                        {item[valueKey] === value && 'bg-gray-100 dark:bg-gray-700 dark:bg-opacity-20'} 
                        hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
                    id={item[valueKey]}
                    on:click={() => onSelect(item)}
                    class:active={item[valueKey] === value}><Text type="p" smaller>{item[valueKey]}</Text></button>
            {/each}
        </div>
    </nav>
</dropdown-input>
