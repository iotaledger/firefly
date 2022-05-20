<script lang="typescript">
    import { Icon, Tile } from 'shared/components'
    import { IAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { BASE_TOKEN, NetworkProtocol } from '@core/network'
    import { formatBestMatchTokenAmount } from '@core/wallet'

    export let account: IAccount

    const alias = account?.meta?.alias ?? ''
    const unclaimedBalance = 123456000.789
    const claimedBalance = 1234000.5678
</script>

{#if account}
    <Tile
        applyBorder
        icon="wallet"
        iconLabel={alias}
        tileText={formatBestMatchTokenAmount(unclaimedBalance, BASE_TOKEN[NetworkProtocol.Shimmer])}
        tileSubText={localize('general.amountClaimed', {
            values: {
                amount: formatBestMatchTokenAmount(claimedBalance, BASE_TOKEN[NetworkProtocol.Shimmer]),
            },
        })}
    >
        <Icon
            width="16"
            height="16"
            icon="success-check"
            classes="mr-2 text-white bg-green-500 rounded-full"
            slot="subText"
        />
    </Tile>
{/if}
