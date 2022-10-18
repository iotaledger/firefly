<script type="typescript">
    import { Icon } from 'shared/components'

    export let icon: string
    export let active: boolean = false
    export let onClick: () => void = () => {}

    function clickToggle(): void {
        active = !active
        onClick && onClick()
    }
</script>

<button on:click={clickToggle}>
    <Icon
        {icon}
        classes="
            cursor-pointer ml-2 
            {active
            ? 'text-blue-500 dark:text-blue-500'
            : 'text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 '}
        "
    />
</button>
