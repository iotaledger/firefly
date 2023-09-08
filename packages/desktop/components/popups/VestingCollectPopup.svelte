<script lang="ts">
    import { Button, Text, FontWeight, TextType, KeyValueBox } from 'shared/components'
    import { localize } from '@core/i18n'
    import { PopupId, closePopup, openPopup } from '@auxiliary/popup'
    import { selectedAccountVestingUnclaimedFunds } from '@contexts/vesting'
    import { formatTokenAmountBestMatch, selectedAccountAssets } from '@core/wallet'
    import { activeProfile, isSoftwareProfile } from '@core/profile'
    import { consolidateOutputs } from '@core/wallet/actions/consolidateOutputs'
    import { handleError } from '@core/error/handlers'

    const { isStrongholdLocked, network } = $activeProfile
    const DEFAULT_EMPTY_VALUE_STRING = '----'

    let isBusy = false

    $: ({ baseCoin } = $selectedAccountAssets[network?.id])

    $: unclaimedFunds = baseCoin
        ? formatTokenAmountBestMatch(Math.round($selectedAccountVestingUnclaimedFunds), baseCoin.metadata)
        : DEFAULT_EMPTY_VALUE_STRING

    async function onConfirmClick(): Promise<void> {
        if ($isSoftwareProfile && $isStrongholdLocked) {
            openPopup({
                id: PopupId.UnlockStronghold,
                props: {
                    onSuccess: async function () {
                        await consolidateOutputs()
                        closePopup()
                    },
                    onCancelled: function () {
                        openPopup({
                            id: PopupId.VestingCollect,
                        })
                    },
                },
            })
        } else {
            isBusy = true
            try {
                await consolidateOutputs()
                closePopup()
            } catch (err) {
                handleError(err)
            } finally {
                isBusy = false
            }
        }
    }
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.vestingCollect.title')}
    </Text>
    <div class="space-y-4">
        <Text color="gray-600" darkColor="gray-400" fontSize="15">
            {localize('popups.vestingCollect.body')}
        </Text>
        <KeyValueBox keyText={localize('popups.vestingCollect.unclaimedFunds')} valueText={unclaimedFunds} />
    </div>
    <Button classes="w-full" onClick={onConfirmClick} disabled={isBusy} {isBusy}>
        {localize('popups.vestingCollect.button')}
    </Button>
</div>
