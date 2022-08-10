<script type="typescript">
    import { Icon } from 'shared/components'

    export let active: boolean
    export let icon: string
    export let onClick: () => void = () => {}

    function clickToggle() {
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
