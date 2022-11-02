<script lang="typescript">
    import {
        Button,
        CollectibleDetailsMenu,
        Icon,
        MeatballMenuButton,
        KeyValueBox,
        Modal,
        Pane,
        Text,
    } from 'shared/components'
    import { localize } from '@core/i18n'
    import { selectedNftId } from '../stores/selected-nft.store'
    import { getNftByIdFromAllAccountNfts, INft } from '@core/nfts'
    import { selectedAccountIndex } from '@core/account'
    import { truncateString } from '@core/utils'

    const nft: INft = getNftByIdFromAllAccountNfts($selectedAccountIndex, $selectedNftId)

    const { id, name } = nft
    const { type, collectionName, attributes } = nft.parsedMetadata

    let modal: Modal

    const storageDeposit = 0
</script>

<div class="flex flex-row w-full space-x-4 overflow-auto">
    <div class="w-full h-full bg-orange-300 rounded-2xl">
        <!-- NFT asset goes here -->
    </div>
    <Pane classes="flex flex-col p-6 w-full h-full max-w-lg">
        <div class="mb-6 flex justify-between items-center">
            <Text type="h2">{name}</Text>
            <MeatballMenuButton onClick={modal?.toggle} />
            <CollectibleDetailsMenu bind:modal />
        </div>
        <div class="overflow-y-scroll h-full">
            <div class="space-y-2 mb-6">
                <KeyValueBox keyText={localize('views.collectibles.details.collection')}>
                    {collectionName}
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
                            {truncateString(id, 6, 6)}
                        </Text>
                    </div>
                </KeyValueBox>
                <KeyValueBox keyText={localize('views.collectibles.details.nftType')} valueText={type} />
                <KeyValueBox
                    keyText={localize('views.collectibles.details.storageDeposit')}
                    tooltipText={localize('views.collectibles.details.storageDepositDescription')}
                    valueText={storageDeposit}
                />
            </div>
            {#if attributes}
                <div>
                    <Text type="h3" classes="mb-4">{localize('views.collectibles.details.attributes')}</Text>
                    <div class="flex flex-wrap">
                        {#each Object.values(attributes) as attribute}
                            <div
                                class="flex flex-col bg-gray-50 dark:bg-gray-850 rounded-2xl text-gray-800 p-3 mr-3 mb-3"
                            >
                                <Text type="p" color="gray-500" darkColor="gray-500" bold>{attribute.trait_type}</Text>
                                <Text type="p" color="gray-800" darkColor="gray-400" bold>{attribute.value}</Text>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
        <div class="flex w-full space-x-4 self-end mt-auto pt-4">
            <Button outline classes="flex-1">{localize('general.viewOnExplorer')}</Button>
            <Button classes="flex-1">{localize('actions.send')}</Button>
        </div>
    </Pane>
</div>
