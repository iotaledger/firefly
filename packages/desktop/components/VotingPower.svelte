<script lang="ts">
    import { Button, Text } from '@ui'
    import { ButtonSize, FontWeight, TextType } from '@ui/enums'

    import { selectedWallet } from '@core/wallet'
    import { localize } from '@core/i18n'
    import { formatTokenAmountBestMatch, visibleSelectedWalletAssets } from '@core/wallet'
    import { openPopup, PopupId } from '@auxiliary/popup'
    import { activeProfile } from '@core/profile'

    const asset = $visibleSelectedWalletAssets?.[$activeProfile?.network.id]?.baseCoin

    $: votingPower = parseInt($selectedWallet?.votingPower, 10)
    $: maxVotingPower = parseInt($selectedWallet?.balances?.baseCoin?.available) + votingPower
    $: formattedVotingPower = formatTokenAmountBestMatch(votingPower, asset?.metadata)
    $: formattedMaxVotingPower = formatTokenAmountBestMatch(maxVotingPower, asset?.metadata)
    $: hasTransactionInProgress =
        $selectedWallet?.hasVotingPowerTransactionInProgress ||
        $selectedWallet?.hasVotingTransactionInProgress ||
        $selectedWallet?.hasConsolidatingOutputsTransactionInProgress ||
        $selectedWallet?.isTransferring

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
