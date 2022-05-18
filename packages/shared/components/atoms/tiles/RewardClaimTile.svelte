<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { FontWeightText } from 'shared/components/Text.svelte'
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
    <div
        class="w-full h-18 p-4 flex flex-row justify-between items-center rounded-xl border border-solid border-gray-300 dark:border-gray-700"
    >
        <div class="flex flex-row items-center">
            <Icon width="24" height="24" icon="wallet" classes="mr-4 text-blue-500" />
            <Text type="p">{alias}</Text>
        </div>
        <div class="flex flex-col justify-between">
            {#if unclaimedBalance}
                <div class="flex flex-row justify-end items-center">
                    <Text type="p" fontWeight={FontWeightText.bold}
                        >{formatBestMatchTokenAmount(unclaimedBalance, BASE_TOKEN[NetworkProtocol.Shimmer])}</Text
                    >
                </div>
            {/if}
            {#if claimedBalance}
                <div class="flex flex-row justify-end items-center">
                    <Icon
                        width="18"
                        height="18"
                        icon="success-check"
                        classes="mr-2 text-white bg-green-500 rounded-full"
                    />
                    <Text type="p" secondary fontWeight={FontWeightText.bold}
                        >{localize('general.amountClaimed', {
                            values: {
                                amount: formatBestMatchTokenAmount(claimedBalance, BASE_TOKEN[NetworkProtocol.Shimmer]),
                            },
                        })}</Text
                    >
                </div>
            {/if}
        </div>
    </div>
{/if}
