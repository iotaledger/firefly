<script lang="ts">
    import { Button, Text } from '@ui'
    import { ButtonSize, FontWeight, TextType } from '@ui/enums'

    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { formatTokenAmountBestMatch, visibleSelectedAccountAssets } from '@core/wallet'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'

    const asset = $visibleSelectedAccountAssets?.baseCoin

    $: votingPower = parseInt($selectedAccount?.votingPower, 10)
    $: maxVotingPower = parseInt($selectedAccount?.balances?.baseCoin?.available) + votingPower
    $: formattedVotingPower = formatTokenAmountBestMatch(votingPower, asset?.metadata)
    $: formattedMaxVotingPower = formatTokenAmountBestMatch(maxVotingPower, asset?.metadata)
    $: hasTransactionInProgress =
        $selectedAccount?.hasVotingPowerTransactionInProgress ||
        $selectedAccount?.hasVotingTransactionInProgress ||
        $selectedAccount?.isTransferring

    function onManageVotingPowerClick(): void {
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
        onClick={onManageVotingPowerClick}
        classes="w-full"
        disabled={hasTransactionInProgress}
        isBusy={hasTransactionInProgress}
    >
        {localize('views.governance.votingPower.manage')}
    </Button>
</voting-power>
