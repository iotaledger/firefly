<script lang="ts">
    import { Icon } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let icon: IconEnum
    export let active: boolean = false
    export let onClick: () => void = () => {}
    export let classes: string = ''

    function clickToggle(): void {
        active = !active
        onClick && onClick()
    }
</script>

<button on:click={clickToggle} class={classes}>
    <Icon
        {icon}
        classes="
            cursor-pointer
            {active
            ? 'text-blue-500 dark:text-blue-500'
            : 'text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 '}
        "
    />
</button>
