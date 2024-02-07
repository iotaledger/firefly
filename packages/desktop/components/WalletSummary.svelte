<script lang="ts">
    import { WalletActionsButton } from '@components'
    import { Text, TogglableAssetBalanceLabel } from '@ui'
    import { TextType } from '@ui/enums'

    import { localize } from '@core/i18n'
    import { nodeInfoNetworkName } from '@core/network'
    import { selectedWalletAssets } from '@core/wallet'
    import { activeProfile } from '@core/profile'

    $: fomattedNetworkName = $nodeInfoNetworkName
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join(' ')

    $: ({ baseCoin, mana } = $selectedWalletAssets[$activeProfile?.network.id])
</script>

<wallet-summary class="block relative space-y-4">
    <div class="flex flex-row items-center justify-between">
        <Text type={TextType.h5} classes="text-left">
            {localize('general.balanceWithNetwork', { values: { network: fomattedNetworkName } })}
        </Text>
        <WalletActionsButton />
    </div>
    <div class="flex flex-col flex-wrap items-start space-y-1">
        <TogglableAssetBalanceLabel asset={baseCoin} {mana} />
    </div>
</wallet-summary>
