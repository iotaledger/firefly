<script lang="typescript">
    import { localize } from '@core/i18n'
    import { HR, Icon, Modal, Text } from 'shared/components'
    import { diffDates } from 'shared/lib/helpers'
    import { activeProfile } from 'shared/lib/profile'
    import { fade } from 'svelte/transition'

    export let modal: Modal
    export let value

    function onClick(_value): void {
        modal?.close()
        value = _value
    }
</script>

<Modal bind:this={modal} position={{ bottom: '120px', left: '400px' }} classes="w-64">
    <expiration-time-picker-modal class="flex flex-col" in:fade={{ duration: 100 }}>
        <button
            on:click={() => onClick('None')}
            class="group flex flex-row space-x-3 justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon="calendar" classes="text-gray-500 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">
                {localize('menus.expirationTimePicker.none')}
            </Text>
        </button>
        <HR />
        <button
            on:click={() => onClick('1 hour')}
            class="group flex flex-row space-x-3 justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon="calendar" classes="text-gray-500 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">
                {localize('menus.expirationTimePicker.1hour')}
            </Text>
        </button>
        <button
            on:click={() => onClick('1 day')}
            class="group flex flex-row space-x-3 justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon="calendar" classes="text-gray-500 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">
                {localize('menus.expirationTimePicker.1day')}
            </Text>
        </button>
        <button
            on:click={() => onClick('1 week')}
            class="group flex flex-row space-x-3 justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon="calendar" classes="text-gray-500 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">
                {localize('menus.expirationTimePicker.1week')}
            </Text>
        </button>
        <HR />
        <button
            on:click={() => onClick('Custome time')}
            class="group flex flex-row space-x-3 justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon="calendar" classes="text-gray-500 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">
                {localize('menus.expirationTimePicker.customDate')}
            </Text>
        </button>
    </expiration-time-picker-modal>
</Modal>
