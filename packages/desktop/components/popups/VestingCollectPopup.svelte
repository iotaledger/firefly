<script lang="ts">
    import { Button, Text, FontWeight, TextType, KeyValueBox } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import { handleError } from '@core/error/handlers'
    import { onMount } from 'svelte'
    import { selectedAccountVestingOverview } from '@contexts/vesting'

    export let onConfirm: () => Promise<void> | undefined = undefined
    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    const unclaimedFunds = $selectedAccountVestingOverview.remainingPayout + ' IOTA' ?? '0 IOTA'
    let isBusy = false
    async function onConfirmClick(): Promise<void> {
        isBusy = true
        if (onConfirm) {
            await onConfirm()
        } else {
            closePopup()
        }
        isBusy = false
    }
    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
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
    <Button classes="w-full" onClick={onConfirmClick}>
        {localize('popups.vestingCollect.button')}
    </Button>
</div>
