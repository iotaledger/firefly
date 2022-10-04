<script lang="typescript">
    import { Box, AddressBox, KeyValueBox, AccountLabel } from 'shared/components/atoms'
    import { AssetIcon, Text } from 'shared/components'
    import { formatDate, localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import { FontWeight, TextType } from 'shared/components/Text.svelte'
    import { formatTokenAmountPrecise, Subject, ActivityDirection, IPersistedAsset } from '@core/wallet'
    import { BASE_TOKEN } from '@core/network'

    export let asset: IPersistedAsset
    export let direction: ActivityDirection
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

    $: localePrefix = `tooltips.transactionDetails.${direction === ActivityDirection.In ? 'incoming' : 'outgoing'}.`

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

<transaction-details class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
        {#if amount}
            <transaction-value class="flex flex-col items-center">
                <div class="flex flex-row space-x-3">
                    <AssetIcon {asset} />
                    <div class="flex flex-row flex-wrap justify-center items-baseline space-x-0.1">
                        <Text type={TextType.h1} fontWeight={FontWeight.semibold}>{amount}</Text>
                        {#if unit}
                            <Text type={TextType.h4} classes="ml-1" fontWeight={FontWeight.medium}>{unit}</Text>
                        {/if}
                    </div>
                </div>
                {#if formattedFiatValue}
                    <Text fontSize="md" color="gray-600" darkColor="gray-500">{formattedFiatValue}</Text>
                {/if}
            </transaction-value>
        {/if}
        {#if subject?.type === 'account'}
            <Box row clearBackground clearPadding classes="justify-center">
                <AccountLabel account={subject.account} />
            </Box>
        {:else if subject?.type === 'address'}
            <AddressBox clearBackground clearPadding isCopyable address={subject?.address} />
        {:else}
            <Box row clearBackground clearPadding classes="justify-center">
                <Text type={TextType.pre} fontSize="base" fontWeight={FontWeight.medium}>
                    {localize('general.unknownAddress')}
                </Text>
            </Box>
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
</transaction-details>
