<script lang="typescript">
    import { KeyValueBox, AmountBox, SubjectBox, ActivityInclusionStatusPill } from 'shared/components'
    import { formatDate, localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import { formatTokenAmountPrecise, Subject, ActivityDirection, InclusionState, IPersistedAsset } from '@core/wallet'
    import { BASE_TOKEN } from '@core/network'

    export let asset: IPersistedAsset
    export let direction: ActivityDirection
    export let inclusionState: InclusionState
    export let formattedFiatValue: string = null
    export let amount: string = null
    export let unit: string
    export let storageDeposit = 0
    export let giftedStorageDeposit = 0
    export let subject: Subject = null
    export let transactionTime: Date = null

    $: formattedTransactionTime = formatDate(transactionTime, { dateStyle: 'long', timeStyle: 'medium' })
    $: hasStorageDeposit = storageDeposit || (storageDeposit === 0 && giftedStorageDeposit === 0)

    $: formattedStorageDeposit = formatTokenAmountPrecise(
        storageDeposit ?? 0,
        BASE_TOKEN[$activeProfile?.networkProtocol]
    )

    $: formattedGiftedStorageDeposit = formatTokenAmountPrecise(
        giftedStorageDeposit ?? 0,
        BASE_TOKEN[$activeProfile?.networkProtocol]
    )

    $: localePrefix = `tooltips.transactionDetails.${direction}.`

    let detailsList: { [key in string]: { data: string; tooltipText?: string } }
    $: detailsList = {
        transactionTime: { data: formattedTransactionTime },
        ...(hasStorageDeposit && {
            storageDeposit: {
                data: formattedStorageDeposit,
                tooltipText: localize(localePrefix + 'storageDeposit'),
            },
        }),
        ...(giftedStorageDeposit && {
            giftedStorageDeposit: {
                data: formattedGiftedStorageDeposit,
                tooltipText: localize(localePrefix + 'giftedStorageDeposit'),
            },
        }),
    }
</script>

<foundry-details class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
        {#if amount}
            <AmountBox {amount} fiatAmount={formattedFiatValue} {unit} {asset} />
        {/if}
        <foundry-status class="flex flex-row w-full space-x-2 justify-center">
            <ActivityInclusionStatusPill localizationKey={'foundry.minting'} {inclusionState} />
        </foundry-status>
        {#if subject}
            <SubjectBox {subject} />
        {/if}
    </main-content>
    {#if Object.entries(detailsList).length > 0}
        <details-list class="flex flex-col space-y-2">
            {#each Object.entries(detailsList) as [key, value]}
                <KeyValueBox
                    keyText={localize(`general.${key}`)}
                    valueText={value.data}
                    tooltipText={value.tooltipText}
                />
            {/each}
        </details-list>
    {/if}
</foundry-details>
