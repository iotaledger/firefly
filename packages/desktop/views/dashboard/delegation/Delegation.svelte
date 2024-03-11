<script lang="ts">
    import { localize } from '@core/i18n'
    import { selectedWallet } from '@core/wallet/stores'
    import {
        Height,
        Pane,
        Button,
        Tile,
        Text,
        TextType,
        FontWeight,
        ButtonSize,
        CopyableBox,
        BoxedIconWithText,
    } from '@ui'
    import { activeProfile } from '@core/profile'
    import { formatTokenAmountBestMatch, AddressConverter, getClient, selectedWalletAssets } from '@core/wallet'
    import { truncateString } from '@core/utils'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { OutputType, DelegationOutput, AccountAddress, OutputData } from '@iota/sdk/out/types'
    import { PopupId, openPopup } from '@auxiliary/popup'
    import features from '@features/features'

    let delegationData: IDelegationTable[] = []
    let currentEpoch = 0

    enum Header {
        DelegationId = 'delegationId',
        DelegatedFunds = 'delegatedFunds',
        Rewards = 'rewards',
        Epochs = 'epochs',
        DelegatedAddress = 'delegatedAddress',
        Action = 'action',
    }

    interface IDelegationTable {
        [Header.DelegationId]: string
        [Header.DelegatedFunds]: number
        [Header.Rewards]: number
        [Header.Epochs]: number
        [Header.DelegatedAddress]: string
        [Header.Action]: () => void
    }

    // TODO: update interface when available
    interface DelegationOutputTemp extends DelegationOutput {
        validatorAddress: AccountAddress
    }

    $: delegationOutputs =
        $selectedWallet?.walletUnspentOutputs?.filter((output) => output?.output?.type === OutputType.Delegation) || []
    $: delegationOutputs?.length > 0 && getCurrentEpoch()
    $: delegationOutputs?.length > 0 && currentEpoch && mappedDelegationData(delegationOutputs)
    $: ({ baseCoin } = $selectedWalletAssets[$activeProfile?.network.id])

    async function mappedDelegationData(delegationOutputs: OutputData[]): Promise<void> {
        const result =
            delegationOutputs?.map(async (output) => {
                const delegationOutput = output.output as DelegationOutputTemp
                return {
                    [Header.DelegationId]: delegationOutput.delegationId,
                    [Header.DelegatedFunds]: Number(delegationOutput.delegatedAmount),
                    [Header.Rewards]: await getOutputRewards(output.outputId),
                    [Header.Epochs]: currentEpoch - delegationOutput.startEpoch - 2,
                    [Header.DelegatedAddress]: AddressConverter.addressToBech32(delegationOutput.validatorAddress),
                    [Header.Action]: handleClaimRewards,
                }
            }) || []
        delegationData = await Promise.all(result)
    }

    async function getOutputRewards(outputId: string): Promise<number> {
        const client = await getClient()
        const rewards = await client.getRewards(outputId)
        return Number(rewards)
    }

    async function getCurrentEpoch(): Promise<void> {
        const client = await getClient()
        const comittee = await client.getCommittee()
        currentEpoch = comittee.epoch
    }

    function handleDelegate(): void {
        openPopup({
            id: PopupId.CreateDelegation,
        })
    }

    function handleClaimRewards(): void {
        // TODO: add logic to claim reward
    }

    function renderCellValue(value: any, header: string): { component: any; props: any; text?: string } {
        switch (header as Header) {
            case Header.DelegationId:
                return {
                    component: CopyableBox,
                    props: {
                        value: value,
                        isCopyable: true,
                        clearBoxPadding: true,
                        clearBackground: true,
                        classes: 'text-gray-600 dark:text-white text-xs font-semibold',
                    },
                    text: truncateString(value, 5, 5, 3),
                }
            case Header.DelegatedFunds:
                return {
                    component: BoxedIconWithText,
                    props: {
                        icon: IconEnum.Lock,
                        text: baseCoin ? formatTokenAmountBestMatch(Math.round(value), baseCoin.metadata) : value,
                        boxClasses: 'bg-gray-100 w-6 h-6 rounded-full text-blue-500',
                        width: 20,
                        height: 20,
                    },
                }
            case Header.Rewards:
                return {
                    component: BoxedIconWithText,
                    props: {
                        icon: IconEnum.Star,
                        text: baseCoin ? formatTokenAmountBestMatch(Math.round(value), baseCoin.metadata) : value,
                        boxClasses: 'bg-orange-100 w-6 h-6 rounded-full text-orange-600',
                        width: 20,
                        height: 20,
                    },
                }
            case Header.Epochs:
                return {
                    component: Text,
                    props: { color: 'gray-600', fontWeight: FontWeight.medium, fontSize: '12', type: TextType.p },
                    text: localize('views.delegation.table.body.epochs', {
                        values: {
                            epochs: value,
                        },
                    }),
                }
            case Header.DelegatedAddress:
                return {
                    component: CopyableBox,
                    props: {
                        value: value,
                        isCopyable: true,
                        clearBoxPadding: true,
                        clearBackground: true,
                        classes: 'text-gray-600 dark:text-white text-xs font-medium',
                    },
                    text: truncateString(value, 5, 5, 3),
                }
            case Header.Action:
                return {
                    component: Button,
                    props: { size: ButtonSize.Small, onClick: value, outline: true },
                    text: 'Claim Rewards',
                }
            default:
                return {
                    component: Text,
                    props: { type: TextType.h3 },
                    text: value,
                }
        }
    }
</script>

{#if $selectedWallet}
    <delegation-container class="w-full h-full flex flex-nowrap p-8 relative space-x-4 justify-center">
        <Pane height={Height.Full}>
            <div class="flex flex-col space-y-10 max-w-7xl w-full p-8">
                <div class="flex flex-row justify-between">
                    <Text type={TextType.h2}>{localize('views.delegation.title')}</Text>
                    <Button onClick={handleDelegate}>{localize('views.delegation.action.delegate')}</Button>
                </div>
                <div class="flex flex-row space-x-4 w-2/3">
                    <Tile>
                        <div class="flex flex-col space-y-2 items-center justify-center w-full">
                            <Text type={TextType.h3}>24 Gi</Text>
                            <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}
                                >{localize('views.delegation.info.funds')}</Text
                            >
                        </div>
                    </Tile>
                    <Tile>
                        <div class="flex flex-col space-y-2 items-center justify-center w-full">
                            <Text type={TextType.h3}>12 Gi</Text>
                            <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}
                                >{localize('views.delegation.info.delegated')}</Text
                            >
                        </div>
                    </Tile>
                    <Tile>
                        <div class="flex flex-col space-y-2 items-center justify-center w-full">
                            <Text type={TextType.h3}>0i</Text>
                            <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}
                                >{localize('views.delegation.info.rewards')}</Text
                            >
                        </div>
                    </Tile>
                </div>
                {#if features.delegation.delegationList.enabled}
                    {#if delegationData.length > 0}
                        <table class="flex flex-col w-full space-y-4 h-80">
                            <thead class="w-full">
                                <tr class="flex flex-row justify-between align-items w-full">
                                    {#each Object.values(Header) as header}
                                        <th class="text-start w-60 flex-1">
                                            <Text
                                                color="gray-600"
                                                fontWeight={FontWeight.medium}
                                                fontSize="12"
                                                type={TextType.p}
                                                >{localize(`views.delegation.table.header.${header}`)}</Text
                                            >
                                        </th>
                                    {/each}
                                </tr>
                            </thead>
                            <tbody class="flex flex-col w-full space-y-4 scrollable-y">
                                {#each delegationData as data}
                                    <tr
                                        class="flex flex-row items-center w-full border-solid border-b border-gray-200 dark:border-gray-600 py-4"
                                    >
                                        {#each Object.entries(data) as [key, value]}
                                            {@const renderCell = renderCellValue(value, key)}
                                            <td class="text-start w-60 flex-1">
                                                {#if renderCell.text}
                                                    <svelte:component this={renderCell.component} {...renderCell.props}>
                                                        {renderCell.text}
                                                    </svelte:component>
                                                {:else}
                                                    <svelte:component
                                                        this={renderCell.component}
                                                        {...renderCell.props}
                                                    />
                                                {/if}
                                            </td>
                                        {/each}
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    {:else}
                        <div class="flex flex-col w-full items-center px-40">
                            <Text secondary>{localize('views.delegation.table.emptyData')}</Text>
                        </div>
                    {/if}
                {/if}
            </div>
        </Pane>
    </delegation-container>
{/if}
