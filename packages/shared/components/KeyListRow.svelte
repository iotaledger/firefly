<script lang="ts">
    import { Pill } from './pills'
    import { Text, Modal, MeatballMenuButton, MenuItem } from 'shared/components'
    import { localize } from '@core/i18n'
    import { truncateString } from 'shared/lib/core/utils'

    export let key: string

    let modal: Modal | undefined
    const truncatedKey: string = truncateString(key, 12, 12)

    const isPrimary: boolean = false

    function toggleModal(): void {
        modal?.toggle()
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async function onTogglePrimaryKeyClick(): Promise<void> {
        if (isPrimary) {
            // TODO: Implement the logic to set primary key
        }
        toggleModal()
    }

    $: MENU_ITEMS = [
        {
            title: localize(
                `views.accountManagement.details.manageKeys.${isPrimary ? 'unsetAsPrimary' : 'setAsPrimary'}`
            ),
            onClick: onTogglePrimaryKeyClick,
        },
    ]
</script>

<key-list-row
    class="flex flex-row items-center justify-between py-4 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20 border border-solid border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 rounded-2xl overflow-auto"
>
    <div class="flex flex-row items-center space-x-4 overflow-hidden">
        <Text classes="self-start overflow-hidden whitespace-nowrap">
            {truncatedKey}
        </Text>
        {#if isPrimary}
            <Pill
                data={localize('views.accountManagement.details.manageKeys.primary').toLowerCase()}
                textColor="blue-500"
            />
        {/if}
    </div>

    <keys-actions-button>
        <MeatballMenuButton onClick={toggleModal} />
        <Modal bind:this={modal} size="small" position={{ right: '40px' }}>
            {#each MENU_ITEMS as { ...item }}
                <MenuItem {...item} />
            {/each}
        </Modal>
    </keys-actions-button>
</key-list-row>
