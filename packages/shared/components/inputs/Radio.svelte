<script lang="typescript">
    import { Icon } from 'shared/components'
    import { createEventDispatcher } from 'svelte'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    export let value = undefined
    export let group = undefined
    export let label = ''
    export let classes = ''
    export let tabindex

    const dispatch = createEventDispatcher()
</script>

<label
    class={`flex items-center ${
        label ? 'mb-4' : ''
    } text-12 leading-160 cursor-pointer text-gray-800 dark:text-white ${classes}`}
>
    <input
        class="absolute left-0 opacity-0 h-4 w-4 cursor-pointer"
        type="radio"
        bind:group
        {value}
        {tabindex}
        on:change={() => dispatch('change')}
    />
    <div
        class={`mr-3 svg-container rounded-full border border-solid border-gray-300 ${value === group ? 'active' : ''}`}
    >
        <Icon icon={value === group ? IconEnum.Radio : IconEnum.RadioUnchecked} />
    </div>
    {label}
</label>

<style type="text/scss">
    label {
        position: relative;
        :global(svg path) {
            @apply text-white;
            @apply stroke-current;
            fill: none;
        }
        div {
            &.active {
                @apply border-transparent;
                @apply bg-blue-500;
            }
        }

        &:hover,
        &:focus-within {
            div {
                @apply border-blue-500;
            }
        }
    }
</style>
