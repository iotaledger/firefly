<script lang="typescript">
    import { DownloadErrorType, DownloadWarningType, INft } from '@core/nfts'
    import { Text, FontWeight, NftMedia, TooltipIcon, Position } from 'shared/components'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { selectedNftId } from '@core/nfts/stores'
    import { Icon } from '@auxiliary/icon'
    import { localize } from '@core/i18n'
    import { time } from '@core/app'

    export let nft: INft

    let nftWrapperClientWidth: number
    $: isLocked = nft.timelockTime > $time.getTime()

    function openCollectiblesDetailsView(): void {
        $selectedNftId = nft.id
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
    }

    let tooltipContent
    $: if (nft.downloadMetadata.error) {
        tooltipContent = {
            icon: 'error-filled',
            iconClasses: 'fill-current text-red-700',
            text:
                nft.downloadMetadata.error.type === DownloadErrorType.Generic
                    ? nft.downloadMetadata.error.message
                    : `error.nft.${nft.downloadMetadata.error.type}.short`,
        }
    } else if (nft.downloadMetadata.warning) {
        tooltipContent = {
            icon: 'exclamation-filled',
            iconClasses: 'fill-current text-yellow-700',
            text:
                nft.downloadMetadata.warning.type === DownloadWarningType.Generic
                    ? nft.downloadMetadata.warning.message
                    : `error.nft.${nft.downloadMetadata.warning.type}.short`,
        }
    }
</script>

<button on:click={openCollectiblesDetailsView} class="flex flex-col items-center justify-center">
    <div class="w-full rounded-2xl overflow-hidden flex flex-col shadow-elevation-1">
        <div
            class="w-full flex relative"
            bind:clientWidth={nftWrapperClientWidth}
            style="height: {nftWrapperClientWidth}px; "
        >
            <NftMedia
                nftId={nft.id}
                classes="bg-gray-200 dark:bg-gray-700 min-w-full min-h-full object-cover"
                loop
                muted
            />
            {#if nft.downloadMetadata.error || nft.downloadMetadata.warning}
                <div class="absolute right-3 top-3">
                    <TooltipIcon
                        height={24}
                        width={24}
                        icon={tooltipContent.icon}
                        iconClasses={tooltipContent.iconClasses}
                        text={localize(tooltipContent.text)}
                        size="small"
                        primaryColor="white"
                        position={Position.Left}
                    />
                </div>
            {/if}
        </div>
        <div class="w-full flex flex-row align-center justify-between p-3.5 bg-white dark:bg-gray-800">
            <Text fontWeight={FontWeight.semibold} fontSize="12" classes="text-left truncate">{nft.name}</Text>
            {#if isLocked}
                <TooltipIcon
                    icon={Icon.Timelock}
                    iconClasses="text-gray-600 dark:text-gray-200"
                    title={localize('general.timelockDate')}
                    text={localize('tooltips.transactionDetails.incoming.timelockDate')}
                    position={Position.Top}
                />
            {/if}
        </div>
    </div>
</button>
