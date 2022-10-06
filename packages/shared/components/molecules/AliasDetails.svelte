<script lang="typescript">
    import { AddressBox, KeyValueBox, ActivityInclusionStatusPill } from 'shared/components'
    import { formatDate, localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import { formatTokenAmountPrecise, InclusionState } from '@core/wallet'
    import { BASE_TOKEN } from '@core/network'

    export let storageDeposit = 0
    export let giftedStorageDeposit = 0
    export let inclusionState: InclusionState
    export let aliasId: string = null
    export let governorAddress: string = null
    export let stateControllerAddress: string = null
    export let transactionTime: Date = null

    $: formattedTransactionTime = formatDate(transactionTime, { dateStyle: 'long', timeStyle: 'medium' })
    $: hasStorageDeposit = storageDeposit || (storageDeposit === 0 && giftedStorageDeposit === 0)

    $: formattedStorageDeposit = formatTokenAmountPrecise(
        storageDeposit ?? 0,
        BASE_TOKEN[$activeProfile?.networkProtocol]
    )

    let detailsList: { [key in string]: { data: string; tooltipText?: string; isCopyable?: boolean } }
    $: detailsList = {
        transactionTime: { data: formattedTransactionTime },
        ...(hasStorageDeposit && {
            storageDeposit: {
                data: formattedStorageDeposit,
                tooltipText: localize('tooltips.transactionDetails.incomingstorageDeposit'),
            },
        }),
        governorAddress: { data: governorAddress, isCopyable: true },
        stateControllerAddress: { data: stateControllerAddress, isCopyable: true },
    }
</script>

<alias-details class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
        <alias-status class="flex flex-row w-full space-x-2 justify-center">
            <ActivityInclusionStatusPill localizationKey={'alias.creation'} {inclusionState} />
        </alias-status>
        <AddressBox clearBackground clearPadding isCopyable address={aliasId} />
    </main-content>
    {#if Object.entries(detailsList).length > 0}
        <details-list class="flex flex-col space-y-2">
            {#each Object.entries(detailsList) as [key, value]}
                <KeyValueBox
                    keyText={localize(`general.${key}`)}
                    valueText={value.data}
                    tooltipText={value.tooltipText}
                    isCopyable={value.isCopyable}
                />
            {/each}
        </details-list>
    {/if}
</alias-details>
