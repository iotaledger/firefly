<script lang="ts">
    import { Icon, Text, CopyableBox, FontWeight, TextType, Tooltip, Position, Box } from 'shared/components'
    import { convertBech32ToHex, BECH32_DEFAULT_HRP } from '@core/utils'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let isCopyable = false
    export let address: string = ''
    export let hexAddress = ''

    let hexCopyableBoxElement: CopyableBox
    let infoAnchor: HTMLElement
    let tooltipRef: Tooltip
    let showInfoTooltip = false

    export function copyHexAddress(): void {
        hexCopyableBoxElement?.onClick()
    }

    function showTooltip(): Promise<void> {
        showInfoTooltip = true
        tooltipRef?.refreshPosition()
    }
    function hideTooltip(): void {
        showInfoTooltip = false
    }

    $: hexAddress = convertBech32ToHex(address, BECH32_DEFAULT_HRP)
</script>

{#if hexAddress.length > 0}
    <Box
        clearBackground
        classes="border border-solid border-gray-300 hover:bg-blue-50 hover:border-gray-500 focus:bg-blue-100 focus:border-blue-400 active:bg-blue-100 active:border-blue-400 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:bg-opacity-20 dark:hover:border-opacity-50 dark:focus:bg-gray-700 dark:focus:bg-opacity-20 dark:focus:border-opacity-50 dark:active:bg-gray-700 dark:active:bg-opacity-20 dark:active:border-opacity-50"
    >
        <CopyableBox
            bind:this={hexCopyableBoxElement}
            col
            {isCopyable}
            value={hexAddress}
            clearBoxPadding
            clearBackground
            {...$$restProps}
        >
            <div class="flex flex-row gap-1.5 items-center">
                {#if hexAddress.length > 20}
                    <div class="flex flex-col w-full">
                        <Text type={TextType.pre} fontSize="12" fontWeight={FontWeight.light} secondary>
                            {hexAddress.slice(0, hexAddress.length / 2)}
                        </Text>
                        <Text type={TextType.pre} fontSize="12" fontWeight={FontWeight.light} secondary>
                            {hexAddress.slice(hexAddress.length / 2)}
                        </Text>
                    </div>
                {:else}
                    <Text type={TextType.pre} fontSize="12" fontWeight={FontWeight.light} secondary>
                        {hexAddress}
                    </Text>
                {/if}
                {#if hexAddress.length > 0}
                    <span bind:this={infoAnchor} on:mouseenter={showTooltip} on:mouseleave={hideTooltip}>
                        <Icon icon={IconEnum.Info} classes="text-gray-500 w-4 h-4" />
                    </span>
                {/if}

                {#if showInfoTooltip}
                    <Tooltip
                        bind:this={tooltipRef}
                        anchor={infoAnchor}
                        position={Position.Right}
                        offset={6}
                        size="small"
                    >
                        <Text color="gray-600" darkColor="gray-400" classes="text-left" smaller>
                            Equivalent hex address in the new IOTA Wallet extension
                        </Text>
                    </Tooltip>
                {/if}
            </div>
        </CopyableBox>
    </Box>
{/if}
