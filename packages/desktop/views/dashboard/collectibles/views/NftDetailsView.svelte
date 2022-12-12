<script lang="typescript">
    import { openPopup } from '@auxiliary/popup'
    import { selectedAccountIndex } from '@core/account'
    import { openUrlInBrowser } from '@core/app'
    import { localize } from '@core/i18n'
    import { ExplorerEndpoint, getOfficialExplorerUrl } from '@core/network'
    import { BASE_TOKEN } from '@core/network/constants'
    import { convertAndFormatNftMetadata, getNftByIdFromAllAccountNfts, INft, selectedNftId } from '@core/nfts'
    import { activeProfile } from '@core/profile/stores'
    import { truncateString } from '@core/utils'
    import {
        ActivityType,
        ADDRESS_TYPE_ALIAS,
        ADDRESS_TYPE_ED25519,
        ADDRESS_TYPE_NFT,
        formatTokenAmountPrecise,
        getBech32AddressFromAddressTypes,
        getHexAddressFromAddressTypes,
    } from '@core/wallet'
    import { NewTransactionType, selectedAccountActivities, setNewTransactionDetails } from '@core/wallet/stores'
    import {
        Button,
        CollectibleDetailsMenu,
        FontWeight,
        KeyValueBox,
        MeatballMenuButton,
        Modal,
        NftMedia,
        Pane,
        Text,
        TextType,
    } from 'shared/components'

    let modal: Modal

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.networkProtocol, $activeProfile?.networkType)
    const nft: INft = getNftByIdFromAllAccountNfts($selectedAccountIndex, $selectedNftId)

    const { id, name, issuer, address, metadata } = nft ?? {}
    const { standard, version, type, uri, description, issuerName, collectionName, attributes } =
        nft?.parsedMetadata || {}

    const issuerAddress = getBech32AddressFromAddressTypes(issuer)
    const collectionId = getHexAddressFromAddressTypes(issuer)

    $: nftActivity = $selectedAccountActivities.find(
        (activity) => activity?.type === ActivityType.Nft && activity?.nftId === id
    )
    $: storageDeposit = formatTokenAmountPrecise(
        nftActivity?.storageDeposit ?? 0,
        BASE_TOKEN[$activeProfile?.networkProtocol]
    )

    $: formattedMetadata = convertAndFormatNftMetadata(metadata)

    let detailsList: {
        [key in string]: {
            data: string
            copyValue?: string
            isCopyable?: boolean
            isPreText?: boolean
            maxHeight?: number
        }
    }
    $: detailsList = {
        ...(id && {
            nftId: { data: truncateString(id, 20, 20), copyValue: id, isCopyable: true },
        }),
        ...(address && {
            address: { data: truncateString(address, 20, 20), copyValue: address, isCopyable: true },
        }),
        ...(storageDeposit && {
            storageDeposit: { data: String(storageDeposit) },
        }),
        ...(standard && {
            standard: { data: version ? `${standard} - ${version}` : standard },
        }),
        ...(type && {
            type: { data: type },
        }),
        ...(uri && {
            uri: { data: uri, copyValue: uri, isCopyable: true },
        }),
        ...(issuerName && {
            issuer: { data: issuerName },
        }),
        ...(issuer?.type === ADDRESS_TYPE_ED25519 && {
            issuerAddress: { data: truncateString(issuerAddress, 20, 20), copyValue: issuerAddress, isCopyable: true },
        }),
        ...(collectionName && {
            collection: { data: collectionName },
        }),
        ...((issuer?.type === ADDRESS_TYPE_NFT || issuer?.type === ADDRESS_TYPE_ALIAS) && {
            collectionId: { data: truncateString(collectionId, 20, 20), copyValue: collectionId, isCopyable: true },
        }),
        ...(!nft?.parsedMetadata &&
            formattedMetadata && {
                metadata: { data: formattedMetadata, isCopyable: true, isPreText: true, maxHeight: 72 },
            }),
    }

    function handleExplorerClick(): void {
        openUrlInBrowser(`${explorerUrl}/${ExplorerEndpoint.Nft}/${id}`)
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

    // width = 'w-96'
    //             height = 'h-96'
    //             // squircle or circle
    //             radius = shape === 'squircle' ? '2xl' : 'full'
    //             bgColor = 'gray-200'
    //             darkBgColor = 'gray-700'
</script>

<div class="flex flex-row w-full h-full space-x-4">
    <div class="flex w-full h-full items-center justify-center">
        <div class="relative w-full h-full flex">
            <NftMedia
                nftId={id}
                classes="rounded-2xl overflow-hidden flex-1 w-auto h-auto max-w-full max-h-full object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
        </div>
    </div>
    <Pane classes="flex flex-col p-6 space-y-3 w-full h-full max-w-lg">
        <nft-title class="flex justify-between items-center">
            <Text type={TextType.h3} fontWeight={FontWeight.semibold}>{name}</Text>
            <MeatballMenuButton onClick={modal?.toggle} />
            <CollectibleDetailsMenu bind:modal {nft} />
        </nft-title>
        {#if description}
            <nft-description>
                <Text type={TextType.h5} fontWeight={FontWeight.normal} color="gray-700">
                    {description}
                </Text>
            </nft-description>
        {/if}
        <div class="overflow-y-scroll h-full flex flex-col space-y-4">
            <nft-details class="flex flex-col space-y-4">
                <Text type={TextType.h5} fontWeight={FontWeight.semibold}>
                    {localize('general.details')}
                </Text>
                <key-value-list class="flex flex-col space-y-2">
                    {#each Object.entries(detailsList) as [key, value]}
                        <KeyValueBox
                            keyText={localize('general.' + key)}
                            copyValue={value.copyValue ?? value.data}
                            isCopyable={value.isCopyable}
                            valueText={value.data}
                            isPreText={value.isPreText}
                            maxHeight={value.maxHeight}
                        />
                    {/each}
                </key-value-list>
            </nft-details>
            {#if attributes}
                <nft-attributes class="flex flex-col space-y-4">
                    <Text type={TextType.h5} fontWeight={FontWeight.semibold}>
                        {localize('general.attributes')}
                    </Text>
                    <div class="flex flex-wrap gap-3">
                        {#each Object.values(attributes) as attribute}
                            <KeyValueBox keyText={attribute.trait_type} valueText={attribute.value} shrink />
                        {/each}
                    </div>
                </nft-attributes>
            {/if}
        </div>
        <div class="flex w-full space-x-4 self-end mt-auto pt-4">
            <Button outline classes="flex-1" onClick={handleExplorerClick} disabled={!explorerUrl}>
                {localize('general.viewOnExplorer')}
            </Button>
            <Button classes="flex-1" onClick={handleSendClick}>{localize('actions.send')}</Button>
        </div>
    </Pane>
</div>
