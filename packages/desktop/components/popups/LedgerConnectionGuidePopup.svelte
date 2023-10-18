<script lang="ts">
    import { LedgerAnimation, Button, Link, Text, TextType } from 'shared/components'
    import { openUrlInBrowser } from '@core/app'
    import { closePopup } from '@auxiliary/popup'
    import { localize } from '@core/i18n'
    import { IllustrationEnum } from '@auxiliary/illustration'
    import { ledgerAppName } from '@core/ledger'

    let stepIndex = 0
    const stepAnimations = [
        IllustrationEnum.LedgerBackgroundLiveDesktop,
        IllustrationEnum.LedgerPinDesktop,
        IllustrationEnum.LedgerOpenAppDesktop,
        IllustrationEnum.LedgerSupport,
    ]

    function changeIndex(increment: number): void {
        stepIndex += increment
    }

    function onCloseClick(): void {
        closePopup()
    }
</script>

<Text type={TextType.h4} classes="mb-6">{localize('popups.ledgerConnectionGuide.title')}</Text>
<div class="w-full flex flex-row flex-wrap relative z-0">
    <LedgerAnimation illustration={stepAnimations[stepIndex]} classes="illustration-wrapper" bgClasses="top-7" />
    <div class="w-full text-center my-9 px-10 z-10">
        {#if typeof localize(`popups.ledgerConnectionGuide.steps.${stepIndex}`) === 'string'}
            <Text secondary classes="inline-block"
                >{localize(`popups.ledgerConnectionGuide.steps.${stepIndex}`, {
                    values: {
                        network: $ledgerAppName,
                    },
                })}
            </Text>
        {:else}
            <Text secondary classes="inline-block"
                >{localize(`popups.ledgerConnectionGuide.steps.${stepIndex}.text`)}</Text
            >
            <Link
                on:click={() =>
                    openUrlInBrowser(
                        'https://support.ledger.com/hc/en-us/articles/360019868977-Fix-USB-connection-issues-with-Ledger-Live?support=true'
                    )}
            >
                {localize(`popups.ledgerConnectionGuide.steps.${stepIndex}.link`)}
            </Link>
        {/if}
    </div>
    <div class="w-full flex flex-row flex-nowrap space-x-4 z-10">
        <Button classes="w-1/2" outline onClick={() => changeIndex(-1)} disabled={stepIndex === 0}>
            {localize('actions.previous')}
        </Button>
        {#if stepIndex < Object.keys(localize('popups.ledgerConnectionGuide.steps')).length - 1}
            <Button classes="w-1/2" outline onClick={() => changeIndex(1)}>{localize('actions.next')}</Button>
        {:else}
            <Button classes="w-1/2" onClick={onCloseClick}>{localize('actions.close')}</Button>
        {/if}
    </div>
</div>
