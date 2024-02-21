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
    import { formatTokenAmountBestMatch, selectedWalletAssets } from '@core/wallet'
    import { truncateString } from '@core/utils'
    import { Icon as IconEnum } from '@auxiliary/icon'

    $: ({ baseCoin } = $selectedWalletAssets[$activeProfile?.network.id])

    enum Header {
        Name = 'name',
        DelegatedFunds = 'delegatedFunds',
        Rewards = 'rewards',
        Epoch = 'epoch',
        Address = 'address',
        Action = 'action',
    }

    interface IDelegationTable {
        [Header.Name]: string
        [Header.DelegatedFunds]: number
        [Header.Rewards]: number
        [Header.Epoch]: number
        [Header.Address]: string
        [Header.Action]: () => void
    }

    function handleDelegate(): void {
        // TODO: add logic to delegate an output
    }

    function handleClaimRewards(): void {
        // TODO: add logic to claim reward
    }

    const renderCellValue = (value: any, header: string): { component: any; props: any; text?: string } => {
        switch (header as Header) {
            case Header.Name:
                return {
                    component: Text,
                    props: { type: TextType.h5, fontWeight: FontWeight.semibold },
                    text: value,
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
            case Header.Epoch:
                return {
                    component: Text,
                    props: { color: 'gray-600', fontWeight: FontWeight.medium, fontSize: '12', type: TextType.p },
                    text: value + ' epochs',
                }
            case Header.Address:
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

    const MOCKED_DATA: IDelegationTable[] = [
        {
            [Header.Name]: 'Delegation 1',
            [Header.DelegatedFunds]: 23000000,
            [Header.Rewards]: 1000000,
            [Header.Epoch]: 4,
            [Header.Address]: 'iota1fcqdsazjzfhdpfv4ls9fazskhykprtat7ps72slsc3m9cfydveaqet3cop',
            [Header.Action]: handleClaimRewards,
        },
        {
            [Header.Name]: 'Delegation 1',
            [Header.DelegatedFunds]: 23000000,
            [Header.Rewards]: 1000000,
            [Header.Epoch]: 4,
            [Header.Address]: 'iota1fcqdsazjzfhdpfv4ls9fazskhykprtat7ps72slsc3m9cfydveaqet3cop',
            [Header.Action]: handleClaimRewards,
        },
        {
            [Header.Name]: 'Delegation 1',
            [Header.DelegatedFunds]: 23000000,
            [Header.Rewards]: 1000000,
            [Header.Epoch]: 4,
            [Header.Address]: 'iota1fcqdsazjzfhdpfv4ls9fazskhykprtat7ps72slsc3m9cfydveaqet3cop',
            [Header.Action]: handleClaimRewards,
        },
        {
            [Header.Name]: 'Delegation 1',
            [Header.DelegatedFunds]: 23000000,
            [Header.Rewards]: 1000000,
            [Header.Epoch]: 4,
            [Header.Address]: 'iota1fcqdsazjzfhdpfv4ls9fazskhykprtat7ps72slsc3m9cfydveaqet3cop',
            [Header.Action]: handleClaimRewards,
        },
        {
            [Header.Name]: 'Delegation 1',
            [Header.DelegatedFunds]: 23000000,
            [Header.Rewards]: 1000000,
            [Header.Epoch]: 4,
            [Header.Address]: 'iota1fcqdsazjzfhdpfv4ls9fazskhykprtat7ps72slsc3m9cfydveaqet3cop',
            [Header.Action]: handleClaimRewards,
        },
    ]
</script>

{#if $selectedWallet}
    <delegation-container class="w-full h-full flex flex-nowrap p-8 relative space-x-4 justify-center">
        <Pane height={Height.Full}>
            <div class="flex flex-col space-y-10 max-w-7xl w-full p-8">
                <div class="flex flex-row justify-between">
                    <Text type={TextType.h2}>{localize('views.delegation.title')}</Text>
                    <Button onClick={handleDelegate}>{localize('views.delegation.action.delegate')}</Button>
                </div>
                <div class="flex flex-row space-x-4 w-1/2">
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
                <table class="flex flex-col w-full space-y-4 h-80">
                    <thead class="w-full">
                        <tr class="flex flex-row justify-between align-items w-full">
                            {#each Object.values(Header) as header}
                                <th class="text-start w-60 flex-1">
                                    <Text
                                        color="gray-600"
                                        fontWeight={FontWeight.medium}
                                        fontSize="12"
                                        type={TextType.p}>{localize(`views.delegation.table.header.${header}`)}</Text
                                    >
                                </th>
                            {/each}
                        </tr>
                    </thead>
                    <tbody class="flex flex-col w-full space-y-4 scrollable-y">
                        {#each MOCKED_DATA as data}
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
                                            <svelte:component this={renderCell.component} {...renderCell.props} />
                                        {/if}
                                    </td>
                                {/each}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </Pane>
    </delegation-container>
{/if}
