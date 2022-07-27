<script lang="typescript">
    import {
        Button,
        CollectibleDetailsMenu,
        Icon,
        Illustration,
        KebabButton,
        KeyValueBox,
        Modal,
        Pane,
        Text,
    } from 'shared/components'
    import { localize } from '@core/i18n'

    export let id: string = 'vt7ryeasd6f5hfh689w'
    export let name: string = 'IOTABOTS #5'
    export let collection: string = 'IOTABOTS'
    export let collectionUrl: string = 'https://iotabots.io'
    export let type: string = 'IRC27'
    export let storageDeposit: string = '0.5 MI'
    export let attributes: { title: string; value: string | number | boolean }[] = [
        {
            title: 'Background',
            value: 'Purple',
        },
        {
            title: 'Element',
            value: 'Water',
        },
        {
            title: 'Attack',
            value: 150,
        },
        {
            title: 'Super Long Attribute',
            value: 2000,
        },
        {
            title: 'Another Attribute',
            value: 1000,
        },

        {
            title: 'Long Attribute',
            value: 2000,
        },
        {
            title: 'Another Attribute',
            value: 1000,
        },
    ]

    let modal: Modal

    $: displayedId = id.substring(0, 6) + '...' + id.substring(id.length - 6, id.length)
</script>

<div class="flex flex-row w-full space-x-4 overflow-auto">
    <div class="w-full h-full">
        <Illustration illustration="shimmer-info-bg" />
    </div>
    <Pane classes="flex flex-col p-6 w-full h-full">
        <div class="mb-6 flex justify-between items-center">
            <Text type="h2">{name}</Text>
            <KebabButton onClick={modal?.toggle} />
            <CollectibleDetailsMenu bind:modal />
        </div>
        <div class="overflow-y-scroll h-full">
            <div class="space-y-2 mb-6">
                <KeyValueBox keyText={localize('views.collectibles.details.collection')}>
                    <a slot="value" href={collectionUrl} class="flex items-center" target="_blank">
                        <Icon icon="export" classes="text-gray-600 dark:text-gray-500 mr-1 w-4 h-4" />
                        <Text fontSize="14" lineHeight="5" color="gray-600" darkColor="gray-500" classes="truncate">
                            {collection}
                        </Text>
                    </a>
                </KeyValueBox>
                <KeyValueBox
                    keyText={localize('views.collectibles.details.nftId')}
                    copyValue={id}
                    isCopyable
                    clearPadding
                >
                    <div slot="value" class="flex items-center">
                        <Icon icon="copy" classes="text-gray-600 dark:text-gray-500 mr-1 w-4 h-4" />
                        <Text fontSize="14" lineHeight="5" color="gray-600" darkColor="gray-500" classes="truncate">
                            {displayedId}
                        </Text>
                    </div>
                </KeyValueBox>
                <KeyValueBox keyText={localize('views.collectibles.details.nftType')} valueText={type} />
                <KeyValueBox valueText={storageDeposit}>
                    <div slot="key" class="flex items-center mr-4">
                        <Text fontSize="14" lineHeight="5" color="gray-600" darkColor="gray-500" classes="mr-1">
                            {localize('views.collectibles.details.storageDeposit')}
                        </Text>
                        <Icon icon="info" classes="text-gray-600 dark:text-gray-500 w-4 h-4" />
                    </div>
                </KeyValueBox>
            </div>
            <div>
                <Text type="h3" classes="mb-4">{localize('views.collectibles.details.attributes')}</Text>
                <div class="flex flex-wrap">
                    {#each attributes as attribute}
                        <div class="flex flex-col bg-gray-50 dark:bg-gray-850 rounded-2xl text-gray-800 p-3 mr-3 mb-3">
                            <Text type="p" color="gray-500" darkColor="gray-500" bold>{attribute.title}</Text>
                            <Text type="p" color="gray-800" darkColor="gray-400" bold>{attribute.value}</Text>
                        </div>
                    {/each}
                    {#each attributes as attribute}
                        <div class="flex flex-col bg-gray-50 dark:bg-gray-850 rounded-2xl text-gray-800 p-3 mr-3 mb-3">
                            <Text type="p" color="gray-500" darkColor="gray-500" bold>{attribute.title}</Text>
                            <Text type="p" color="gray-800" darkColor="gray-400" bold>{attribute.value}</Text>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
        <div class="flex w-full space-x-4 self-end mt-auto pt-4">
            <Button secondary classes="flex-1">{localize('general.viewOnExplorer')}</Button>
            <Button classes="flex-1">{localize('actions.send')}</Button>
        </div>
    </Pane>
</div>
