<script type="typescript">
    import { Icon } from 'shared/components'

    export let active: boolean
    export let icon: string
</script>

<button on:click={() => (active = !active)}>
    <Icon
        {icon}
        classes="cursor-pointer ml-2 {active
            ? 'text-blue-500 dark:text-blue-500'
            : 'text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-gray-100 '}"
    />
</button>
