<script lang="ts">
    import { PopupId, openPopup } from '@auxiliary/popup'
    import { OnboardingLayout } from '@components'
    import { localize } from '@core/i18n'
    import { LedgerAppName, ledgerAppName, pollLedgerNanoStatus, stopPollingLedgerNanoStatus } from '@core/ledger'
    import { Button, Icon, LedgerAnimation, Link, Text, TextType } from '@ui'
    import { onMount } from 'svelte'
    import { createFromLedgerRouter } from '../create-from-ledger-router'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { IllustrationEnum } from '@auxiliary/illustration'

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
        <Text type={TextType.h2} classes="mb-5"
            >{localize('views.ledgerInstallationGuide.title', { values: { network: $ledgerAppName } })}</Text
        >
        <Text type={TextType.p} secondary classes="mb-5">
            {localize('views.ledgerInstallationGuide.body1', { values: { network: $ledgerAppName } })}
        </Text>
        <Text type={TextType.p} secondary classes="mb-5">{localize('views.ledgerInstallationGuide.body2')}</Text>
        <div class="flex flex-row flex-nowrap items-center justify-center space-x-4 text-center mt-28">
            <div class="flex flex-col flex-wrap space-y-2">
                <div class="bg-blue-400 rounded-2xl w-20 h-20 flex justify-center items-center">
                    <Icon
                        icon={$ledgerAppName === LedgerAppName.Iota ? IconEnum.Iota : IconEnum.Shimmer}
                        width="32"
                        height="32"
                        classes="text-white"
                    />
                </div>
                <Text type={TextType.p} secondary>{$ledgerAppName}</Text>
            </div>
        </div>
    </div>
    <div slot="leftpane__action">
        <span class="flex justify-center mb-10">
            <Link icon={IconEnum.Info} on:click={onPopupOpenClick}
                >{localize('popups.ledgerAppGuide.title', { values: { legacy: $ledgerAppName } })}</Link
            >
        </span>
        <Button classes="w-full" onClick={onContinueClick}
            >{localize('views.ledgerInstallationGuide.action', { values: { network: $ledgerAppName } })}</Button
        >
    </div>
    <LedgerAnimation slot="rightpane" illustration={IllustrationEnum.LedgerInstallNewAppDesktop} />
</OnboardingLayout>
