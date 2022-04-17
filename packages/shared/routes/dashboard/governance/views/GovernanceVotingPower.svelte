<script lang="typescript">
    import { Text, Icon } from 'shared/components'
    import { localize } from '@core/i18n'
    import { openPopup } from 'shared/lib/popup'
    import { WalletAccount } from 'shared/lib/typings/wallet'

    export let account: WalletAccount
</script>

<div class="flex items-center mb-3 cursor-pointer" on:click={() => openPopup({ type: 'governanceVotingPowerInfo' })}>
    <Text type="p" smaller overrideColor classes="mr-1 text-gray-700 dark:text-gray-500">
        {localize('views.governance.votingPower.title')}
    </Text>
    <Icon width="12" height="12" icon="info-filled" classes="text-gray-700 dark:text-gray-500" />
</div>
<Text type="h1">{account?.balance}</Text>
