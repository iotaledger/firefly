<script lang="ts">
    import { onMount } from 'svelte'

    import { ClickableTile, FontWeight, Icon, NetworkIcon, NetworkStatusPill, Text, TextType } from '@ui'

    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { truncateString, UiEventFunction } from '@core/utils'
    import {
        chainStatuses,
        IChain,
        IIscpChainConfiguration,
        INetwork,
        NetworkHealth,
        NetworkId,
        networkStatus,
    } from '@core/network'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { isActiveLedgerProfile } from '@core/profile'

    export let network: INetwork = undefined
    export let chain: IChain = undefined
    export let onCardClick: UiEventFunction
    export let onGenerateAddressClick: UiEventFunction
    export let onQrCodeIconClick: UiEventFunction

    const ADDRESS_PLACEHOLDER = '---'

    let name = ''
    let address = ''
    let status: NetworkHealth

    $: $networkStatus, $chainStatuses, $selectedAccount, setNetworkCardData()

    function setNetworkCardData(): void {
        if (network) {
            name = network.getMetadata().name
            address = $selectedAccount.depositAddress
            status = $networkStatus.health
        } else if (chain) {
            const configuration = chain.getConfiguration() as IIscpChainConfiguration
            name = configuration.name
            address = $selectedAccount.evmAddresses[configuration.coinType]
            status = chain.getStatus().health
        }
    }

    onMount(() => {
        setNetworkCardData()
    })
</script>

<ClickableTile classes="bg-white border border-solid border-gray-200 dark:border-transparent" onClick={onCardClick}>
    <div class="w-full flex flex-col gap-5">
        <div class="flex flex-row justify-between items-center">
            <div class="flex flex-row gap-2 items-center">
                <NetworkIcon networkId={NetworkId.Testnet} />
                <Text type={TextType.h4} fontWeight={FontWeight.semibold}>
                    {name}
                </Text>
            </div>
            {#key status}
                <NetworkStatusPill {status} />
            {/key}
        </div>
        <div class="flex flex-row justify-between items-end">
            <div class="flex flex-col">
                <Text type={TextType.p} fontWeight={FontWeight.medium} color="gray-600">
                    {localize('general.myAddress')}
                </Text>
                {#if address}
                    <Text type={TextType.pre} fontSize="16" fontWeight={FontWeight.medium}>
                        {truncateString(address, 8, 8)}
                    </Text>
                {:else if $isActiveLedgerProfile}
                    <button on:click|stopPropagation={onGenerateAddressClick}>
                        <Text type={TextType.p} fontWeight={FontWeight.medium} highlighted>
                            {localize('actions.generateAddress')}
                        </Text>
                    </button>
                {:else}
                    <Text type={TextType.pre} fontSize="16" fontWeight={FontWeight.medium}>
                        {ADDRESS_PLACEHOLDER}
                    </Text>
                {/if}
            </div>
            <button on:click|stopPropagation={onQrCodeIconClick}>
                <Icon icon={IconEnum.Qr} classes="text-gray-500" />
            </button>
        </div>
    </div>
</ClickableTile>
