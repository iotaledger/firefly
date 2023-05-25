<script lang="ts">
    import { LedgerAnimation, Button, Icon, Link, Text } from '@ui'
    import { OnboardingLayout } from '@components'
    import { localize } from '@core/i18n'
    import { openOverlay, PopupId } from '@auxiliary/popup'
    import { LedgerAppName } from '@core/ledger'
    import { ledgerSetupRouter } from '@core/router/subrouters'

    function onContinueClick(): void {
        $ledgerSetupRouter.next()
    }

    function onBackClick(): void {
        $ledgerSetupRouter.previous()
    }

    function onPopupOpenClick(): void {
        openOverlay({
            id: PopupId.LedgerAppGuide,
        })
    }
</script>

<OnboardingLayout {onBackClick}>
    <div slot="leftpane__content">
        <Text type="h2" classes="mb-5"
            >{localize('views.ledgerInstallationGuide.title', { values: { protocol: LedgerAppName.Shimmer } })}</Text
        >
        <Text type="p" secondary classes="mb-5">
            {localize('views.ledgerInstallationGuide.body1', { values: { protocol: LedgerAppName.Shimmer } })}
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
            >{localize('views.ledgerInstallationGuide.action', { values: { protocol: LedgerAppName.Shimmer } })}</Button
        >
    </div>
    <LedgerAnimation slot="rightpane" illustration="ledger-install-new-app-desktop" />
</OnboardingLayout>
