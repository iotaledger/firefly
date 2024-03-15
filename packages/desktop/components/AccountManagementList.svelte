<script lang="ts">
    import { truncateString } from '@core/utils'
    import { AccountAddress, AccountOutput, Output, OutputData } from '@iota/sdk/out/types'
    import { Height, Pane, TextType, Text, ClickableTile, FontWeight, Pill } from '@ui'
    import { localize } from '@core/i18n'
    import { AddressConverter } from '@core/wallet/utils'
    import { selectedWalletMainAccountId, selectedWallet } from '@core/wallet'

    export let onAccountClick: (account: OutputData) => void
    export let selectedOutput: OutputData

    $: isSelected = (output: OutputData) => output.outputId === selectedOutput.outputId
    $: accountsOrdered = $selectedWallet.accountOutputs.sort((a, b) =>
        (a.output as AccountOutput).accountId > (b.output as AccountOutput).accountId ? 1 : -1
    )
    $: implicitAccountsOrdered = $selectedWallet.implicitAccountOutputs.sort((a, b) =>
        a.outputId > b.outputId ? 1 : -1
    )

    function iMainAccount(output: Output): boolean {
        return (output as AccountOutput).accountId === $selectedWalletMainAccountId
    }

    function formatAndTruncateAccount(output: Output): string {
        let address: string = ''
        const accountId = (output as AccountOutput)?.accountId
        if (!accountId) return ''
        address = AddressConverter.addressToBech32(new AccountAddress(accountId))
        return truncateString(address, 11, 9)
    }
</script>

<left-pane class="flex flex-col w-1/3">
    <Pane height={Height.Full}>
        <left-pane-container class="flex flex-col space-y-4 h-full scrollable-y">
            {#if accountsOrdered.length > 0}
                <Text type={TextType.h2}>{localize('views.accountManagement.list.accountTitle')}</Text>
                <list-wrapper class="flex flex-col space-y-2">
                    {#each accountsOrdered as output}
                        <ClickableTile onClick={() => onAccountClick(output)} selected={isSelected(output)}>
                            <div class="flex flex-col space-y-2">
                                <div class="flex space-x-2">
                                    <Text
                                        type={TextType.h5}
                                        color="gray-800"
                                        darkColor="gray-500"
                                        fontWeight={FontWeight.semibold}
                                    >
                                        {localize('views.accountManagement.list.tile.title')}
                                    </Text>
                                    {#if iMainAccount(output.output)}
                                        <Pill backgroundColor="blue-200" textColor="blue-600"
                                            >{localize('views.accountManagement.list.tile.pill.main')}</Pill
                                        >
                                    {/if}
                                </div>
                                <Text type={TextType.p} fontSize="13" lineHeight="leading-140" color="gray-600"
                                    >{formatAndTruncateAccount(output.output)}</Text
                                >
                            </div>
                        </ClickableTile>
                    {/each}
                </list-wrapper>
            {/if}
            <hr />
            {#if implicitAccountsOrdered.length > 0}
                <Text type={TextType.h2}>{localize('views.accountManagement.list.implicitTitle')}</Text>
                <list-wrapper class="flex flex-col space-y-2">
                    {#each implicitAccountsOrdered as output}
                        <ClickableTile onClick={() => onAccountClick(output)} selected={isSelected(output)}>
                            <div class="flex flex-col space-y-4">
                                <div class="flex space-x-2">
                                    <Text
                                        type={TextType.h5}
                                        color="gray-800"
                                        darkColor="gray-500"
                                        fontWeight={FontWeight.semibold}
                                    >
                                        {localize('views.accountManagement.list.tile.title')}
                                    </Text>
                                    <Pill backgroundColor="yellow-200" textColor="yellow-900"
                                        >{localize('views.accountManagement.list.tile.pill.pending')}</Pill
                                    >
                                </div>
                            </div>
                        </ClickableTile>
                    {/each}
                </list-wrapper>
            {/if}
        </left-pane-container>
    </Pane>
</left-pane>
