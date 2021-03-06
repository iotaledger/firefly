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
            stroke: white;
            fill: none;
        }
        input {
            position: absolute;
            left: 0;
            opacity: 0;
        }

        .svg-container {
            width: 24px;
            height: 24px;

            &.active {
                border-width: 0;
                background-color: var(--ui-blue-color);
            }
        }

        &:hover,
        &:focus-within {
            .svg-container {
                border-color: var(--ui-blue-color);
            }
        }
    }
</style>

<label
    class={`w-full flex items-center mb-4 text-12 leading-160 cursor-pointer text-gray-800 dark:text-white ${classes}`}>
    <input class="h-4 w-4 cursor-pointer" type="radio" bind:group {value} />
    <div class={`mr-3 svg-container rounded-full border border-solid border-gray-300 ${value === group ? "active" : ""}`}>
        <Icon icon={value === group ? 'radio' : 'radio-unchecked'} />
    </div>
    {label}
</label>
