<script lang="typescript">
    import { ActivityTypePill, Pill, KeyValueBlock } from 'shared/components/atoms'
    import { Text, Button } from 'shared/components'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from 'shared/lib/currency'
    import { formatDate, localize } from '@core/i18n'
    import { getOfficialExplorer } from 'shared/lib/network'
    import { Platform } from 'shared/lib/platform'
    import { activeProfile } from 'shared/lib/profile'
    import { CurrencyTypes } from 'shared/lib/typings/currency'
    import { Payload } from 'shared/lib/typings/message'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { getMilestoneMessageValue, wallet } from 'shared/lib/wallet'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { getTransactionSubjectAddressOrAccount } from '@lib/utils/transactionObject'

    export let id: string
    export let timestamp: string
    export let confirmed: boolean
    export let payload: Payload
    export let balance: number // migration tx

    let date = localize('error.invalidDate')
    $: {
        try {
            date = formatDate(new Date(timestamp), {
                dateStyle: 'long',
                timeStyle: 'medium',
            })
        } catch {
            date = localize('error.invalidDate')
        }
    }
    const { accounts } = $wallet

    const cachedMigrationTx = !payload
    const milestonePayload = payload?.type === 'Milestone' ? payload : undefined
    const transactionPayload = payload?.type === 'Transaction' ? payload : undefined

    const explorerLink = getOfficialExplorer($accounts[0].clientOptions.network)

    let value = 0
    $: {
        if (cachedMigrationTx) {
            value = balance
        } else if (milestonePayload) {
            value = getMilestoneMessageValue(milestonePayload, $accounts)
        } else if (transactionPayload) {
            value = transactionPayload.data.essence.data.value
        }
    }
    $: currencyValue = convertToFiat(
        value,
        $currencies[CurrencyTypes.USD],
        $exchangeRates[$activeProfile?.settings.currency]
    )

    $: transactionSubjectAddressOrAccount = getTransactionSubjectAddressOrAccount(transactionPayload)
</script>

<transaction-details class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type="h3" fontWeight={FontWeightText.semibold} classes="text-left"
        >{localize('popups.transactionDetails.title')}</Text
    >
    <main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-4 mb-6">
        <transaction-amount class="flex flex-col space-y-0.5 items-center">
            <Text type="h1" fontWeight={FontWeightText.semibold}>{formatUnitBestMatch(value, true, 2)}</Text>
            <Text fontSize="md" color="gray-600">{formatCurrency(currencyValue)}</Text>
        </transaction-amount>
        <transaction-status class="flex flex-row w-full space-x-1 justify-center">
            <ActivityTypePill activity={transactionPayload} confirmed />
            <Pill backgroundColor={confirmed ? 'green-200' : 'gray-200'}>
                {localize(`general.${confirmed ? 'confirmed' : 'pending'}`).toLowerCase()}
            </Pill>
        </transaction-status>
        <transaction-subject-account class="flex flex-row flex-wrap justify-center items-center text-center">
            <Text type="pre" fontSize="16">{transactionSubjectAddressOrAccount}</Text>
        </transaction-subject-account>
    </main-content>

    <details-list class="flex flex-col space-y-2 mb-6">
        <KeyValueBlock keyText={localize('general.date')} valueText={date} />
    </details-list>
    <Button
        classes="w-full"
        secondary
        autofocus={false}
        onClick={() => Platform.openUrl(`${explorerLink}/message/${id}`)}
    >
        <Text bigger color="blue-500">{localize('general.viewOnExplorer')}</Text>
    </Button>
</transaction-details>
