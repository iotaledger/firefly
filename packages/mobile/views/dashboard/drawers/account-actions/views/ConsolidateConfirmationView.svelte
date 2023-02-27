<script lang="typescript">
    import { localize } from '@core/i18n'
    import { activeProfile, isSoftwareProfile } from '@core/profile'
    import { consolidateOutputs } from '@core/wallet/actions/consolidateOutputs'
    import { Button } from '@ui'
    import { ButtonVariant, Text, TextType } from '@ui'
    import { accountActionsRouter } from '@/routers'

    export let onSuccess: () => unknown

    let isBusy = false

    const { isStrongholdLocked } = $activeProfile

    function onConfirm(): void {
        if ($isSoftwareProfile && $isStrongholdLocked) {
            $accountActionsRouter.setNeedsUnlock(true, handleConsolidate)
        } else {
            handleConsolidate()
        }
    }

    function handleConsolidate(): void {
        isBusy = true
        consolidateOutputs()
            .then(() => {
                onSuccess && onSuccess()
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                isBusy = false
            })
    }
</script>

<div class="flex-1 flex flex-col justify-between space-y-4">
    <Text type={TextType.p}>{localize('popups.minimizeStorageDeposit.description')}</Text>
    <div class="flex flex-col w-full space-y-4">
        <Button {isBusy} disabled={isBusy} classes="w-full" variant={ButtonVariant.Warning} onClick={onConfirm}>
            {localize('popups.minimizeStorageDeposit.confirmButton')}
        </Button>
    </div>
</div>
