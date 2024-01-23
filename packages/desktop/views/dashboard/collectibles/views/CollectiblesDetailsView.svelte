<script lang="ts">
    import { openPopup, PopupId } from '@auxiliary/popup'
    import { selectedWalletId } from '@core/wallet/stores'
    import { time } from '@core/app'
    import { openUrlInBrowser } from '@core/app/utils'
    import { localize } from '@core/i18n'
    import { ExplorerEndpoint, getOfficialExplorerUrl } from '@core/network'
    import {
        INft,
        NftDownloadMetadata,
        allWalletNfts,
        convertAndFormatNftMetadata,
        getNftByIdFromAllWalletNfts,
        selectedNftId,
    } from '@core/nfts'
    import { getBaseToken } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { collectiblesRouter } from '@core/router/routers'
    import { truncateString } from '@core/utils'
    import {
        ADDRESS_TYPE_ALIAS,
        ADDRESS_TYPE_ED25519,
        ADDRESS_TYPE_NFT,
        formatTokenAmountPrecise,
        getBech32AddressFromAddressTypes,
        getHexAddressFromAddressTypes,
        getTimeDifference,
    } from '@core/wallet'
    import { NewTransactionType, setNewTransactionDetails } from '@core/wallet/stores'
    import {
        Alert,
        Button,
        CollectibleActionsModal,
        KeyValueBox,
        MeatballMenuButton,
        Modal,
        NftMedia,
        Pane,
        Text,
    } from '@ui'
    import { FontWeight, Height, TextType } from '@ui/enums'

    let modal: Modal

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.network?.id)
    const nft: INft = getNftByIdFromAllWalletNfts($selectedWalletId, $selectedNftId)

    const { id, name, issuer, address, metadata, downloadMetadata, storageDeposit } = nft ?? {}
    const { standard, version, type, uri, description, issuerName, collectionName, attributes, soonaverseAttributes } =
        nft?.parsedMetadata || {}

    const issuerAddress = issuer ? getBech32AddressFromAddressTypes(issuer) : undefined
    const collectionId = issuer ? getHexAddressFromAddressTypes(issuer) : undefined

    let detailsList: {
        [key in string]: {
            data: string
            copyValue?: string
            isCopyable?: boolean
            isPreText?: boolean
            maxHeight?: number
        }
    }

    $: formattedMetadata = convertAndFormatNftMetadata(metadata)
    $: returnIfNftWasSent($allWalletNfts[$selectedWalletId], $time)
    $: timeDiff = getTimeDifference(new Date(nft.timelockTime), $time)
    $: alertText = getAlertText(downloadMetadata)
    $: detailsList = {
        ...(id && {
            nftId: { data: truncateString(id, 20, 20), copyValue: id, isCopyable: true },
        }),
        ...(address && {
            address: { data: truncateString(address, 20, 20), copyValue: address, isCopyable: true },
        }),
        ...(storageDeposit && {
            storageDeposit: { data: formatTokenAmountPrecise(storageDeposit, getBaseToken()) },
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

    function returnIfNftWasSent(ownedNfts: INft[], currentTime: Date): void {
        const nft = ownedNfts.find((nft) => nft.id === id)
        const isLocked = nft.timelockTime > currentTime.getTime()
        if (nft?.isSpendable || isLocked) {
            // empty
        } else {
            $collectiblesRouter.previous()
        }
    }

    function onExplorerClick(): void {
        openUrlInBrowser(`${explorerUrl}/${ExplorerEndpoint.Nft}/${id}`)
    }

    function onSendClick(): void {
        setNewTransactionDetails({
            type: NewTransactionType.NftTransfer,
            nftId: id,
            recipient: undefined,
            disableAssetSelection: true,
        })
        openPopup({
            id: PopupId.SendForm,
            overflow: true,
        })
    }

    function getAlertText(downloadMetadata: NftDownloadMetadata): string {
        const { error, warning } = downloadMetadata ?? {}
        const errorOrWarning = error || warning

        if (!errorOrWarning) {
            return
        }

        const { type, message } = errorOrWarning
        return type === 'generic' ? message : localize(`error.nft.${type}.long`)
    }
</script>

<collectibles-details-view class="flex flex-row w-full h-full space-x-4">
    <div class="flex w-full h-full items-center justify-center">
        <div class="relative w-full h-full flex rounded-2xl overflow-hidden">
            <NftMedia
                {nft}
                class="rounded-2xl overflow-hidden flex-1 w-auto h-auto max-w-full max-h-full object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                autoplay
                controls
                loop
                muted
            />
            <div class="absolute right-6 bottom-6 w-auto">
                {#if alertText}
                    <Alert type={downloadMetadata?.error ? 'error' : 'warning'} message={alertText} />
                {/if}
            </div>
        </div>
    </div>
    <div class="max-w-lg">
        <Pane height={Height.Full}>
            <collectibles-details class="flex flex-col space-y-3 w-full max-w-lg h-full">
                <nft-title class="w-full flex flex-row justify-between items-center space-x-2">
                    <div class="break-words w-5/6">
                        <Text type={TextType.h3} fontWeight={FontWeight.semibold}>{name}</Text>
                    </div>
                    <MeatballMenuButton onClick={modal?.toggle} />
                    <CollectibleActionsModal bind:modal {nft} />
                </nft-title>
                {#if description}
                    <nft-description class="break-words">
                        <Text type={TextType.h5} fontWeight={FontWeight.normal} color="gray-700">
                            {description}
                        </Text>
                    </nft-description>
                {/if}
                <div class="overflow-y-scroll h-full flex flex-col space-y-4 pr-2 -mr-4">
                    <nft-details class="flex flex-col space-y-4">
                        <Text type={TextType.h5} fontWeight={FontWeight.semibold}>
                            {localize('general.details')}
                        </Text>
                        <key-value-list class="flex flex-col space-y-2">
                            {#each Object.entries(detailsList) as [key, value]}
                                {#key value}
                                    <KeyValueBox
                                        keyText={localize('general.' + key)}
                                        copyValue={value.copyValue ?? value.data}
                                        isCopyable={value.isCopyable}
                                        valueText={value.data}
                                        isPreText={value.isPreText}
                                        maxHeight={value.maxHeight}
                                    />
                                {/key}
                            {/each}
                        </key-value-list>
                    </nft-details>
                    {#if attributes?.length > 0}
                        <nft-attributes class="flex flex-col space-y-4">
                            <Text type={TextType.h5} fontWeight={FontWeight.semibold}>
                                {localize('general.attributes')}
                            </Text>
                            <div class="flex flex-wrap gap-3">
                                {#each Object.values(attributes) as attribute}
                                    <KeyValueBox
                                        keyText={attribute.trait_type}
                                        valueText={String(attribute.value)}
                                        shrink
                                    />
                                {/each}
                            </div>
                        </nft-attributes>
                    {:else}
                        {#if soonaverseAttributes?.props}
                            <nft-attributes class="flex flex-col space-y-4">
                                <Text type={TextType.h5} fontWeight={FontWeight.semibold}>
                                    {localize('general.properties')}
                                </Text>
                                <div class="flex flex-wrap gap-3">
                                    {#each Object.entries(soonaverseAttributes?.props) as [_key, { label, value }]}
                                        <KeyValueBox keyText={label} valueText={String(value)} shrink />
                                    {/each}
                                </div>
                            </nft-attributes>
                        {/if}
                        {#if soonaverseAttributes?.stats}
                            <nft-attributes class="flex flex-col space-y-4">
                                <Text type={TextType.h5} fontWeight={FontWeight.semibold}>
                                    {localize('general.statistics')}
                                </Text>
                                <div class="flex flex-wrap gap-3">
                                    {#each Object.entries(soonaverseAttributes?.stats) as [_key, { label, value }]}
                                        <KeyValueBox keyText={label} valueText={String(value)} shrink />
                                    {/each}
                                </div>
                            </nft-attributes>
                        {/if}
                    {/if}
                </div>
                <buttons-container class="flex w-full space-x-4 self-end mt-auto pt-4">
                    <Button outline classes="flex-1" onClick={onExplorerClick} disabled={!explorerUrl}>
                        {localize('general.viewOnExplorer')}
                    </Button>
                    <Button classes="flex-1" onClick={onSendClick} disabled={!!timeDiff}>
                        {timeDiff
                            ? localize('popups.balanceBreakdown.locked.title') + ' ' + String(timeDiff)
                            : localize('actions.send')}
                    </Button>
                </buttons-container>
            </collectibles-details>
        </Pane>
    </div>
</collectibles-details-view>
