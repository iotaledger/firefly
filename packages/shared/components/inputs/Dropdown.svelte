<script>
    import { Icon, Text } from 'shared/components'
    export let value = undefined
    export let label = undefined
    export let disabled = false
    export let valueKey = 'label'
    export let sortItems = false
    export let items = []
    export let onSelect = () => {}
    let dropdown = false
    const clickOutside = () => {
        dropdown = false
    }

    items = sortItems ? items.sort((a, b) => (a.label > b.label) ? 1 : -1) : items
</script>

<style type="text/scss">
    dropdown-input {
        transition: border-color 0.25s;
        :global(svg) {
            right: 12px; // TODO: unable to use tailwind inset
        }
        &.disabled {
            @apply pointer-events-none;
            @apply bg-gray-100;
        }
    }
    nav {
        transition: opacity 0.25s;
        top: 50px; // TODO: unable to use tailwind inset
        left: 0px; // TODO: unable to use tailwind inset
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
</style>

<svelte:window on:click={clickOutside} />
{#if label}
    <Text type="p" classes="mb-2" smaller>{label}</Text>
{/if}
<dropdown-input
    class="relative flex items-center mb-5 py-4 pr-8 pl-4 w-full 
                bg-white border border-solid border-gray-300 hover:border-gray-500 rounded-xl cursor-pointer"
    on:click={(e) => {
        e.stopPropagation()
        dropdown = !dropdown
    }}
    class:disabled>
    <Text type="p" smaller {disabled}>{value}</Text>
    <Icon icon="arrow-down" classes="absolute text-gray-500 fill-current" />
    <nav
        class:active={dropdown}
        class="absolute w-full overflow-y-auto bg-white border border-solid border-gray-500 rounded-xl pointer-events-none opacity-0 z-10 text-left">
        {#each items as item}
            <button
                class="relative flex items-center bg-white p-4 w-full"
                on:click={() => onSelect(item)}
                class:active={item[valueKey] === value}><Text type="p" smaller>{item[valueKey]}</Text></button>
        {/each}
    </nav>
</dropdown-input>
