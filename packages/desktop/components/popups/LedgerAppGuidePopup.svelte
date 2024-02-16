<script lang="ts">
    import { LedgerAnimation, Button, Text, TextType } from '@ui'
    import { closePopup } from '@auxiliary/popup'
    import { LedgerAppName, ledgerAppName } from '@core/ledger'
    import { localize } from '@core/i18n'
    import { IllustrationEnum } from '@auxiliary/illustration'
    import { Icon } from '@auxiliary/icon'

    let stepIndex = 0
    const stepIlustrations = [
        IllustrationEnum.LedgerLiveUpdatedDesktop,
        IllustrationEnum.LedgerConnected2Desktop,
        $ledgerAppName === LedgerAppName.Shimmer
            ? IllustrationEnum.LedgerSearchShimmerAppsDesktop
            : IllustrationEnum.LedgerSearchIotaAppsDesktop,
        IllustrationEnum.LedgerInstallAppsDesktop,
        IllustrationEnum.LedgerCloseLiveDesktop,
    ]

    const stepIconWithIlustrations = [
        undefined,
        undefined,
        undefined,
        $ledgerAppName === LedgerAppName.Shimmer ? Icon.Shimmer : Icon.Iota,
        undefined,
    ]

    function changeIndex(increment: number): void {
        stepIndex += increment
    }

    function onCloseClick(): void {
        closePopup()
    }
</script>

<Text type={TextType.h4} classes="mb-6">
    {localize('popups.ledgerAppGuide.title', { values: { legacy: $ledgerAppName } })}
</Text>
<div class="w-full flex flex-row flex-wrap">
    <LedgerAnimation
        illustration={stepIlustrations[stepIndex]}
        iconNetwork={stepIconWithIlustrations[stepIndex]}
        classes="illustration-wrapper"
        bgClasses="top-6"
    />
    <div class="w-full text-center my-9 px-10">
        <Text secondary>
            {localize(`popups.ledgerAppGuide.steps.${stepIndex}`, { values: { legacy: $ledgerAppName } })}
        </Text>
    </div>
    <div class="w-full flex flex-row flex-nowrap space-x-4">
        <Button classes="w-1/2" outline onClick={() => changeIndex(-1)} disabled={stepIndex === 0}>
            {localize('actions.previous')}
        </Button>
        {#if stepIndex < Object.keys(localize('popups.ledgerAppGuide.steps')).length - 1}
            <Button classes="w-1/2" outline onClick={() => changeIndex(1)}>{localize('actions.next')}</Button>
        {:else}
            <Button classes="w-1/2" onClick={onCloseClick}>{localize('actions.close')}</Button>
        {/if}
    </div>
</div>
