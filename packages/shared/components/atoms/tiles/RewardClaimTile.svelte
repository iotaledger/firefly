<script lang="typescript">
    import { IAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { BASE_TOKEN, NetworkProtocol } from '@core/network'
    import { formatTokenAmountBestMatch } from '@core/wallet'
    import { Icon, Text, Tile } from 'shared/components'
    import { FontWeight, TextType } from 'shared/components/Text.svelte'

    export let account: IAccount

    const alias = account?.meta?.alias ?? ''
    const unclaimedBalance = 123456000.789
    const claimedBalance = 1234000.5678
</script>

{#if account}
    <Tile isGhost>
        <div class="w-full flex flex-row justify-between items-center space-x-4">
            <div class="flex flex-row items-center text-left space-x-2">
                <Icon icon="wallet" width={24} height={24} classes="text-blue-500" />
                <Text type={TextType.p}>{alias}</Text>
            </div>
            <div class="flex flex-col text-right">
                <Text type={TextType.p} fontWeight={FontWeight.semibold}>
                    {formatTokenAmountBestMatch(unclaimedBalance, BASE_TOKEN[NetworkProtocol.Shimmer])}
                </Text>
                <div class="flex flex-row items-center space-x-2">
                    <Icon width="16" height="16" icon="success-check" classes="text-white bg-green-500 rounded-full" />
                    <Text type={TextType.p} secondary smaller classes="flex-grow">
                        {localize('general.amountClaimed', {
                            values: {
                                amount: formatTokenAmountBestMatch(claimedBalance, BASE_TOKEN[NetworkProtocol.Shimmer]),
                            },
                        })}
                    </Text>
                </div>
            </div>
        </div>
    </Tile>
{/if}
