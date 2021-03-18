<script lang="typescript">
    import { Icon } from 'shared/components'

    export let value = undefined
    export let group = undefined
    export let label = ''
    export let classes = ''
</script>

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
                @apply border-0;
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

<label class="w-full flex items-center mb-4 text-12 leading-160 cursor-pointer text-gray-800 dark:text-white {classes}">
    <input class="absolute left-0 opacity-0 h-4 w-4 cursor-pointer" type="radio" bind:group {value} />
    <div class="w-6 h-6 mr-3 rounded-full border border-solid border-gray-300" class:active={value === group}>
        <Icon icon={value === group ? 'radio' : 'radio-unchecked'} />
    </div>
    {label}
</label>
