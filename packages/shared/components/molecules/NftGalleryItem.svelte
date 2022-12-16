<script lang="typescript">
    import { INft } from '@core/nfts'
    import { Text, FontWeight, NftMedia, TooltipIcon, Position } from 'shared/components'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { selectedNftId } from '@core/nfts/stores'

    export let nft: INft

    let nftWrapperClientWidth: number
    let error: string
    let warning: string

    function openCollectiblesDetailsView(): void {
        $selectedNftId = nft.id
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
    }

    let tooltipContent
    $: if (error) {
        tooltipContent = {
            icon: 'error-filled',
            iconClasses: 'fill-current text-red-700',
            text: error,
        }
    } else if (warning) {
        tooltipContent = {
            icon: 'exclamation-filled',
            iconClasses: 'fill-current text-yellow-800',
            text: warning,
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
                bind:error
                bind:warning
                classes="bg-gray-200 dark:bg-gray-700 min-w-full min-h-full object-cover"
                loop
                muted
            />
            {#if error || warning}
                <div class="toast-container">
                    <TooltipIcon
                        height={24}
                        width={24}
                        icon={tooltipContent.icon}
                        iconClasses={tooltipContent.iconClasses}
                        text={tooltipContent.text}
                        size="small"
                        primaryColor="white"
                        position={Position.Left}
                    />
                </div>
            {/if}
        </div>
        <div class="w-full flex flex-col justify-center p-3.5 bg-white dark:bg-gray-800">
            <Text fontWeight={FontWeight.semibold} fontSize="12" classes="text-left truncate">{nft.name}</Text>
        </div>
    </div>
</button>

<style lang="scss">
    .toast-container {
        position: absolute;
        right: 12px;
        top: 12px;
    }
</style>
