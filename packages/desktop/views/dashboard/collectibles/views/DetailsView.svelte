<script lang="typescript">
    import {
        Button,
        CollectibleDetailsMenu,
        FontWeight,
        NftMediaContainer,
        NftMediaSize,
        MeatballMenuButton,
        KeyValueBox,
        TextType,
        Modal,
        Pane,
        Text,
    } from 'shared/components'
    import { localize } from '@core/i18n'
    import { selectedNftId } from '../stores/selected-nft.store'
    import { getNftByIdFromAllAccountNfts, INft } from '@core/nfts'
    import { selectedAccountIndex } from '@core/account'
    import { truncateString } from '@core/utils'
    import { NewTransactionType, selectedAccountActivities, setNewTransactionDetails } from '@core/wallet/stores'
    import { ActivityType, formatTokenAmountPrecise } from '@core/wallet'
    import { BASE_TOKEN } from '@core/network/constants'
    import { activeProfile } from '@core/profile/stores'
    import { Platform } from '@core/app'
    import { ExplorerEndpoint, getOfficialExplorerUrl } from '@core/network'
    import { openPopup } from '@auxiliary/popup'

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.networkProtocol, $activeProfile?.networkType)
    const nft: INft = getNftByIdFromAllAccountNfts($selectedAccountIndex, $selectedNftId)

    const { id, name } = nft
    const { standard, collectionName, attributes } = nft.parsedMetadata || {}

    let modal: Modal

    $: nftActivity = $selectedAccountActivities.find(
        (activity) => activity.type === ActivityType.Nft && activity.nftId === id
    )
    $: storageDeposit = formatTokenAmountPrecise(
        nftActivity?.storageDeposit ?? 0,
        BASE_TOKEN[$activeProfile?.networkProtocol]
    )

    let detailsList: { [key in string]: { data: string; copyValue?: string; isCopyable?: boolean } }
    $: detailsList = {
        ...(collectionName && {
            collection: { data: collectionName, isCopyable: true },
        }),
        ...(id && {
            nftId: { data: truncateString(id, 6, 6), copyValue: id, isCopyable: true },
        }),
        ...(standard && {
            nftType: { data: standard },
        }),
        ...(storageDeposit && {
            storageDeposit: { data: String(storageDeposit) },
        }),
    }

    function handleExplorerClick(): void {
        Platform.openUrl(`${explorerUrl}/${ExplorerEndpoint.Nft}/${id}`)
    }

    function handleSendClick(): void {
        setNewTransactionDetails({
            type: NewTransactionType.NftTransfer,
            nftId: id,
            recipient: undefined,
            disableAssetSelection: true,
        })
        openPopup({
            type: 'sendForm',
            overflow: true,
        })
    }
</script>

<div class="flex flex-row w-full h-full space-x-4 overflow-auto">
    <div class="flex w-full h-full bg-gray-500 items-center justify-center rounded-2xl">
        <NftMediaContainer nftId={id} size={NftMediaSize.ExtraLarge} />
    </div>
    <Pane classes="flex flex-col p-6 w-full h-full max-w-lg">
        <div class="mb-6 flex justify-between items-center">
            <Text type={TextType.h3} fontWeight={FontWeight.semibold}>{name}</Text>
            <MeatballMenuButton onClick={modal?.toggle} />
            <CollectibleDetailsMenu bind:modal {nft} />
        </div>
        <div class="overflow-y-scroll h-full">
            <div class="space-y-2 mb-6">
                {#each Object.entries(detailsList) as [key, value]}
                    <KeyValueBox
                        keyText={localize('views.collectibles.details.' + key)}
                        copyValue={value.copyValue ?? value.data}
                        isCopyable={value.isCopyable}
                        valueText={value.data}
                    />
                {/each}
            </div>
            {#if attributes}
                <div>
                    <Text type={TextType.h5} fontWeight={FontWeight.semibold} classes="mb-4"
                        >{localize('views.collectibles.details.attributes')}</Text
                    >
                    <div class="flex flex-wrap gap-3">
                        {#each Object.values(attributes) as attribute}
                            <div
                                class="flex flex-col bg-gray-50 dark:bg-gray-850 rounded-2xl p-3"
                                style="max-width: 100px"
                            >
                                <Text
                                    color="gray-500"
                                    darkColor="gray-500"
                                    classes="truncate"
                                    fontWeight={FontWeight.semibold}>{attribute.trait_type}</Text
                                >
                                <Text
                                    color="gray-800"
                                    darkColor="gray-400"
                                    classes="truncate"
                                    fontWeight={FontWeight.semibold}>{attribute.value}</Text
                                >
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
        <div class="flex w-full space-x-4 self-end mt-auto pt-4">
            <Button outline classes="flex-1" onClick={handleExplorerClick} disabled={!explorerUrl}
                >{localize('general.viewOnExplorer')}</Button
            >
            <Button classes="flex-1" onClick={handleSendClick}>{localize('actions.send')}</Button>
        </div>
    </Pane>
</div>
