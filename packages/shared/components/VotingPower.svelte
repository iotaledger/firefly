<script lang="ts">
    import { Text, Button } from 'shared/components'
    import { ButtonSize, FontWeight, TextType } from './enums'
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { formatTokenAmountBestMatch, visibleSelectedAccountAssets } from '@core/wallet'
    import { openPopup, PopupId } from '@auxiliary/popup'
    import { hasPendingGovernanceTransaction } from '@contexts/governance/stores'

    const asset = $visibleSelectedAccountAssets?.baseCoin

    $: votingPower = parseInt($selectedAccount?.votingPower, 10)
    $: maxVotingPower = parseInt($selectedAccount?.balances?.baseCoin?.available) + votingPower
    $: formattedVotingPower = formatTokenAmountBestMatch(votingPower, asset?.metadata)
    $: formattedMaxVotingPower = formatTokenAmountBestMatch(maxVotingPower, asset?.metadata)
    $: isTransferring = $hasPendingGovernanceTransaction?.[$selectedAccount.index] || $selectedAccount?.isTransferring

    function handleManageVotingPower(): void {
        openPopup({
            id: PopupId.ManageVotingPower,
        })
    }
</script>

<voting-power>
    <Text fontSize="14" fontWeight={FontWeight.semibold} classes="mb-4">
        {localize('views.governance.votingPower.title')}
    </Text>
    <Text type={TextType.h1}>{formattedVotingPower}</Text>
    <Text fontWeight={FontWeight.medium} overrideColor classes="mb-4 text-gray-600 dark:text-white">
        {localize('views.governance.votingPower.maximal', { values: { value: formattedMaxVotingPower } })}
    </Text>
    <Button
        size={ButtonSize.Medium}
        onClick={handleManageVotingPower}
        classes="w-full"
        disabled={isTransferring}
        isBusy={isTransferring}
    >
        {localize('views.governance.votingPower.manage')}
    </Button>
</voting-power>
