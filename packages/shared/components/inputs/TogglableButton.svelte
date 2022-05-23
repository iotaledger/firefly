<script type="typescript">
    import { Icon } from 'shared/components'

    export let active: boolean
    export let icon: string
</script>

<button on:click={() => (active = !active)}>
    <Icon
        {icon}
        classes="text-gray-500 rounded hover:text-gray-600 dark:text-white dark:hover:text-gray-100
    cursor-pointer ml-2 {active ? 'bg-gray-50' : ''}"
    />
</button>
