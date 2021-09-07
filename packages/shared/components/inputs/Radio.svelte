<script lang="typescript">
    import { Icon } from 'shared/components'

    export let value = undefined
    export let group = undefined
    export let label = ''
    export let classes = ''
    export let tabindex
    export let disabled = false
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
                @apply border-transparent;
                @apply bg-blue-500;
            }
        }

        &:hover,
        &:focus-within {
            div:not(input:disabled) {
                @apply border-blue-500;
            }
        }

        &:disabled {
            @apply pointer-events-none
        }
    }
</style>

<label class={`flex items-center ${label ? 'mb-4' : ''} text-12 leading-160 cursor-pointer text-gray-${disabled ? 400 : 800} dark:text-white ${classes}`}>
    <input class="absolute left-0 opacity-0 h-4 w-4 {disabled ? '' : 'cursor-pointer'}" type="radio" bind:group {value} {tabindex} {disabled}/>
    <div class={`mr-3 svg-container rounded-full border border-solid border-gray-300 ${value === group ? 'active' : ''}`}>
        <Icon icon={value === group ? 'radio' : 'radio-unchecked'} />
    </div>
    {label}
</label>
