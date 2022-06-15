<script lang="typescript">
    import { Icon, TTile } from 'shared/components'
    import { IAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { BASE_TOKEN, NetworkProtocol } from '@core/network'
    import { formatTokenAmountBestMatch } from '@core/wallet'

    export let account: IAccount

    const alias = account?.meta?.alias ?? ''
    const unclaimedBalance = 123456000.789
    const claimedBalance = 1234000.5678
</script>

{#if account}
    <TTile
        applyBorder
        icon="wallet"
        iconLabel={alias}
        tileText={formatTokenAmountBestMatch(unclaimedBalance, BASE_TOKEN[NetworkProtocol.Shimmer])}
        tileSubText={localize('general.amountClaimed', {
            values: {
                amount: formatTokenAmountBestMatch(claimedBalance, BASE_TOKEN[NetworkProtocol.Shimmer]),
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
    </TTile>
{/if}
