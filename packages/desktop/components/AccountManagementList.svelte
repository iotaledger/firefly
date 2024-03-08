<script lang="ts">
    import { truncateString } from '@core/utils'
    import { AccountAddress, AccountOutput, Output, OutputData } from '@iota/sdk/out/types'
    import { Height, Pane, TextType, Text, ClickableTile, FontWeight, Pill } from '@ui'
    import { localize } from '@core/i18n'
    import { getBech32AddressFromAddressTypes, isAccountOutput, isImplicitAccountOutput } from '@core/wallet/utils'
    import { selectedWalletMainAccountId } from '@core/wallet'

    export let onAccountClick: (account: OutputData) => void
    export let allOutputs: OutputData[] = []
    export let selectedOutput: OutputData

    $: isSelected = (output: OutputData) => output.outputId === selectedOutput.outputId

    function getAccountId(output: OutputData): string | undefined {
        return isAccountOutput(output) ? (output.output as AccountOutput)?.accountId : undefined
    }

    function formatAndTruncateAccount(output: Output): string {
        let address: string = ''
        const accountId = (output as AccountOutput)?.accountId
        if (!accountId) return ''
        address = getBech32AddressFromAddressTypes(new AccountAddress(accountId))
        return truncateString(address, 7, 5)
    }
</script>

<left-pane class="flex flex-col w-1/3">
    <Pane height={Height.Full}>
        <left-pane-container class="flex flex-col space-y-10 h-full">
            <Text type={TextType.h2}>{localize('views.accountManagement.list.title')}</Text>
            <list-wrapper class="flex flex-col space-y-2">
                {#each allOutputs as output, index}
                    <ClickableTile onClick={() => onAccountClick(output)} selected={isSelected(output)}>
                        <div class="flex flex-col space-y-1">
                            <div class="flex space-x-2">
                                <Text
                                    type={TextType.h5}
                                    color="gray-800"
                                    darkColor="gray-500"
                                    fontWeight={FontWeight.semibold}
                                >
                                    {localize('views.accountManagement.list.tile.title')}
                                    {index + 1}
                                </Text>
                                {#if getAccountId(output) === $selectedWalletMainAccountId}
                                    <Pill backgroundColor="blue-200" textColor="blue-600"
                                        >{localize('views.accountManagement.list.tile.pill.main')}</Pill
                                    >
                                {/if}
                                {#if isImplicitAccountOutput(output.output)}
                                    <Pill backgroundColor="yellow-200" textColor="yellow-900"
                                        >{localize('views.accountManagement.list.tile.pill.pending')}</Pill
                                    >
                                {/if}
                            </div>
                            {#if isAccountOutput(output)}
                                <Text type={TextType.p} fontSize="12" lineHeight="leading-140" color="gray-600"
                                    >{formatAndTruncateAccount(output.output)}</Text
                                >
                            {/if}
                        </div>
                    </ClickableTile>
                {/each}
            </list-wrapper>
        </left-pane-container>
    </Pane>
</left-pane>
