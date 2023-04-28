<script lang="ts">
    import { PopupId, openPopup } from '@auxiliary/popup'
    import { OnboardingLayout } from '@components'
    import { localize } from '@core/i18n'
    import { LedgerAppName, pollLedgerNanoStatus, stopPollingLedgerNanoStatus } from '@core/ledger'
    import { Button, Icon, LedgerAnimation, Link, Text } from '@ui'
    import { onMount } from 'svelte'
    import { createFromLedgerRouter } from '../create-from-ledger-router'

    function onContinueClick(): void {
        $createFromLedgerRouter.next()
    }

    async function onBackClick(): Promise<void> {
        await stopPollingLedgerNanoStatus()
        $createFromLedgerRouter.previous()
    }

    function onPopupOpenClick(): void {
        openPopup({
            id: PopupId.LedgerAppGuide,
        })
    }

    onMount(() => {
        pollLedgerNanoStatus()
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="leftpane__content">
        <Text type="h2" classes="mb-5"
            >{localize('views.ledgerInstallationGuide.title', { values: { network: LedgerAppName.Shimmer } })}</Text
        >
        <Text type="p" secondary classes="mb-5">
            {localize('views.ledgerInstallationGuide.body1', { values: { network: LedgerAppName.Shimmer } })}
        </Text>
        <Text type="p" secondary classes="mb-5">{localize('views.ledgerInstallationGuide.body2')}</Text>
        <div class="flex flex-row flex-nowrap items-center justify-center space-x-4 text-center mt-28">
            <div class="flex flex-col flex-wrap space-y-2">
                <div class="bg-blue-400 rounded-2xl w-20 h-20 flex justify-center items-center">
                    <Icon icon="shimmer" width="32" height="32" classes="text-white" />
                </div>
                <Text type="p" secondary>{LedgerAppName.Shimmer}</Text>
            </div>
        </div>
    </div>
    <div slot="leftpane__action">
        <Link icon="info" onClick={onPopupOpenClick} classes="mb-10 justify-center"
            >{localize('popups.ledgerAppGuide.title', { values: { legacy: LedgerAppName.Shimmer } })}</Link
        >
        <Button classes="w-full" onClick={onContinueClick}
            >{localize('views.ledgerInstallationGuide.action', { values: { network: LedgerAppName.Shimmer } })}</Button
        >
    </div>
    <LedgerAnimation slot="rightpane" illustration="ledger-install-new-app-desktop" />
</OnboardingLayout>
