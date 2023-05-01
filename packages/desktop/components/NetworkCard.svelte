<script lang="ts">
    import { localize } from '@core/i18n'
    import { NetworkConfigRoute, networkConfigRouter } from '@desktop/routers'
    import { ClickableTile, Text, Icon, FontWeight, TextType, NetworkIcon, NetworkStatusPill } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { truncateString } from '@core/utils'
    import { NetworkHealth, NetworkId, selectedChainIndex } from '@core/network'

    export let name: string
    export let address: string
    export let status: NetworkHealth
    export let index: number

    function onTileClick(): void {
        $networkConfigRouter.goTo(NetworkConfigRoute.ChainInformation)
    }

    function onQrCodeIconClick(): void {
        $selectedChainIndex = index
        $networkConfigRouter.goTo(NetworkConfigRoute.ChainDepositAddress)
    }
</script>

<ClickableTile classes="bg-transparent border border-solid border-gray-200" onClick={onTileClick}>
    <div class="w-full flex flex-col gap-5">
        <div class="flex flex-row justify-between items-center">
            <div class="flex flex-row gap-2 items-center">
                <NetworkIcon networkId={NetworkId.Testnet} />
                <Text type={TextType.h4} fontWeight={FontWeight.semibold}>
                    {name}
                </Text>
            </div>
            <NetworkStatusPill {status} />
        </div>
        <div class="flex flex-row justify-between items-end">
            <div class="flex flex-col">
                <Text type={TextType.p} fontWeight={FontWeight.medium} color="gray-600">
                    {localize('general.myAddress')}
                </Text>
                <Text type={TextType.pre} fontSize="16" fontWeight={FontWeight.medium}>
                    {truncateString(address, 8, 8)}
                </Text>
            </div>
            <button on:click|stopPropagation={onQrCodeIconClick}>
                <Icon icon={IconEnum.Qr} classes="text-gray-500" />
            </button>
        </div>
    </div>
</ClickableTile>
