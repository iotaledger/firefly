<script lang="ts">
    import { onMount } from 'svelte'
    import { localize } from '@core/i18n'
    import { NetworkConfigRoute, networkConfigRouter } from '@desktop/routers'
    import { ClickableTile, FontWeight, Icon, NetworkIcon, NetworkStatusPill, Text, TextType } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { truncateString } from '@core/utils'
    import {
        IChain,
        IIscpChainConfiguration,
        INetwork,
        NetworkHealth,
        NetworkId,
        networkStatus,
        setSelectedChain,
    } from '@core/network'
    import { selectedAccount } from '@core/account'

    export let network: INetwork
    export let chain: IChain

    function onTileClick(): void {
        if (network) {
            // TODO: Go to network settings
        } else if (chain) {
            setSelectedChain(chain)
            $networkConfigRouter.goTo(NetworkConfigRoute.ChainInformation)
        }
    }

    function onQrCodeIconClick(): void {
        if (chain) {
            setSelectedChain(chain)
        }
        $networkConfigRouter.goTo(NetworkConfigRoute.ChainDepositAddress)
    }

    let name = ''
    let address = ''
    let status: NetworkHealth

    function setNetworkCardData(): void {
        if (network) {
            name = network.getMetadata().name
            address = $selectedAccount.depositAddress
            status = $networkStatus.health
        } else if (chain) {
            const configuration = chain.getConfiguration() as IIscpChainConfiguration
            name = configuration.name
            address = configuration.aliasAddress
            status = NetworkHealth.Operational
        }
    }

    onMount(() => {
        setNetworkCardData()
    })
</script>

<ClickableTile classes="bg-white border border-solid border-gray-200" onClick={onTileClick}>
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
