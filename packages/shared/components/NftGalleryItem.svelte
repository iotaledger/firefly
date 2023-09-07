<script lang="typescript">
    import { Text, FontWeight, NftMedia, TooltipIcon, Position, TooltipType } from 'shared/components'

    import { time } from '@core/app'
    import { localize } from '@core/i18n'
    import { INft } from '@core/nfts'
    import { selectedNftId } from '@core/nfts/stores'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'

    import { Icon } from '@auxiliary/icon'

    export let nft: INft

    let tooltipIconProps: { icon?: Icon; iconClasses?: string; text?: string } = {}

    $: isLocked = nft.timelockTime > $time.getTime()

    $: if (nft.downloadMetadata.error) {
        tooltipIconProps = {
            icon: Icon.ErrorFilled,
            iconClasses: 'fill-current text-red-700',
            text: getTooltipText(TooltipType.Error),
        }
    } else if (nft.downloadMetadata.warning) {
        tooltipIconProps = {
            icon: Icon.ExclamationFilled,
            iconClasses: 'fill-current text-yellow-700',
            text: getTooltipText(TooltipType.Warning),
        }
    }

    function onClick(): void {
        $selectedNftId = nft.id
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
    }

    function getTooltipText(key: TooltipType): string | undefined {
        const { type, message } = nft?.downloadMetadata?.[key] ?? {}
        return type === 'generic' ? message : localize(`error.nft.${type}.short`)
    }
</script>

<button type="button" on:click={onClick} class="w-full flex flex-col items-center justify-center">
    <div class="h-full w-full rounded-2xl overflow-hidden flex flex-col shadow-elevation-1">
        <nft-media-wrapper>
            <figure class="w-full bg-gray-200 dark:bg-gray-700 h-full object-cover">
                <NftMedia {nft} loop muted />
            </figure>
            {#if nft.downloadMetadata.error || nft.downloadMetadata.warning}
                <div class="absolute right-3 top-3">
                    <TooltipIcon
                        height={24}
                        width={24}
                        size="small"
                        primaryColor="white"
                        position={Position.Left}
                        {...tooltipIconProps}
                    />
                </div>
            {/if}
        </nft-media-wrapper>
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

<style lang="scss">
    button {
        @apply max-w-lg;
    }

    figure {
        aspect-ratio: 1/1;
        @apply max-h-[32rem];
    }

    nft-media-wrapper {
        @apply w-full;
        @apply flex;
        @apply relative;
    }
</style>
