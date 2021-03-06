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
    export let onSelect = () => {}

    let dropdown = false

    items = sortItems ? items.sort((a, b) => (a.label > b.label ? 1 : -1)) : items

    const handleClickOutside = () => {
        dropdown = false
    }
</script>

<style type="text/scss">
    dropdown-input {
        transition: border-color 0.25s;
        min-height: 48px;
        @apply py-4;
        @apply pl-4;
        @apply pr-10;
        @apply rounded-xl;
        :global(svg) {
            right: 12px; // TODO: unable to use tailwind inset
        }
        &.disabled {
            @apply pointer-events-none;
            @apply bg-gray-100;
        }
        nav {
            transition: opacity 0.25s;
            top: 50px; // TODO: unable to use tailwind inset
            left: 0px; // TODO: unable to use tailwind inset
            @apply rounded-xl;
            &.active {
                @apply opacity-100;
                @apply pointer-events-auto;
            }
            button {
                &:hover,
                &.active {
                    @apply bg-gray-100;
                }
            }
        }
        &.small {
            min-height: 32px;
            @apply py-2.5;
            @apply pl-3;
            @apply pr-8;
            @apply rounded-lg;
            nav {
                @apply rounded-lg;
            }
            :global(svg) {
                right: 8px; // TODO: unable to use tailwind inset
            }
        }
    }
</style>

{#if label}
    <Text type="p" classes="mb-2" smaller>{label}</Text>
{/if}
<dropdown-input
    class="relative flex items-center w-full 
                bg-white border border-solid border-gray-300 hover:border-gray-500 cursor-pointer"
    on:click={(e) => {
        e.stopPropagation()
        dropdown = !dropdown
    }}
    use:clickOutside
    on:clickOutside={handleClickOutside}
    class:small
    class:disabled>
    <Text type="p" smaller {disabled}>{value}</Text>
    <Icon icon="chevron-down" classes="absolute text-gray-500 fill-current" />
    <nav
        class:active={dropdown}
        class="absolute w-full overflow-y-auto bg-white border border-solid border-gray-500 pointer-events-none opacity-0 z-10 text-left">
        {#each items as item}
            <button
                class="relative flex items-center bg-white p-4 w-full whitespace-nowrap"
                on:click={() => onSelect(item)}
                class:active={item[valueKey] === value}><Text type="p" smaller>{item[valueKey]}</Text></button>
        {/each}
    </nav>
</dropdown-input>
