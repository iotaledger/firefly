<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { StardustAccount } from '@lib/typings/account'

    export let wallet: StardustAccount

    const alias = wallet?.meta?.alias ?? ''
    const unclaimedBalance = wallet?.meta?.index === 0 || wallet?.meta?.index === 2 ? '12,345.678 SMR' : ''
    const claimedBalance =
        wallet?.meta?.index === 1 || wallet?.meta?.index === 2 || wallet?.meta?.index === 3 ? '1,234.567 SMR' : ''
</script>

{#if wallet}
    <div
        class="w-full h-full p-4 flex flex-row justify-between items-center rounded-xl border border-solid border-gray-300 dark:border-gray-700"
    >
        <div class="flex flex-row items-center">
            <Icon width="24" height="24" icon="wallet" classes="mr-4 text-blue-500" />
            <Text type="p">{alias}</Text>
        </div>
        <div class="flex flex-col justify-between">
            {#if unclaimedBalance}
                <div class="flex flex-row justify-end items-center">
                    <Text type="p" fontWeight={FontWeightText.bold}>{unclaimedBalance.split(' ')[0] ?? ''}</Text>
                    <Text type="p" fontWeight={FontWeightText.bold}>&nbsp;{unclaimedBalance.split(' ')[1] ?? ''}</Text>
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
                    <Text type="p" secondary fontWeight={FontWeightText.bold}>{claimedBalance.split(' ')[0] ?? ''}</Text
                    >
                    <Text type="p" secondary fontWeight={FontWeightText.bold}
                        >&nbsp;{claimedBalance.split(' ')[1] ?? ''}</Text
                    >
                    <Text type="p" secondary fontWeight={FontWeightText.bold}>&nbsp;claimed</Text>
                </div>
            {/if}
        </div>
    </div>
{/if}
