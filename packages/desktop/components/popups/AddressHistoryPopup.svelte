<script lang="ts">
    import { selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { CHRONICLE_ADDRESS_HISTORY_ROUTE, CHRONICLE_URLS } from '@core/network/constants/chronicle-urls.constant'
    import { fetchWithTimeout } from '@core/nfts'
    import { checkActiveProfileAuth, getActiveProfile, updateAccountPersistedDataOnActiveProfile } from '@core/profile'
    import { getProfileManager } from '@core/profile-manager/stores'
    import { truncateString } from '@core/utils'
    import { AccountAddress } from '@iota/sdk/out/types'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { Button, FontWeight, KeyValueBox, Spinner, Text, TextType } from 'shared/components'
    import { onMount } from 'svelte'

    interface AddressHistory {
        address: string
        items: [
            {
                milestoneIndex: number
                milestoneTimestamp: number
                outputId: string
                isSpent: boolean
            }
        ]
    }

    const activeProfile = getActiveProfile()
    const ADDRESS_GAP_LIMIT = 20

    let knownAddresses: AccountAddress[] = []

    $: accountIndex = $selectedAccount?.index
    $: network = activeProfile?.network?.id

    let searchURL: string
    let searchAddressStartIndex = 0
    let currentSearchGap = 0
    let isBusy = false

    onMount(() => {
        knownAddresses = $selectedAccount?.knownAddresses
        if (!knownAddresses?.length) {
            isBusy = true
            $selectedAccount
                .addresses()
                .then((_knownAddresses) => {
                    knownAddresses = sortAddresses(_knownAddresses)
                    updateAccountPersistedDataOnActiveProfile(accountIndex, { knownAddresses })
                    isBusy = false
                })
                .finally(() => {
                    isBusy = false
                })
        }

        if (CHRONICLE_URLS[network] && CHRONICLE_URLS[network].length > 0) {
            const chronicleRoot = CHRONICLE_URLS[network][0]
            searchURL = `${chronicleRoot}${CHRONICLE_ADDRESS_HISTORY_ROUTE}`
        } else {
            throw new Error(localize('popups.addressHistory.errorNoChronicle'))
        }
    })

    async function isAddressWithHistory(address: string): Promise<boolean> {
        try {
            const response = await fetchWithTimeout(`${searchURL}${address}`, 3, { method: 'GET' })
            const addressHistory: AddressHistory = await response.json()
            return addressHistory?.items?.length > 0
        } catch (err) {
            throw new Error(localize('popups.addressHistory.errorFailedFetch'))
        }
    }

    async function generateNextUnknownAddress(): Promise<[string, number]> {
        let nextUnknownAddress: string
        try {
            do {
                nextUnknownAddress = await getProfileManager().generateEd25519Address(
                    accountIndex,
                    searchAddressStartIndex
                )

                searchAddressStartIndex++
            } while (knownAddresses.map((accountAddress) => accountAddress.address).includes(nextUnknownAddress))
        } catch (err) {
            throw new Error(localize('popups.addressHistory.errorFailedGenerate'))
        }

        return [nextUnknownAddress, searchAddressStartIndex - 1]
    }

    async function search(): Promise<void> {
        currentSearchGap = 0
        const tmpKnownAddresses = [...knownAddresses]
        while (currentSearchGap < ADDRESS_GAP_LIMIT) {
            const [nextAddressToCheck, addressIndex] = await generateNextUnknownAddress()
            if (!nextAddressToCheck) {
                isBusy = false
                break
            }

            const hasHistory = await isAddressWithHistory(nextAddressToCheck)
            if (hasHistory) {
                const accountAddress: AccountAddress = {
                    address: nextAddressToCheck,
                    keyIndex: addressIndex,
                    internal: false,
                    used: true,
                }

                tmpKnownAddresses.push(accountAddress)
            } else {
                currentSearchGap++
            }
        }
        knownAddresses = sortAddresses(tmpKnownAddresses)
        updateAccountPersistedDataOnActiveProfile(accountIndex, { knownAddresses })
    }

    async function handleSearchClick(): Promise<void> {
        isBusy = true
        try {
            await checkActiveProfileAuth(search, { stronghold: true, ledger: true })
        } catch (err) {
            handleError(err)
        } finally {
            isBusy = false
        }
    }

    function sortAddresses(addresses: AccountAddress[] = []): AccountAddress[] {
        return addresses.sort((a, b) => a.keyIndex - b.keyIndex)
    }
</script>

<div class="flex flex-col space-y-6">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} lineHeight="6">
        {localize('popups.addressHistory.title')}
    </Text>
    {#if knownAddresses}
        {#if knownAddresses.length > 0}
            <div class="w-full flex-col space-y-2 virtual-list-wrapper">
                <VirtualList items={knownAddresses} let:item>
                    <div class="mb-1">
                        <KeyValueBox
                            isCopyable
                            classes="flex items-center w-full py-4"
                            keyText={truncateString(item?.address, 15, 15)}
                            valueText={localize('popups.addressHistory.indexAndType', {
                                values: {
                                    index: item.keyIndex,
                                    internal: item.internal,
                                },
                            })}
                            copyValue={item.address}
                            backgroundColor="gray-50"
                            darkBackgroundColor="gray-900"
                        />
                    </div>
                </VirtualList>
            </div>
        {:else}
            <Text secondary classes="text-center">-</Text>
        {/if}
    {:else}
        <div class="flex items-center justify-center">
            <Spinner />
        </div>
    {/if}
</div>
<div class="flex flex-row flex-nowrap w-full space-x-4 mt-6">
    <Button
        classes="w-full"
        onClick={handleSearchClick}
        disabled={isBusy}
        {isBusy}
        busyMessage={localize('actions.searching')}
    >
        {localize('actions.search')}
    </Button>
</div>

<style lang="scss">
    .virtual-list-wrapper :global(svelte-virtual-list-viewport) {
        margin-right: -1rem !important;
        flex: auto;
        overflow-y: scroll;
        padding-right: 1.5rem !important;
        min-height: 52px;
        max-height: 300px;
    }

    .virtual-list-wrapper :global(svelte-virtual-list-contents) {
        margin-right: -1rem !important;
    }
</style>
