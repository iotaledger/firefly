<script lang="ts">
    import { truncateString } from '@core/utils'
    import { AccountAddress, AccountOutput, ImplicitAccountCreationAddress, OutputData } from '@iota/sdk/out/types'
    import { Height, Pane, TextType, Text, ClickableTile, FontWeight, Pill } from '@ui'
    import { localize } from '@core/i18n'
    import { getBech32AddressFromAddressTypes, isImplicitAccountOutput } from '@core/wallet/utils'
    import { selectedWallet } from '@core/wallet'

    export let allAccounts: OutputData[] = []

    function isAnAccount(output: OutputData) {
        return $selectedWallet?.accountOutputs.find((account) => account.outputId === output.outputId)
    }

    function isAnImplicitAccount(output: OutputData) {
        return $selectedWallet?.implicitAccountOutputs.find((account) => account.outputId === output.outputId)
    }

    function formatAndTruncateAccount(output) {
        let address: string = ''
        if (isImplicitAccountOutput(output)) {
            address = getBech32AddressFromAddressTypes(
                new ImplicitAccountCreationAddress(output.unlockConditions[0].address.pubKeyHash).address()
            )
        } else {
            const accountId = (output as AccountOutput).accountId
            if (accountId) {
                address = getBech32AddressFromAddressTypes(new AccountAddress(accountId))
            }
        }
        return truncateString(address, 7, 5)
    }
    function handleAccountClick() {
        // TODO: Implement account details
    }
</script>

<left-pane class="flex flex-col w-1/3">
    <Pane height={Height.Full}>
        <left-pane-container class="flex flex-col space-y-10 h-full">
            <Text type={TextType.h2}>{localize('views.accountManagement.list.title')}</Text>
            <list-wrapper class="flex flex-col space-y-2">
                {#each allAccounts as account, index}
                    <ClickableTile onClick={handleAccountClick}>
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
                                {#if isAnAccount(account)}
                                    <Pill backgroundColor="blue-200" textColor="blue-600"
                                        >{localize('views.accountManagement.list.tile.pill.main')}</Pill
                                    >
                                {/if}
                                {#if isAnImplicitAccount(account)}
                                    <Pill backgroundColor="yellow-200" textColor="yellow-900"
                                        >{localize('views.accountManagement.list.tile.pill.pending')}</Pill
                                    >
                                {/if}
                            </div>
                            <Text type={TextType.p} fontSize="12" lineHeight="leading-140" color="gray-600"
                                >{formatAndTruncateAccount(account.output)}</Text
                            >
                        </div>
                    </ClickableTile>
                {/each}
            </list-wrapper>
        </left-pane-container>
    </Pane>
</left-pane>
