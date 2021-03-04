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
            stroke: var(--text-disabled-color);
            fill: white;
        }
        :global(svg.active path) {
            stroke: var(--text-disabled-color);
            @apply text-blue-500;
            @apply fill-current;
        }

        &:hover,
        &:focus-within {
            :global(svg path) {
                stroke: #9aadce;
            }
        }

        input {
            position: absolute;
            left: 0;
            opacity: 0;
        }
    }
</style>

<label class={`w-full flex items-center mb-4 text-12 leading-160 cursor-pointer text-gray-800 dark:text-white ${classes}`}>
    <input class="h-4 w-4 cursor-pointer" type="radio" bind:group {value} />
    <Icon icon={value === group ? 'radio' : 'radio-unchecked'} classes={`mr-3 ${value === group ? 'active' : ''}`} />
    {label}
</label>
