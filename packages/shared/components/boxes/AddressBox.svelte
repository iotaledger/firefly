<script lang="ts">
    import { Icon, Text, CopyableBox, FontWeight, TextType, Tooltip, Position } from 'shared/components'
    import { convertBech32ToHex, isValidBech32AddressAndPrefix } from '@core/utils'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let address = ''
    export let isCopyable = false
    export let fontSize = 'base'
    export let showHexAddress = false

    const BECH32_DEFAULT_HRP = 'iota'

    let hexCopyableBoxElement: CopyableBox
    let bech32CopyableBoxElement: CopyableBox
    let hexAddress = ''
    let infoAnchor: HTMLElement
    let tooltipRef: Tooltip
    let showInfoTooltip = false

    export function copyAddress(): void {
        bech32CopyableBoxElement?.onClick()
    }

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

    $: {
        if (showHexAddress && isValidBech32AddressAndPrefix(address, BECH32_DEFAULT_HRP)) {
            try {
                hexAddress = convertBech32ToHex(address, BECH32_DEFAULT_HRP)
            } catch {
                hexAddress = ''
            }
        } else {
            hexAddress = ''
        }
    }
</script>

{#if address && hexAddress.length > 0}
    <div class="flex flex-col gap-1">
        <div class="flex flex-col items-center">
            <div class="flex flex-row gap-1.5 items-center">
                <CopyableBox
                    bind:this={hexCopyableBoxElement}
                    col
                    {isCopyable}
                    value={hexAddress}
                    clearBoxPadding
                    {...$$restProps}
                >
                    {#if hexAddress.length > 20}
                        <Text type={TextType.pre} fontSize="10" fontWeight={FontWeight.light} secondary>
                            {hexAddress.slice(0, hexAddress.length / 2)}
                        </Text>
                        <Text type={TextType.pre} fontSize="10" fontWeight={FontWeight.light} secondary>
                            {hexAddress.slice(hexAddress.length / 2)}
                        </Text>
                    {:else}
                        <Text type={TextType.pre} fontSize="10" fontWeight={FontWeight.light} secondary>
                            {hexAddress}
                        </Text>
                    {/if}
                </CopyableBox>
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
        </div>

        <CopyableBox
            bind:this={bech32CopyableBoxElement}
            col
            {isCopyable}
            value={address}
            clearBoxPadding
            {...$$restProps}
        >
            {#if address.length > 20}
                <Text type={TextType.pre} fontSize="12" fontWeight={FontWeight.medium}>
                    {address.slice(0, address.length / 2)}
                </Text>
                <Text type={TextType.pre} fontSize="12" fontWeight={FontWeight.medium}>
                    {address.slice(address.length / 2)}
                </Text>
            {:else}
                <Text type={TextType.pre} fontSize="12" fontWeight={FontWeight.medium}>
                    {address}
                </Text>
            {/if}
        </CopyableBox>
    </div>
{:else if address}
    <CopyableBox bind:this={bech32CopyableBoxElement} col {isCopyable} value={address} clearBoxPadding {...$$restProps}>
        {#if address.length > 20}
            <Text type={TextType.pre} {fontSize} fontWeight={FontWeight.medium}>
                {address.slice(0, address.length / 2)}
            </Text>
            <Text type={TextType.pre} {fontSize} fontWeight={FontWeight.medium}>
                {address.slice(address.length / 2)}
            </Text>
        {:else}
            <Text type={TextType.pre} {fontSize} fontWeight={FontWeight.medium}>
                {address}
            </Text>
        {/if}
    </CopyableBox>
{/if}
