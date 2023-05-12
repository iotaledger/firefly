<script lang="ts">
    import { localize } from '@core/i18n'
    import { TimePeriod } from '@core/utils'
    import { Text, TooltipIcon } from '@ui'
    import DateTimePickerButton from './DateTimePickerButton.svelte'
    import { formatTokenAmountPrecise } from '@core/wallet'
    import { getBaseToken } from '@core/profile'

    export let destinationNetwork: string
    export let storageDeposit: number
    export let expirationDate: Date
    export let selectedExpirationPeriod: TimePeriod
    export let selectedTimelockPeriod: TimePeriod
    export let timelockDate: Date
    export let disableChangeExpiration: boolean
    export let disableChangeTimelock: boolean
    export let disableAll: boolean
</script>

<div class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg">
    {#if destinationNetwork}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <Text>{localize('general.destinationNetwork')}</Text>
            <Text>{destinationNetwork}</Text>
        </section>
    {/if}
    {#if storageDeposit}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <div class="flex flex-row">
                <Text>{localize('general.storageDeposit')}</Text>
                <TooltipIcon
                    title={localize('general.storageDeposit')}
                    text={localize('tooltips.transactionDetails.outgoing.storageDeposit')}
                    width={15}
                    height={15}
                    classes="ml-1"
                />
            </div>
            <Text>{formatTokenAmountPrecise(storageDeposit, getBaseToken())}</Text>
        </section>
    {/if}
    {#if selectedExpirationPeriod}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <div class="flex flex-row">
                <Text>{localize('general.expirationTime')}</Text>
                <TooltipIcon
                    title={localize('general.expirationTime')}
                    text={localize('tooltips.transactionDetails.outgoing.expirationTime')}
                    width={15}
                    height={15}
                    classes="ml-1"
                />
            </div>
            <DateTimePickerButton
                bind:value={expirationDate}
                bind:selected={selectedExpirationPeriod}
                disabled={disableChangeExpiration || disableAll}
            />
        </section>
    {/if}
    {#if selectedTimelockPeriod}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <div class="flex flex-row">
                <Text>{localize('general.timelockDate')}</Text>
                <TooltipIcon
                    title={localize('general.timelockDate')}
                    text={localize('tooltips.transactionDetails.outgoing.timelockDate')}
                    width={15}
                    height={15}
                    classes="ml-1"
                />
            </div>
            <DateTimePickerButton
                bind:value={timelockDate}
                bind:selected={selectedTimelockPeriod}
                disabled={disableChangeTimelock || disableAll}
            />
        </section>
    {/if}
</div>

<style lang="scss">
    .key-value-box {
        @apply flex flex-row justify-between p-4;
        @apply border-b border-solid;

        &:last-child {
            @apply border-0;
        }
    }
</style>
