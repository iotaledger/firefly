<script lang="ts">
    import { truncateString } from '@core/utils'
    import { OutputData } from '@iota/sdk/out/types'
    import { Height, Pane, TextType, Text, ClickableTile, FontWeight, Pill } from '@ui'
    import { localize } from '@core/i18n'
    import { getAddressFromOutput, isAccountOutput, isImplicitAccountOutput } from '@core/wallet/utils'
    import { selectedWallet } from '@core/wallet'

    export let onAccountClick: (account: OutputData) => void

    const allAccountOutputs: OutputData[] = [
        ...$selectedWallet.accountOutputs,
        ...$selectedWallet.implicitAccountOutputs,
    ]

    function formatAndTruncateAccount(account): string {
        let address: string = ''
        address = getAddressFromOutput(account)
        return truncateString(address, 7, 5)
    }
</script>

<left-pane class="flex flex-col w-1/3">
    <Pane height={Height.Full}>
        <left-pane-container class="flex flex-col space-y-10 h-full">
            <Text type={TextType.h2}>{localize('views.accountManagement.list.title')}</Text>
            <list-wrapper class="flex flex-col space-y-2">
                {#each allAccountOutputs as account, index}
                    <ClickableTile onClick={() => onAccountClick(account)}>
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
                                {#if isAccountOutput(account)}
                                    <Pill backgroundColor="blue-200" textColor="blue-600"
                                        >{localize('views.accountManagement.list.tile.pill.main')}</Pill
                                    >
                                {/if}
                                {#if isImplicitAccountOutput(account.output)}
                                    <Pill backgroundColor="yellow-200" textColor="yellow-900"
                                        >{localize('views.accountManagement.list.tile.pill.pending')}</Pill
                                    >
                                {/if}
                            </div>
                            {#if isAccountOutput(account)}
                                <Text type={TextType.p} fontSize="12" lineHeight="leading-140" color="gray-600"
                                    >{formatAndTruncateAccount(account)}</Text
                                >
                            {/if}
                        </div>
                    </ClickableTile>
                {/each}
            </list-wrapper>
        </left-pane-container>
    </Pane>
</left-pane>
