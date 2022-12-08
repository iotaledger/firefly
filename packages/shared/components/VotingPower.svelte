<script lang="typescript">
    import { Text, Button } from 'shared/components'
    import { ButtonSize, FontWeight, TextType } from './enums'
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { formatTokenAmountBestMatch, visibleSelectedAccountAssets } from '@core/wallet'
    import { openPopup } from '@auxiliary/popup'

    const asset = $visibleSelectedAccountAssets?.baseCoin

    $: votingPower = parseInt($selectedAccount?.votingPower, 10)
    $: maxVotingPower = parseInt($selectedAccount?.balances?.baseCoin?.available)
    $: formattedVotingPower = formatTokenAmountBestMatch(votingPower, asset?.metadata)
    $: formattedMaxVotingPower = formatTokenAmountBestMatch(maxVotingPower, asset?.metadata)

    function handleManageVotingPower(): void {
        openPopup({
            type: 'manageVotingPower',
        })
    }
</script>

<voting-power>
    <Text fontSize="14" fontWeight={FontWeight.semibold} classes="mb-4">
        {localize('views.governance.votingPower.title')}
    </Text>
    <Text type={TextType.h1}>{formattedVotingPower}</Text>
    <Text fontWeight={FontWeight.medium} overrideColor classes="mb-4 text-gray-600">
        {localize('views.governance.votingPower.maximal', { values: { value: formattedMaxVotingPower } })}
    </Text>
    <Button
        size={ButtonSize.Medium}
        onClick={handleManageVotingPower}
        classes="w-full"
        disabled={$selectedAccount.isTransferring}
        isBusy={$selectedAccount.isTransferring}
    >
        {localize('views.governance.votingPower.manage')}
    </Button>
</voting-power>
